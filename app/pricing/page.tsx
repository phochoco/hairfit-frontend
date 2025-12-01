"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

type UserMe = {
  email: string;
  shop_name: string | null;
  plan_type: string;
  credits: number;
};

const PLANS = [
  {
    id: "free",
    name: "Free",
    description: "회원가입 시 기본 제공",
    credits: 0,
    badge: "기본",
    highlight: false,
  },
  {
    id: "starter",
    name: "Starter",
    description: "체험용, 소규모 샵 추천",
    credits: 30,
    badge: "인기",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    description: "단골 많은 매장용",
    credits: 100,
    badge: "프로",
    highlight: false,
  },
  {
    id: "vip",
    name: "VIP",
    description: "여러 지점을 운영하는 원장님용",
    credits: 300,
    badge: "스튜디오용",
    highlight: false,
  },
];

export default function PricingPage() {
  const [me, setMe] = useState<UserMe | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  // 내 정보 불러오기
  const fetchMe = async () => {
    try {
      const token =
        (typeof window !== "undefined" &&
          (localStorage.getItem("hairfit_token") ||
            localStorage.getItem("token"))) ||
        null;

      if (!token) {
        alert("로그인이 필요합니다.");
        router.push("/");
        return;
      }

      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMe(res.data);
    } catch (err) {
      console.error(err);
      alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
      router.push("/");
    }
  };

  useEffect(() => {
    fetchMe();
  }, [router]);

  // 플랜 적용
  const handleApplyPlan = async (planId: string) => {
    try {
      const token =
        (typeof window !== "undefined" &&
          (localStorage.getItem("hairfit_token") ||
            localStorage.getItem("token"))) ||
        null;

      if (!token) {
        alert("로그인이 필요합니다.");
        router.push("/");
        return;
      }

      if (!confirm(`${planId.toUpperCase()} 플랜을 적용할까요? (테스트 모드: 결제 없이 크레딧만 충전됩니다)`)) {
        return;
      }

      setLoadingPlan(planId);

      const res = await axios.post(
        `${API_URL}/plans/apply`,
        { plan_type: planId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message);
      // 화면 상단 정보 갱신
      setMe((prev) =>
        prev
          ? {
              ...prev,
              plan_type: res.data.plan_type,
              credits: res.data.credits,
            }
          : prev
      );
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.detail ||
        "플랜 적용 중 오류가 발생했습니다.";
      alert(msg);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 상단 헤더 */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              HairFit 요금제
            </h1>
            <p className="text-gray-500 mt-2">
              “헤어는 그대로, 얼굴만 AI로 안전하게 생성합니다. 초상권 부담 없이 자유롭게 활용할 수 있는 스타일링 이미지 서비스입니다.”
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            ← 대시보드로 돌아가기
          </button>
        </header>

        {/* 내 현재 상태 */}
        {me && (
          <div className="mb-10 bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                로그인 계정
              </div>
              <div className="font-semibold text-gray-800">
                {me.email}{" "}
                {me.shop_name && (
                  <span className="text-gray-400 text-sm">
                    ({me.shop_name})
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <div className="text-right">
                <div className="text-xs text-gray-500">현재 플랜</div>
                <div className="font-bold">
                  {me.plan_type?.toUpperCase() || "FREE"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">보유 크레딧</div>
                <div className="font-bold text-yellow-600">
                  {me.credits} 크레딧
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 요금제 카드들 */}
        <div className="grid gap-6 md:grid-cols-4">
          {PLANS.map((plan) => {
            const isCurrent = me?.plan_type === plan.id;

            return (
              <div
                key={plan.id}
                className={`flex flex-col bg-white rounded-2xl border p-5 shadow-sm ${
                  plan.highlight
                    ? "border-blue-500 ring-1 ring-blue-100"
                    : "border-gray-100"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">{plan.name}</h2>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      plan.highlight
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>

                <div className="text-2xl font-bold mb-1">
                  {plan.credits === 0 ? "무료" : `${plan.credits} 크레딧`}
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  {plan.description}
                </p>

                <div className="mt-auto">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-lg border border-gray-200 text-gray-400 text-sm"
                    >
                      현재 사용 중
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyPlan(plan.id)}
                      disabled={loadingPlan === plan.id}
                      className={`w-full py-2 rounded-lg text-sm font-semibold ${
                        plan.highlight
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-900 text-white hover:bg-black"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loadingPlan === plan.id
                        ? "적용 중..."
                        : `${plan.name} 플랜 적용`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-gray-400">
          * 현재는 베타 테스트용으로 결제 없이 버튼 클릭 시 크레딧만 충전됩니다.
          실제 운영 시에는 결제 완료 후에만 이 화면을 통해 플랜을 적용하도록 연동하면 됩니다.
        </p>
      </div>
    </div>
  );
}
