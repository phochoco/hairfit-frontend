"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ 공통 백엔드 URL (환경변수 우선, 없으면 Railway)
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://hairfit-backend-production.up.railway.app";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ 여기서 formData 생성
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(
        `${API_URL}/token`,
        formData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const token = response.data.access_token;

      // ✅ 토큰/이메일 저장 (대시보드/관리자에서 공통 사용)
      if (typeof window !== "undefined") {
        localStorage.setItem("hairfit_token", token);
        localStorage.setItem("hairfit_email", email);
      }

      alert("로그인 성공! 원장님 환영합니다.");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("이메일이나 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          HairFit AI
        </h1>
        <p className="text-center text-gray-500 mb-8">
          미용실 고객 스타일링 솔루션
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              아이디 (이메일)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="salon@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200"
          >
            로그인
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          아직 회원이 아니신가요?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-600 cursor-pointer font-bold hover:underline"
          >
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
}
