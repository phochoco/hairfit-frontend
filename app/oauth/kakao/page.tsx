"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setErrorMsg("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    if (!code) {
      setErrorMsg("카카오에서 인증 코드가 전달되지 않았습니다.");
      return;
    }

    const exchangeCode = async () => {
      try {
        // 백엔드에 code 넘겨서 우리 서비스용 토큰 발급
        const res = await axios.get(
          `${API_URL}/auth/kakao/callback`,
          {
            params: { code },
          }
        );

        const { access_token, email } = res.data;

        if (!access_token) {
          throw new Error("토큰이 없습니다.");
        }

        // 기존 이메일 로그인과 동일한 키 사용
        localStorage.setItem("hairfit_token", access_token);
        if (email) {
          localStorage.setItem("hairfit_email", email);
        }

        // 대시보드로 이동
        router.replace("/dashboard");
      } catch (err) {
        console.error(err);
        setErrorMsg("카카오 로그인 처리 중 오류가 발생했습니다.");
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white px-8 py-6 rounded-xl shadow-md text-center space-y-3">
        {errorMsg ? (
          <>
            <div className="text-red-500 font-semibold mb-2">
              {errorMsg}
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm hover:bg-black"
            >
              로그인 화면으로 돌아가기
            </button>
          </>
        ) : (
          <>
            <div className="animate-pulse text-lg font-semibold">
              카카오 계정으로 로그인 중입니다...
            </div>
            <p className="text-gray-500 text-sm">
              잠시만 기다려 주세요. 자동으로 대시보드로 이동합니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
