"use client";

import { useState, useRef, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
import axios from "axios";
import { Upload, Eraser, Download, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import EXIF from "exif-js";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

// 세로/가로 방향 타입
type Orientation = "portrait" | "landscape";

const getOrientation = (w: number, h: number): Orientation =>
  h >= w ? "portrait" : "landscape";

export default function Dashboard() {
  // 항상 이 image(dataURL)만 "진짜 원본"으로 사용 (File은 업로드에 사용 X)
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("30대");

  // 👇 표정 상태 추가
  const [expression, setExpression] = useState<
    "neutral" | "soft_smile" | "bright_smile" | "professional"
  >("neutral");

  const [styleMode, setStyleMode] = useState("natural_model"); // 기본값 C

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [credits, setCredits] = useState(0);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [statusMessage, setStatusMessage] =
    useState("AI가 변환 중입니다...");

  // 1크레딧 / 2크레딧 모드
  const [mode, setMode] = useState<"basic" | "fullstyle">("basic");

  // 🔵 프롬프트 버전 (V3 확장)
  const [promptVersion, setPromptVersion] =
  useState<"v3" | "v3_random">("v3");

  // 모바일 여부
  const [isMobile, setIsMobile] = useState(false);

  // 현재 입력 이미지 방향(세로/가로)
  const [inputOrientation, setInputOrientation] =
    useState<Orientation>("portrait");

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

  // 브러시 두께
  const [brushRadius, setBrushRadius] = useState(8);

  useEffect(() => {
    setBrushRadius(isMobile ? 2 : 8);
  }, [isMobile]);

  // 가짜 프로그레스
  useEffect(() => {
    if (!isGenerating) return;

    const start = Date.now();
    const total = 10000;

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

  // 📷 이미지 업로드 (File은 EXIF용으로만 쓰고, 서버 전송에는 절대 사용 X)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const result = ev.target?.result;
      if (!result) return;

      // 새 이미지 업로드 시 마스크 초기화
      canvasRef.current?.clear?.();

      // ✅ PC / 태블릿: EXIF 보정 없이 그대로 사용
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
          setInputOrientation(getOrientation(img.width, img.height));
        };
        img.src = result as string;
        return;
      }

      // ✅ 모바일: EXIF + 자동 회전 로직
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;

        // 1) EXIF Orientation 읽기
        let orientation = 1;
        try {
          (EXIF as any).getData(file, function (this: any) {
            orientation = (EXIF as any).getTag(this, "Orientation") || 1;
          });
        } catch (err) {
          console.warn("EXIF read failed, fallback to auto-rotate");
        }

        // 2) 화면 비율 기반 자동 감지
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
        setInputOrientation(
          getOrientation(canvas.width, canvas.height)
        );
      };

      img.src = result as string;
    };

    reader.readAsDataURL(file);
  };

  // ↻ 업로드 후 수동 90° 회전 (PC/모바일 공통) — 항상 image를 덮어쓰기
  const handleRotateImage = () => {
    if (!image) return;

    const img = new Image();
    img.onload = () => {
      const w = img.width;
      const h = img.height;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 90도 회전 → 가로/세로 스왑
      canvas.width = h;
      canvas.height = w;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -w / 2, -h / 2);

      const rotatedDataUrl = canvas.toDataURL("image/jpeg", 0.9);

      let baseWidth = 500;
      if (typeof window !== "undefined") {
        const vw = window.innerWidth;
        if (vw < 768) baseWidth = vw - 48;
      }
      const displayWidth = Math.min(500, baseWidth);
      const displayHeight =
        (canvas.height / canvas.width) * displayWidth;

      // 화면에 보이는 이미지 = 서버로 업로드되는 유일한 이미지
      setWidth(displayWidth);
      setHeight(displayHeight);
      setImage(rotatedDataUrl);

      // 방향 토글
      setInputOrientation((prev) =>
        prev === "portrait" ? "landscape" : "portrait"
      );

      // 방향이 바뀌었으니 마스크 초기화
      canvasRef.current?.clear?.();
    };

    img.src = image;
  };

  // 결과 이미지 방향을 입력 방향에 맞춰 자동 보정 + 로그/에러 방어
  const fixResultOrientation = (
    src: string,
    desired: Orientation
  ): Promise<string> => {
    return new Promise((resolve) => {
      console.log("[fixResultOrientation] start", { src, desired });

      const img = new Image();

      // CORS 문제 파악용
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          const current = getOrientation(w, h);

          console.log("[fixResultOrientation] onload", {
            width: w,
            height: h,
            current,
            desired,
          });

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            console.warn("[fixResultOrientation] no 2d context, return src");
            resolve(src);
            return;
          }

          // 방향이 같으면 그냥 다시 인코딩(EXIF 제거용)
          if (current === desired) {
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0);
            try {
              const out = canvas.toDataURL("image/jpeg", 0.95);
              console.log(
                "[fixResultOrientation] same orientation, re-encode only"
              );
              resolve(out);
            } catch (err) {
              console.error(
                "[fixResultOrientation] toDataURL error(same orientation)",
                err
              );
              resolve(src);
            }
            return;
          }

          // 👉 방향이 다르면 90도 회전해서 맞춰줌
          canvas.width = h;
          canvas.height = w;
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((90 * Math.PI) / 180);
          ctx.drawImage(img, -w / 2, -h / 2);

          try {
            const rotated = canvas.toDataURL("image/jpeg", 0.95);
            console.log(
              "[fixResultOrientation] rotated 90deg to match desired"
            );
            resolve(rotated);
          } catch (err) {
            console.error(
              "[fixResultOrientation] toDataURL error(rotated)",
              err
            );
            resolve(src);
          }
        } catch (err) {
          console.error("[fixResultOrientation] onload handler error", err);
          resolve(src);
        }
      };

      img.onerror = (e) => {
        console.error("[fixResultOrientation] onerror", e);
        resolve(src);
      };

      // 캐시 우회용 파라미터 추가
      const urlWithBust =
        src + (src.includes("?") ? "&" : "?") + "cbuster=" + Date.now();

      img.src = urlWithBust;
    });
  };

  // 1크레딧 / 2크레딧 공용 생성 함수
  const handleGenerate = async () => {
    if (!image) {
      alert("사진을 먼저 올려주세요.");
      return;
    }

    const needCredits = mode === "fullstyle" ? 2 : 1;
    if (credits < needCredits) {
      alert(`${needCredits} 크레딧이 필요합니다.`);
      return;
    }

    setLoading(true);
    setIsGenerating(true);
    setFakeProgress(5);
    setStatusMessage("AI가 변환 중입니다...");

    try {
      console.log("[handleGenerate] inputOrientation:", inputOrientation);
      console.log("[handleGenerate] image dataURL length:", image.length);
      console.log(
        "[handleGenerate] image dataURL preview:",
        image.slice(0, 80)
      );

      const maskData = canvasRef.current.getDataURL(
        "image/png",
        false,
        "#000000"
      );
      console.log(
        "[handleGenerate] mask dataURL length:",
        maskData.length
      );

      const token =
        localStorage.getItem("hairfit_token") ||
        localStorage.getItem("token");

            const endpoint =
        mode === "fullstyle"
          ? `${API_URL}/generate/fullstyle`
          : `${API_URL}/generate/`;

      console.log("[handleGenerate] endpoint:", endpoint);

      // 🔥 payload 구성
      const payload: any = {
        image_url: image,
        mask_url: maskData,
        gender,
        age,
        expression,        // 표정 옵션
        style_mode: styleMode, // ⭐ 스타일 모드 A/B/C 전달
      };

      // basic 모드에서만 prompt_version 사용 (v3 / v3_random)
      if (mode === "basic") {
        payload.prompt_version = promptVersion;
      }


      console.log("[handleGenerate] sending payload:", {
        ...payload,
        image_url_len: image.length,
        mask_url_len: maskData.length,
      });

      const response = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawUrl = response.data.result_url;
      console.log("[handleGenerate] raw FLUX url:", rawUrl);

      const fixed = await fixResultOrientation(rawUrl, inputOrientation);
      console.log(
        "[handleGenerate] fixed result url (after canvas):",
        fixed.slice(0, 80)
      );

      setResult(fixed);
      setCredits(response.data.remaining_credits);

      setFakeProgress(100);
      setStatusMessage("변환이 완료되었어요!");

      setTimeout(() => {
        setFakeProgress(0);
      }, 1500);

      alert("변환 성공!");
    } catch (error) {
      console.error("[handleGenerate] ERROR:", error);
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
              Re-Fac Art
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

          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
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

            {/* 수동 회전 버튼 */}
            <button
              type="button"
              onClick={handleRotateImage}
              disabled={!image}
              className="mt-2 md:mt-0 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 px-3 py-2 text-xs md:text-sm shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              사진 90° 회전
            </button>
          </div>

          {/* 캔버스 영역 */}
          <div className="flex justify-center">
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center w-full"
              style={{
                maxWidth: width,
                height: height > 0 ? height : 300,
                touchAction: "pan-y",
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
              {/* 모드 선택 */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  생성 모드
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* ... 1크레딧 / 2크레딧 버튼 ... */}
                </div>
              </div>

              {/* 🟣 스타일 모드 선택 (A/B/C) */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  스타일 모드
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs md:text-sm">
                  {/* A: 여자 아이돌 */}
                  <button
                    type="button"
                    onClick={() => setStyleMode("idol_female")}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left ${
                      styleMode === "idol_female"
                        ? "border-pink-500 bg-pink-50 text-pink-800"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="font-semibold">A. 여자 아이돌</span>
                    <span className="text-[11px] text-gray-500">
                      aespa / IVE / NewJeans 느낌, 화보 스타일
                    </span>
                  </button>

                  {/* B: 남자 아이돌 */}
                  <button
                    type="button"
                    onClick={() => setStyleMode("idol_male")}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left ${
                      styleMode === "idol_male"
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="font-semibold">B. 남자 아이돌</span>
                    <span className="text-[11px] text-gray-500">
                      BTS / SEVENTEEN 느낌, 또렷한 아이돌 얼굴
                    </span>
                  </button>

                  {/* C: 내추럴 (기본값) */}
                  <button
                    type="button"
                    onClick={() => setStyleMode("natural_model")}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left ${
                      styleMode === "natural_model"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="font-semibold">C. 내추럴 모델 (기본)</span>
                    <span className="text-[11px] text-gray-500">
                      과하지 않은 자연스러운 패션 모델 톤
                    </span>
                  </button>
                </div>
              </div>

              {/* 👇 표정 선택 블록 */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  표정
                </label>
                {/* ... 표정 버튼들 ... */}
              </div>

                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm">
  {/* V3 기본 */}
  <button
    type="button"
    onClick={() => setPromptVersion("v3")}
    className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left ${
      promptVersion === "v3"
        ? "border-slate-800 bg-slate-900 text-white"
        : "border-gray-200 bg-gray-50 text-gray-700"
    }`}
  >
    <span className="font-semibold">V3 강화 버전 (추천)</span>
    <span className="text-[11px]">
      헤어 유지 · 얼굴만 자연스럽게 교체.
    </span>
  </button>

  {/* V3 랜덤 */}
  <button
    type="button"
    onClick={() => setPromptVersion("v3_random")}
    className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left ${
      promptVersion === "v3_random"
        ? "border-slate-800 bg-slate-900 text-white"
        : "border-gray-200 bg-gray-50 text-gray-700"
    }`}
  >
    <span className="font-semibold">V3 랜덤 인물 스타일러</span>
    <span className="text-[11px]">
      헤어 유지 · 매번 다른 얼굴, 초상권 안전 모드.
    </span>
  </button>
</div>

              {/* 👇 표정 선택 블록 추가 */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  표정
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                  <button
                    type="button"
                    onClick={() => setExpression("neutral")}
                    className={`rounded-xl border p-2 text-left ${
                      expression === "neutral"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="font-semibold">기본 표정</div>
                    <div className="text-[11px] text-gray-500">
                      자연스럽고 무난한 표정
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpression("soft_smile")}
                    className={`rounded-xl border p-2 text-left ${
                      expression === "soft_smile"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="font-semibold">부드러운 미소</div>
                    <div className="text-[11px] text-gray-500">
                      입을 다문 상태의 은은한 미소
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpression("bright_smile")}
                    className={`rounded-xl border p-2 text-left ${
                      expression === "bright_smile"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="font-semibold">밝은 미소</div>
                    <div className="text-[11px] text-gray-500">
                      이가 살짝 보이는 자연스러운 미소
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpression("professional")}
                    className={`rounded-xl border p-2 text-left ${
                      expression === "professional"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="font-semibold">프로페셔널</div>
                    <div className="text-[11px] text-gray-500">
                      단정하고 차분한 인상
                    </div>
                  </button>
                </div>
              </div>

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

              {/* 생성 버튼 + 프로그레스 */}
              <div className="mt-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !image}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGenerating
                    ? "AI가 변환 중입니다..."
                    : mode === "fullstyle"
                    ? "프리미엄 AI 변환 시작 (2 크레딧 차감)"
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
                download
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
