// app/guide/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type GuideCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

function GuideCard({ title, subtitle, children }: GuideCardProps) {
  return (
    <section className="rounded-2xl bg-white shadow-sm border border-slate-100 px-5 py-5 md:px-6 md:py-6">
      <div className="mb-3">
        <h2 className="text-base md:text-lg font-semibold text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs md:text-sm text-slate-500 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      <div className="text-xs md:text-sm text-slate-700 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function GuidePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-6 md:px-6 md:pt-10">
        {/* 상단 헤더 + 돌아가기 / 요금제 버튼 */}
        <header className="mb-6 flex flex-col gap-4 md:mb-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              HairFit 이용안내
            </h1>
            <p className="mt-2 max-w-2xl text-xs md:text-sm text-slate-600 leading-relaxed">
              헤어는 그대로 두고, 얼굴만 AI로 자연스럽게 재구성하는 스타일링 이미지 서비스입니다.
              <br className="hidden md:block" />
              초상권 부담 없이 고객 상담, SNS 콘텐츠, 스타일 제안에 활용해 보세요.
            </p>
            <p className="mt-2 max-w-2xl text-[11px] md:text-xs text-slate-500 leading-relaxed">
              얼굴 일부가 가려져 있어도 대부분 잘 변환되며, 가장 자연스러운 결과는
              <span className="font-semibold"> &nbsp;눈·코·입만 마스킹</span>했을 때 만들어집니다.
              정면 또는 약간의 옆모습 등, 얼굴이 선명하게 보이는 사진이면 거의 모두 자연스럽게 생성됩니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <span className="text-base md:text-lg">↩</span>
              <span>대시보드로 돌아가기</span>
            </button>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-indigo-700 shadow-sm hover:bg-indigo-100"
            >
              <span>요금제 보기</span>
            </Link>
          </div>
        </header>

        {/* 본문 섹션들 */}
        <div className="flex flex-col gap-4 md:gap-5">
          {/* 1. HairFit 소개 */}
          <GuideCard
            title="1. HairFit Studio란?"
            subtitle="고객의 머리 스타일은 그대로 두고, 얼굴만 AI로 자연스럽게 바꾸는 스타일링 이미지 서비스입니다."
          >
            <ul className="space-y-1.5">
              <li>• 고객 사진을 업로드하면,</li>
              <li>• AI가 헤어와 분위기는 유지한 채 얼굴만 재구성하여,</li>
              <li>• 상담·SNS·홍보 이미지로 바로 활용할 수 있습니다.</li>
            </ul>
            <p className="mt-3 text-[11px] md:text-xs text-slate-500">
              ※ 원본 얼굴과는 다른 새로운 얼굴이 생성되므로, 실제 고객의 초상권 노출 부담을 크게 줄일 수 있습니다.
            </p>
          </GuideCard>

          {/* 2. 기본 사용 순서 */}
          <GuideCard
            title="2. 기본 사용 흐름"
            subtitle="대시보드 한 화면에서 업로드 → 마스킹 → 옵션 선택 → AI 변환까지 이어집니다."
          >
            <ol className="list-decimal pl-4 space-y-2">
              <li>
                <span className="font-medium">고객 사진 업로드</span>
                <p className="mt-1 text-slate-600">
                  정면 또는 약간 측면(45도) 각도의 사진도 잘 작동합니다. 중요한 것은
                  <span className="font-semibold"> 얼굴 윤곽과 특징이 선명하게 보이는 것</span>입니다.
                </p>
              </li>
              <li>
                <span className="font-medium">마스킹(특히 눈·코·입 위주)</span>
                <p className="mt-1 text-slate-600">
                  얼굴 전체를 칠할 필요 없이, 가장 자연스러운 결과를 원하신다면
                  <span className="font-semibold"> 눈·코·입 부분만 가볍게 마스킹</span>해 주세요.
                  헤어와 얼굴 윤곽은 그대로 두고, 표정과 인상만 부드럽게 바뀝니다.
                </p>
              </li>
              <li>
                <span className="font-medium">성별 · 연령대 선택</span>
                <p className="mt-1 text-slate-600">
                  고객 실제 이미지와 비슷하게 선택하면 자연스러운 결과를 얻을 수 있습니다.
                </p>
              </li>
              <li>
                <span className="font-medium">AI 변환 시작 (1 크레딧 차감)</span>
                <p className="mt-1 text-slate-600">
                  변환 1회당 <b>1 크레딧</b>이 차감되며, 보통 3~5초 안에 결과가 생성됩니다.
                  생성된 이미지는 상담·SNS·홍보용으로 바로 사용할 수 있습니다.
                </p>
              </li>
            </ol>
          </GuideCard>

          {/* 3. 초상권/저작권 */}
          <GuideCard
            title="3. 초상권 · 저작권 안내"
            subtitle="HairFit은 고객의 실제 얼굴을 그대로 쓰지 않고, AI가 새로운 얼굴을 생성합니다."
          >
            <ul className="space-y-1.5">
              <li>• 원본 고객 얼굴이 그대로 노출되지 않습니다.</li>
              <li>• 헤어와 전체적인 분위기는 유지되지만, 얼굴 자체는 새로 생성됩니다.</li>
              <li>• 생성된 이미지의 활용 권한은 원장님께 귀속됩니다.</li>
            </ul>
            <p className="mt-3 text-[11px] md:text-xs text-slate-500">
              단, 실제 광고 집행 시에는 각 플랫폼(인스타그램, 네이버 등)의 이미지 사용 가이드를 함께 확인해 주세요.
            </p>
          </GuideCard>

          {/* 4. 활용 사례 */}
          <GuideCard
            title="4. 추천 활용 사례"
            subtitle="실제 미용실 운영에서 많이 사용되는 케이스를 모았습니다."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <h3 className="mb-1 text-xs md:text-sm font-semibold text-slate-900">
                  🔹 SNS 콘텐츠 제작
                </h3>
                <p className="text-slate-600 text-xs md:text-sm">
                  전후 비교컷, 스타일 룩북 등 매장만의 시그니처 이미지를 만들어 인스타그램, 카카오채널, 블로그 등에 활용할 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-xs md:text-sm font-semibold text-slate-900">
                  🔹 상담용 스타일 미리보기
                </h3>
                <p className="text-slate-600 text-xs md:text-sm">
                  시술 전 고객에게 여러 스타일을 보여주며 커뮤니케이션할 수 있어, 상담 시간이 줄고 만족도는 올라갑니다.
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-xs md:text-sm font-semibold text-slate-900">
                  🔹 신규 고객 유입용 이미지
                </h3>
                <p className="text-slate-600 text-xs md:text-sm">
                  매장의 대표 컷, 컬러 스타일을 AI 이미지로 만들고, 광고 배너·포스터·예약 페이지 등에 노출해 보세요.
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-xs md:text-sm font-semibold text-slate-900">
                  🔹 교육 · 스태프 연습용 자료
                </h3>
                <p className="text-slate-600 text-xs md:text-sm">
                  다양한 얼굴형·스타일 조합 이미지를 만들어 스태프 교육, 스타일 연구용 자료로도 활용할 수 있습니다.
                </p>
              </div>
            </div>
          </GuideCard>

          {/* 5. 크레딧 & 플랜 */}
          <GuideCard
            title="5. 크레딧 & 플랜 안내"
            subtitle="AI 변환 1회당 1 크레딧이 차감되며, 샵 규모와 사용량에 맞는 플랜을 선택할 수 있습니다."
          >
            <ul className="space-y-1.5">
              <li>• AI 스타일 변환 1회 = <b>1 크레딧</b></li>
              <li>• 회원가입 시 기본 크레딧이 제공됩니다 (Free 플랜).</li>
              <li>• 추가 충전은 상단 메뉴의 ‘크레딧 충전’ 또는 요금제 페이지에서 가능합니다.</li>
            </ul>
            <div className="mt-3 grid gap-1 text-[11px] md:text-xs text-slate-600">
              <p>Free : 기본 제공 크레딧 · 무료</p>
              <p>Starter : 30 크레딧 · 3,000원</p>
              <p>Pro : 100 크레딧 · 9,000원</p>
              <p>VIP : 300 크레딧 · 25,000원</p>
            </div>
            <p className="mt-3 text-[11px] md:text-xs text-slate-500">
              ※ 크레딧은 유효기간 없이 사용할 수 있으며, 결제 후 환불은 제한될 수 있습니다.
            </p>
          </GuideCard>

          {/* 6. 촬영 & 마스킹 가이드 */}
          <GuideCard
            title="6. 좋은 결과를 위한 촬영 · 마스킹 팁"
            subtitle="실제 사용 경험을 기준으로 가장 자연스러운 결과를 얻는 방법입니다."
          >
            <ul className="space-y-1.5">
              <li>• 얼굴 일부가 머리카락, 손 등으로 가려져 있어도 대부분 정상적으로 생성됩니다.</li>
              <li>
                • <span className="font-semibold">가장 자연스러운 결과</span>를 원하신다면
                <span className="font-semibold"> 눈·코·입만 선택적으로 마스킹</span>해 주세요.
              </li>
              <li>• 정면뿐 아니라, 약간 측면(45도) 사진도 잘 작동합니다.</li>
              <li>• 너무 어두운 환경은 피하고, 얼굴이 선명하게 보이는 조명을 사용하는 것이 좋습니다.</li>
            </ul>
          </GuideCard>

          {/* 7. FAQ */}
          <GuideCard
            title="7. 자주 묻는 질문 (FAQ)"
            subtitle="짧게 읽고 바로 이해할 수 있도록 핵심만 정리했습니다."
          >
            <div className="space-y-3">
              <details className="group rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs md:text-sm text-slate-800">
                  <span>Q. 고객 사진이 서버에 저장되나요?</span>
                  <span className="ml-2 text-slate-400 group-open:rotate-90 transition">
                    ▶
                  </span>
                </summary>
                <p className="mt-2 text-[11px] md:text-xs text-slate-600">
                  변환에 필요한 시간 동안만 일시적으로 사용되며, AI 연산이 끝난 뒤에는 서버에서 삭제됩니다.
                  마케팅·학습용으로 별도 저장하지 않습니다.
                </p>
              </details>

              <details className="group rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs md:text-sm text-slate-800">
                  <span>Q. 결과물이 마음에 들지 않으면 어떻게 하나요?</span>
                  <span className="ml-2 text-slate-400 group-open:rotate-90 transition">
                    ▶
                  </span>
                </summary>
                <p className="mt-2 text-[11px] md:text-xs text-slate-600">
                  촬영 각도·조명·표정에 따라 결과가 달라질 수 있습니다.
                  얼굴이 선명하게 보이도록 다시 촬영하고, 눈·코·입 위주로 마스킹 후 재생성하면 품질이 크게 개선됩니다.
                </p>
              </details>

              <details className="group rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs md:text-sm text-slate-800">
                  <span>Q. PC와 모바일 어디에서 사용할 수 있나요?</span>
                  <span className="ml-2 text-slate-400 group-open:rotate-90 transition">
                    ▶
                  </span>
                </summary>
                <p className="mt-2 text-[11px] md:text-xs text-slate-600">
                  크롬, 사파리 등 최신 브라우저가 설치된 기기라면 PC·노트북·태블릿·휴대폰 어디에서나 접속하여 사용할 수 있습니다.
                </p>
              </details>
            </div>
          </GuideCard>

          {/* 마지막 CTA */}
          <section className="mt-2 text-center text-xs md:text-sm text-slate-600">
            <p>이제 준비가 끝났어요. 대시보드에서 바로 첫 번째 스타일을 생성해 보세요.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-xs md:text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              HairFit Studio 열기
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
