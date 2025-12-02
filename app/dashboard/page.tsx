"use client";

import { useState, useRef, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
import axios from "axios";
import { Upload, Eraser, Download, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import EXIF from "exif-js";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export default function Dashboard() {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("30대");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [credits, setCredits] = useState(0);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0); // 0~100
  const [statusMessage, setStatusMessage] =
    useState("AI가 변환 중입니다...");

  // 📱 모바일 여부 (브러시 크기 조절용)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✏️ 브러시 두께 (슬라이더용)
  const [brushRadius, setBrushRadius] = useState(8);

  useEffect(() => {
    setBrushRadius(isMobile ? 2 : 8); // 모바일 기본 2px, PC 기본 8px
  }, [isMobile]);

  // ⏳ AI 변환 가짜 프로그레스
  useEffect(() => {
    if (!isGenerating) return;

    const start = Date.now();
    const total = 8000;

    setFakeProgress(5);
    setStatusMessage("AI가 변환 중입니다...");

    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const target = Math.min(90, Math.round((elapsed / total) * 90));
      setFakeProgress((prev) => (target > prev ? target : prev));
    }, 300);

    return () => clearInterval(id);
  }, [isGenerating]);

  const canvasRef = useRef<any>(null);
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hairfit_token");
      localStorage.removeItem("token");
    }
    router.push("/");
  };

  const fetchMyInfo = async () => {
    try {
      const token =
        localStorage.getItem("hairfit_token") ||
        localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredits(res.data.credits);
      setUserName(res.data.email.split("@")[0]);
      setUserEmail(res.data.email);
    } catch (err) {
      console.error("정보 불러오기 실패", err);
    }
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("hairfit_token") ||
          localStorage.getItem("token")
        : null;

    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/");
    } else {
      fetchMyInfo();
    }
  }, [router]);

  // 📷 이미지 업로드 + EXIF + 자동 회전 보정
  // 📷 이미지 업로드 (모바일은 EXIF 회전, PC는 원래 방식)
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (ev: ProgressEvent<FileReader>) => {
    const result = ev.target?.result;
    if (!result) return;

    // ✅ 1) PC / 태블릿 넓은 화면: 예전처럼 그대로 사용 (회전 보정 X)
    if (!isMobile) {
      const img = new Image();
      img.onload = () => {
        const ratio = img.height / img.width;

        let baseWidth = 500;
        if (typeof window !== "undefined") {
          const vw = window.innerWidth;
          if (vw < 768) {
            baseWidth = vw - 48;
          }
        }
        const newWidth = Math.min(500, baseWidth);
        const newHeight = newWidth * ratio;

        setWidth(newWidth);
        setHeight(newHeight);
        setImage(result as string);
      };
      img.src = result as string;
      return;
    }

    // ✅ 2) 모바일: EXIF + 자동 회전 로직 유지
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;

      // 1) EXIF Orientation 읽기 시도
      let orientation = 1;
      try {
        (EXIF as any).getData(file, function (this: any) {
          orientation = (EXIF as any).getTag(this, "Orientation") || 1;
        });
      } catch (err) {
        console.warn("EXIF read failed, fallback to auto-rotate");
      }

      // 2) EXIF 없거나 이상할 때, 화면 비율 기반 자동 감지
      const autoRotateNeeded = (() => {
        const isPortraitDisplay = window.innerWidth < window.innerHeight;
        const orientationMismatch =
          (w > h && isPortraitDisplay) || (h > w && !isPortraitDisplay);
        return orientationMismatch;
      })();

      const needRotate =
        orientation !== 1 || autoRotateNeeded ? true : false;

      let rotateDeg = 0;

      if (orientation === 6) rotateDeg = 90;
      else if (orientation === 8) rotateDeg = -90;
      else if (orientation === 3) rotateDeg = 180;
      else if (autoRotateNeeded) rotateDeg = 90;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (needRotate && (rotateDeg === 90 || rotateDeg === -90)) {
        canvas.width = h;
        canvas.height = w;
      } else {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotateDeg * Math.PI) / 180);
      ctx.drawImage(img, -w / 2, -h / 2);

      const fixedDataUrl = canvas.toDataURL("image/jpeg", 0.9);

      let baseWidth = 500;
      if (typeof window !== "undefined") {
        const vw = window.innerWidth;
        if (vw < 768) baseWidth = vw - 48;
      }
      const displayWidth = Math.min(500, baseWidth);
      const displayHeight =
        (canvas.height / canvas.width) * displayWidth;

      setWidth(displayWidth);
      setHeight(displayHeight);
      setImage(fixedDataUrl);
    };

    img.src = result as string;
  };

  reader.readAsDataURL(file);
};


  const handleGenerate = async () => {
    if (!image) return alert("사진을 먼저 올려주세요.");
    if (credits <= 0) return alert("크레딧이 부족합니다!");

    setLoading(true);
    setIsGenerating(true);
    setFakeProgress(5);
    setStatusMessage("AI가 변환 중입니다...");

    try {
      const maskData = canvasRef.current.getDataURL(
        "image/png",
        false,
        "#000000"
      );
      const token =
        localStorage.getItem("hairfit_token") ||
        localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/generate/`,
        {
          image_url: image,
          mask_url: maskData,
          gender,
          age,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResult(response.data.result_url);
      setCredits(response.data.remaining_credits);

      setFakeProgress(100);
      setStatusMessage("변환이 완료되었어요!");

      setTimeout(() => {
        setFakeProgress(0);
      }, 1500);

      alert("변환 성공!");
    } catch (error) {
      console.error(error);
      setStatusMessage("오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
      alert("변환 실패. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:p-8">
      {/* 상단 네비게이션 */}
      <nav className="mb-6 md:mb-8 bg-white px-4 py-3 md:p-4 rounded-xl shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* 왼쪽: 로고 + 크레딧 */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">
              HairFit Studio
            </h1>
            <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
              <Coins className="text-yellow-500" size={20} />
              <span className="font-bold text-yellow-700">
                {credits} 크레딧
              </span>
            </div>
          </div>

          {/* 상단 메뉴 버튼 영역 */}
          <div
            className="
              mt-3 md:mt-0
              grid grid-cols-2 md:flex
              gap-2 md:gap-3
              w-full md:w-auto
            "
          >
            <button
              onClick={() => router.push("/guide")}
              className="inline-flex items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm shadow-sm hover:bg-indigo-100 whitespace-nowrap"
            >
              이용안내
            </button>

            <button
              onClick={() => router.push("/pricing")}
              className="inline-flex items-center justify-center rounded-full border border-yellow-300 bg-yellow-50 text-yellow-700 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm shadow-sm hover:bg-yellow-100 whitespace-nowrap"
            >
              크레딧 충전
            </button>

            <button
              onClick={() => router.push("/mypage")}
              className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-700 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm shadow-sm hover:bg-red-100 whitespace-nowrap"
            >
              나의 이용 내역
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-slate-700 px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm shadow-sm hover:bg-slate-50 whitespace-nowrap"
            >
              로그아웃
            </button>
          </div>
        </div>
      </nav>

      {/* 본문 영역 */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* 왼쪽: 작업 공간 */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            1. 사진 업로드 & 변경할 부분 색칠
          </h2>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition text-sm md:text-base">
              <Upload size={18} />
              <span>고객 사진 선택하기</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* 캔버스 영역 */}
          <div className="flex justify-center">
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center w-full"
              style={{
                maxWidth: width,
                height: height > 0 ? height : 300,
                touchAction: "pan-y", // 📱 모바일에서 pinch-zoom 방지
              }}
            >
              {!image ? (
                <p className="text-gray-400 text-sm md:text-base">
                  사진을 올려주세요
                </p>
              ) : (
                <>
                  <img
                    src={image}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />
                  <CanvasDraw
                    ref={canvasRef}
                    brushColor="rgba(255, 255, 255, 0.8)"
                    brushRadius={brushRadius}
                    lazyRadius={isMobile ? 0 : 2}
                    canvasWidth={width}
                    canvasHeight={height}
                    hideGrid={true}
                    backgroundColor="transparent"
                    className="absolute inset-0"
                  />
                </>
              )}
            </div>
          </div>

          {/* 브러시 컨트롤 */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
            {/* 버튼 영역 */}
            <div className="flex flex-row gap-2">
              <button
                onClick={() => canvasRef.current?.undo()}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                되돌리기
              </button>

              <button
                onClick={() => canvasRef.current?.clear()}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
              >
                <Eraser size={14} /> 지우기
              </button>
            </div>

            {/* 슬라이더 영역 */}
            <div className="flex items-center gap-2 w-full md:flex-1">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                브러시 두께
              </span>
              <input
                type="range"
                min={isMobile ? 1 : 2}
                max={isMobile ? 16 : 24}
                step={1}
                value={brushRadius}
                onChange={(e) => setBrushRadius(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500 w-8 text-right">
                {brushRadius}
              </span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 옵션 및 결과 */}
        <div className="space-y-6">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">2. 옵션 선택</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  성별
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    남성
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    여성
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  연령대
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option>20대</option>
                  <option>30대</option>
                  <option>40대</option>
                </select>
              </div>

              {/* AI 변환 버튼 + 진행 바 */}
              <div className="mt-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !image}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGenerating
                    ? "AI가 변환 중입니다..."
                    : "AI 변환 시작 (1 크레딧 차감)"}
                </button>

                {(isGenerating || fakeProgress > 0) && (
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-gray-500">
                      <span>{statusMessage}</span>
                      {isGenerating && <span>{fakeProgress}%</span>}
                      {!isGenerating &&
                        fakeProgress === 100 && <span>완료!</span>}
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400 transition-all duration-300"
                        style={{
                          width: `${Math.max(5, fakeProgress)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {result && (
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border-2 border-blue-100">
              <h2 className="text-lg font-semibold mb-4 text-blue-800">
                ✨ 변환 결과
              </h2>
              <img
                src={result}
                alt="Result"
                className="w-full rounded-lg mb-4"
              />
              <a
                href={result}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-gray-800 text-white py-2 rounded-lg hover:bg-black transition flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Download size={18} /> 고화질 다운로드
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
