from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel

import models, schemas, crud, auth, flux
from database import SessionLocal, engine


# ----- DB 초기화 -----
models.Base.metadata.create_all(bind=engine)


# ----- FastAPI 앱 생성 -----
app = FastAPI()


# ----- 서버 시작 시 DB 연결 테스트 -----
@app.on_event("startup")
def test_db_connection():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Neon DB 연결 성공!")
    except Exception as e:
        print("❌ Neon DB 연결 실패:", e)
        # 필요하면 서버를 바로 죽이고 싶을 때 주석 해제
        # raise


# ----- CORS 설정 -----
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----- DB 세션 -----
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----- 기본 루트 -----
@app.get("/")
def read_root():
    return {"message": "HairFit API is running!"}


# =========================
#  회원가입 / 로그인
# =========================
@app.post("/signup/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")
    return crud.create_user(db=db, user=user)


@app.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    # 1. 유저 찾기
    user = crud.get_user_by_email(db, email=form_data.username)

    # 2. 비번 검사
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 틀렸습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. 통과하면 토큰 발급
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# =========================
#  공통: 현재 로그인 유저
# =========================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str | None = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="자격 증명이 유효하지 않습니다.")
    except auth.jwt.JWTError:
        raise HTTPException(status_code=401, detail="자격 증명이 유효하지 않습니다.")

    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=401, detail="사용자를 찾을 수 없습니다.")
    return user


# =========================
#  AI 이미지 생성 (크레딧 차감)
# =========================
class AIRequest(BaseModel):
    image_url: str
    mask_url: str
    gender: str
    age: str


@app.post("/generate/")
def generate_image(
    request: AIRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 1. 크레딧 확인
    if current_user.credits <= 0:
        raise HTTPException(status_code=402, detail="크레딧이 부족합니다. 충전해주세요.")

    try:
        # 2. AI 작업 수행
        result_url = flux.generate_hair_fit(
            request.image_url,
            request.mask_url,
            request.gender,
            request.age,
        )

        # 3. 크레딧 차감 & 생성 기록 저장
        current_user.credits -= 1

        new_generation = models.Generation(
            user_id=current_user.id,
            input_image=request.image_url,
            result_image=result_url,
        )
        db.add(new_generation)
        db.commit()
        db.refresh(current_user)

        return {
            "result_url": result_url,
            "remaining_credits": current_user.credits,
            "message": "생성 성공! 크레딧이 1 차감되었습니다.",
        }

    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"이미지 생성 중 오류: {repr(e)}",
        )


# =========================
#  관리자 기능
# =========================
def get_current_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="관리자 권한이 필요합니다.")
    return current_user


@app.get("/admin/users", response_model=list[schemas.UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):
    return db.query(models.User).all()


@app.put("/admin/users/{user_id}", response_model=schemas.UserResponse)
def update_user_status(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):
    updated_user = crud.update_user(db, user_id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    return updated_user


# (임시) 셀프 승진용 엔드포인트 — 테스트 끝나면 삭제 추천
#@app.get("/promote_me")
#def promote_me(email: str, db: Session = Depends(get_db)):
    #user = crud.get_user_by_email(db, email)
    #if not user:
        #return {"msg": "그런 유저 없는데요?"}
    #user.role = "admin"
    #db.commit()
    #return {"msg": f"{email}님을 관리자로 임명했습니다!"}


# =========================
#  내 정보 조회 (크레딧 확인용)
# =========================
@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user
