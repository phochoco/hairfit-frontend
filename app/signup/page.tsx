"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ 공통 백엔드 URL (환경변수 우선)
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://hairfit-backend-production.up.railway.app";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(`${API_URL}/signup/`, {
        email: email,
        password: password,
        shop_name: shopName,
      });

      alert("회원가입이 완료되었습니다! 이제 로그인해 주세요.");
      router.push("/"); // 로그인 페이지로 이동
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.detail ||
        "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.";
      setError(msg);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          HairFit AI 회원가입
        </h1>
        <p className="text-center text-gray-500 mb-8">
          미용실 원장님 전용 계정을 생성합니다.
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              미용실 이름
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="예: 헤어핏 살롱 부산점"
              required
            />
          </div>

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
              placeholder="최소 6자 이상"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center whitespace-pre-line">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200"
          >
            회원가입
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-blue-600 cursor-pointer font-bold hover:underline"
          >
            로그인
          </span>
        </p>
      </div>
    </div>
  );
}
