"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

await axios.post(`${API_URL}/signup/`, {
  email,
  password,
  shop_name: shopName,
});

export default function SignupPage() { // [중요] 함수 이름이 SignupPage입니다.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // [회원가입 API 호출]
      await axios.post(`${API_URL}/signup/`, {
  email: email,
  password: password,
  shop_name: shopName, // 백엔드에서 이 필드를 받도록 되어 있다면 그대로 유지
});

      alert("가입 성공! 이제 로그인해주세요.");
      router.push("/"); // 로그인 페이지로 이동

    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setError("이미 등록된 이메일입니다.");
      } else {
        setError("가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">회원가입</h1> {/* [제목 확인] */}

        <form onSubmit={handleSignup} className="space-y-4"> {/* [함수 확인] */}
          <div>
            <label className="block text-sm font-medium text-gray-700">아이디 (이메일)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@hairfit.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="8자 이상 입력"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">미용실 이름</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="헤어핏 살롱"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            가입하기
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-500">
          이미 계정이 있으신가요? <span onClick={() => router.push("/")} className="text-blue-600 cursor-pointer font-bold hover:underline">로그인</span>
        </p>
      </div>
    </div>
  );
}