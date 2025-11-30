"use client";

import { useState, useRef, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
import axios from "axios";
import { Upload, Eraser, Wand2, Download, LogOut, Coins } from "lucide-react"; // Coins 아이콘 추가
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export default function Dashboard() {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("30대");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  // [NEW] 크레딧 상태 추가
  const [credits, setCredits] = useState(0);
  const [userName, setUserName] = useState("");
  
  const canvasRef = useRef<any>(null);
  const router = useRouter();

  // 👇 여기 추가
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hairfit_token");
      localStorage.removeItem("token");
    }
    router.push("/");
  };

  // [NEW] 내 정보(크레딧) 불러오기 함수
  const fetchMyInfo = async () => {
  try {
    const token =
      localStorage.getItem("hairfit_token") ||
      localStorage.getItem("token"); // 둘 중 하나라도 있으면 사용
    if (!token) return;

    const res = await axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCredits(res.data.credits);
    setUserName(res.data.email.split("@")[0]);
  } catch (err) {
    console.error("정보 불러오기 실패", err);
  }
};

  // 페이지 로드 시 실행
  useEffect(() => {
  const token =
    localStorage.getItem("hairfit_token") ||
    localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    router.push("/");
  } else {
    fetchMyInfo();
  }
}, [router]);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new Image();
          img.src = event.target.result as string;
          img.onload = () => {
            const ratio = img.height / img.width;
            const newWidth = 500;
            const newHeight = 500 * ratio;
            setWidth(newWidth);
            setHeight(newHeight);
            setImage(event.target?.result as string);
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ⬇⬇⬇ **여기가 핵심**: handleGenerate 함수 전체를 Dashboard 컴포넌트 안, return 위에 넣어줘야 해
  const handleGenerate = async () => {
    if (!image) return alert("사진을 먼저 올려주세요.");
    if (credits <= 0) return alert("크레딧이 부족합니다!");

    setLoading(true);

    try {
      const maskData = canvasRef.current.getDataURL("image/png", false, "#000000");
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
      alert("변환 성공!");
    } catch (error) {
      console.error(error);
      alert("변환 실패. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };
  // ⬆⬆⬆ 여기까지가 handleGenerate


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* 상단 네비게이션 */}
      <nav className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">HairFit Studio</h1>
        
        <div className="flex items-center gap-6">
          {/* [NEW] 크레딧 표시기 */}
          <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
            <Coins className="text-yellow-500" size={20} />
            <span className="font-bold text-yellow-700">{credits} 크레딧</span>
          </div>

          <div className="text-gray-600">
            안녕하세요, <b>{userName}</b> 원장님
          </div>

          <button
  onClick={handleLogout}
  className="text-gray-400 hover:text-red-500 flex items-center gap-2 text-sm"
>
  <LogOut size={18} /> 로그아웃
</button>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* 왼쪽: 작업 공간 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            1. 사진 업로드 & 얼굴 색칠하기
          </h2>
          
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition">
              <Upload size={18} />
              <span>고객 사진 선택하기</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center"
               style={{ width: 500, height: height > 0 ? height : 300 }}>
            
            {!image ? (
              <p className="text-gray-400">사진을 올려주세요</p>
            ) : (
              <>
                <img 
                  src={image} 
                  alt="Original" 
                  className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" 
                  style={{ width: width, height: height }}
                />
                <CanvasDraw
                  ref={canvasRef}
                  brushColor="rgba(255, 255, 255, 0.8)"
                  brushRadius={15}
                  lazyRadius={0}
                  canvasWidth={width}
                  canvasHeight={height}
                  hideGrid={true}
                  backgroundColor="transparent"
                  className="absolute top-0 left-0"
                />
              </>
            )}
          </div>

          <div className="mt-4 flex gap-2">
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
        </div>

        {/* 오른쪽: 옵션 및 결과 */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">2. 옵션 선택</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">성별</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" value="male" checked={gender === "male"} onChange={(e) => setGender(e.target.value)} />
                    남성 (무쌍/훈남)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" value="female" checked={gender === "female"} onChange={(e) => setGender(e.target.value)} />
                    여성 (K-Beauty)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">연령대</label>
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

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "AI가 변신 중입니다..."
                ) : (
                  <>
                    <Wand2 /> AI 변환 시작 (1 크레딧 차감)
                  </>
                )}
              </button>
            </div>
          </div>

          {result && (
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-100">
              <h2 className="text-lg font-semibold mb-4 text-blue-800">✨ 변환 결과</h2>
              <img src={result} alt="Result" className="w-full rounded-lg mb-4" />
              <a 
                href={result} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center bg-gray-800 text-white py-2 rounded-lg hover:bg-black transition flex items-center justify-center gap-2"
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