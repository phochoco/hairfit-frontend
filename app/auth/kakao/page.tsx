"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://hairfit-backend-production.up.railway.app";

export default function KakaoAuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState("카카오 계정 확인 중입니다...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 클라이언트에서만 동작
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) {
      setError("카카오에서 전달된 코드가 없습니다.");
      setStatus("로그인에 실패했습니다.");
      return;
    }

    const run = async () => {
      try {
        setStatus("카카오 로그인 처리 중입니다...");

        const res = await axios.post(`${API_URL}/auth/kakao`, {
         code,
        });
        const token = res.data.access_token;
        const email = res.data.email;

        if (!token) {
          throw new Error("토큰이 응답에 없습니다.");
        }

        // 우리 서비스 토큰/이메일 저장
        localStorage.setItem("hairfit_token", token);
        if (email) {
          localStorage.setItem("hairfit_email", email);
        }

        setStatus("로그인 성공! 대시보드로 이동합니다...");
        // 잠깐 메시지 보여주고 이동해도 되고, 바로 이동해도 되고
        router.replace("/dashboard");
      } catch (err) {
        console.error(err);
        setError("카카오 로그인 처리 중 오류가 발생했습니다.");
        setStatus("로그인에 실패했습니다.");
      }
    };

    run();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">카카오 로그인</h1>
        <p className="text-gray-700 mb-2">{status}</p>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        <p className="text-xs text-gray-400 mt-6">
          브라우저를 닫지 말고 잠시만 기다려 주세요.
        </p>
      </div>
    </div>
  );
}
