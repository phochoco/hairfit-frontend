"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const response = await axios.post(
  `${API_URL}/token`,
  formData,
  {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  }
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      // 🔥 하드코딩 대신 API_URL 사용
      const response = await axios.post(
        `${API_URL}/token`,
        formData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const token = response.data.access_token;

      // 🔥 토큰 키 이름 통일 (hairfit_token)
      localStorage.setItem("hairfit_token", token);
      localStorage.setItem("hairfit_email", email);

      alert("로그인 성공! 원장님 환영합니다.");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);

      // 상태 코드에 따라 메시지 분리도 가능 (선택)
      if (err.response?.status === 401) {
        setError("이메일이나 비밀번호가 틀렸습니다.");
      } else {
        setError("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
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
