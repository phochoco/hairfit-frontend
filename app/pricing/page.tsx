"use client";

import { useRouter } from "next/navigation";
import { Check, ChevronLeft, Sparkles, Crown, Star } from "lucide-react";
import axios from "axios";

type Plan = {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  highlight?: boolean;
  badge?: string;
  bestFor: string;
  bonusText?: string;
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "₩0",
    credits: 5,
    description: "Re-Fac Art를 가볍게 체험해 보는 무료 플랜입니다.",
    bestFor: "첫 사용 테스트, 샘플 확인용",
    badge: "체험용",
  },
  {
    id: "starter",
    name: "Starter",
    price: "₩3,000",
    credits: 30,
    description: "가볍게 여러 컷을 테스트해 보고 싶은 개인 사용자용.",
    bestFor: "인스타/프로필 사진 몇 장 테스트",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₩9,000",
    credits: 100,
    description: "꾸준히 얼굴 교체가 필요한 크리에이터/셀러용.",
    bestFor: "유튜브 썸네일, 상세페이지 이미지 제작",
    highlight: true,
    badge: "가장 인기",
  },
  {
    id: "premium",
    name: "Premium",
    price: "₩25,000",
    credits: 330,
    description: "보너스 크레딧이 포함된 고효율 패키지.",
    bestFor: "정기적으로 촬영/편집이 많은 1인 크리에이터",
    bonusText: "+10% 보너스 포함",
  },
  {
    id: "ultra",
    name: "Ultra",
    price: "₩49,000",
    credits: 650,
    description: "디자이너/사진작가/프리랜서를 위한 고용량 패키지.",
    bestFor: "여러 고객 작업을 동시에 진행하는 전문가",
    bonusText: "+20% 보너스 포함",
  },
  {
    id: "studio",
    name: "Studio",
    price: "₩99,000",
    credits: 1400,
    description: "미용실/스튜디오 전용 대용량 패키지.",
    bestFor: "지점/직원이 여러 명인 매장, 스튜디오",
    bonusText: "+30% 보너스 포함",
    badge: "샵/스튜디오 추천",
  },
];

export default function PricingPage() {
  const router = useRouter();

  const handleSelectPlan = async (planId: string) => {
  // Free 플랜은 결제 대신 바로 대시보드로
  if (planId === "free") {
    router.push("/dashboard");
    return;
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hairfit_token") ||
        localStorage.getItem("token")
      : null;

  if (!token) {
    alert("로그인이 필요합니다. 먼저 로그인 해주세요.");
    router.push("/");
    return;
  }

  try {
    const res = await axios.post(
      `${API_URL}/plans/apply`,
      { plan_type: planId }, // "starter" | "pro" | "premium" | "ultra" | "studio"
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data as {
      message: string;
      plan_type: string;
      credits: number;
    };

    alert(
      `${data.message}\n\n현재 잔여 크레딧: ${data.credits.toLocaleString()}`
    );

    // 대시보드로 이동 → /users/me 다시 불러와서 크레딧 표시됨
    router.push("/dashboard");
  } catch (err) {
    console.error(err);
    alert("크레딧 적용에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }
};


  return (
    <div className="min-h-screen bg-slate-50">
      {/* 상단 바 */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-1 text-xs md:text-sm text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
            대시보드로 돌아가기
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-800">
              Re-Fac Art 크레딧 충전
            </span>
          </div>
        </div>
      </header>

      {/* 메인 컨테이너 */}
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        {/* 히어로 영역 */}
        <section className="mb-8 md:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
            <Crown className="h-3 w-3" />
            Re-Fac Art · 크레딧 기반 얼굴 교체 AI
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            샵/스튜디오를 위한
            <br className="block md:hidden" /> 크레딧 기반 얼굴 교체 서비스
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
            Re-Fac Art는 실제 고객 얼굴을 그대로 쓰지 않고,
            <span className="font-medium"> 눈·코·입을 기준으로 AI가 자연스럽게 리페이스</span>
            해 주는 서비스입니다. 사용량에 따라 크레딧만 충전해 두고
            안심하고 활용하세요.
          </p>

          <ul className="mt-4 grid gap-2 text-xs text-slate-500 md:grid-cols-3 md:text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              초상권 부담 없이 헤어/메이크업 스타일 상담
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              1회 생성 시 기본 1 크레딧 차감
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              필요할 때마다 자유롭게 충전
            </li>
          </ul>
        </section>

        {/* 플랜 카드 */}
        <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
          {/* Free 플랜은 항상 첫 번째로 고정 */}
          <div className="md:col-span-1">
            <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                <Star className="h-3 w-3" />
                체험용
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Free
              </h2>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                ₩0
              </p>
              <p className="mt-1 text-xs text-slate-500">
                가입만 해도 <span className="font-semibold">5 크레딧</span>{" "}
                제공
              </p>

              <div className="mt-3 text-xs text-slate-600">
                <p>· Re-Fac Art가 어떻게 나오는지 먼저 테스트해 보세요.</p>
                <p>· 실제 매장 적용 전, 사전 샘플용으로 활용하기 좋습니다.</p>
              </div>

              <div className="mt-4 flex flex-1 flex-col justify-end">
                <button
                  onClick={() => handleSelectPlan("free")}
                  className="w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-black"
                >
                  무료로 시작하기
                </button>
              </div>
            </div>
          </div>

          {/* 유료 플랜들 */}
          <div className="md:col-span-2">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {PLANS.filter((p) => p.id !== "free").map((plan) => (
                <div
                  key={plan.id}
                  className={[
                    "flex h-full flex-col rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md",
                    plan.highlight
                      ? "border-indigo-300 bg-indigo-50/60"
                      : "border-slate-200",
                  ].join(" ")}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {plan.name}
                    </h2>
                    {plan.badge && (
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          plan.highlight
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-700",
                        ].join(" ")}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-2xl font-bold text-slate-900">
                    {plan.price}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    약{" "}
                    <span className="font-semibold">
                      {plan.credits.toLocaleString()} 크레딧
                    </span>
                    {plan.bonusText && (
                      <>
                        {" "}
                        <span className="text-emerald-600">
                          ({plan.bonusText})
                        </span>
                      </>
                    )}
                  </p>

                  <p className="mt-2 text-xs text-slate-600">
                    {plan.description}
                  </p>

                  <p className="mt-2 text-[11px] text-slate-500">
                    · 추천 대상:{" "}
                    <span className="font-medium">{plan.bestFor}</span>
                  </p>

                  <div className="mt-3 flex-1">
                    <ul className="space-y-1 text-[11px] text-slate-500">
                      <li className="flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        초상권 걱정 없이 마케팅 이미지 활용
                      </li>
                      <li className="flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        1회 생성 기본 1 크레딧 차감
                      </li>
                      <li className="flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        크레딧 소진 전까지 유효
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={[
                        "w-full rounded-xl px-3 py-2 text-sm font-semibold shadow-sm",
                        plan.highlight
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      이 플랜 선택하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 하단 안내 */}
        <section className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-4 text-xs text-slate-500 md:px-6 md:py-5 md:text-sm">
          <p className="font-medium text-slate-700">
            크레딧과 과금 방식 안내
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              · Re-Fac Art는{" "}
              <span className="font-semibold">
                1회 얼굴 교체 시 기본 1 크레딧
              </span>
              이 차감됩니다. (추가 옵션 도입 시, 상세 안내 예정)
            </li>
            <li>· 크레딧은 결제일로부터 일정 기간 동안 유효합니다.</li>
            <li>
              · 향후 카카오페이/카드 결제 기능이 연결되면, 이 페이지에서
              바로 결제가 가능하도록 업데이트될 예정입니다.
            </li>
            <li>
              · 미용실/스튜디오 전용 정기 구독 플랜도 추후 오픈 예정입니다.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
