// app/guide/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function GuidePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-8 md:px-6 md:pt-10">
        {/* 상단 헤더 */}
        <header className="mb-8 md:mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                이용안내 👋
              </h1>
              <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
                HairFit은 머리는 그대로 두고
                <br className="md:hidden" />
                <span className="hidden md:inline">, </span>
                얼굴만 AI로 자연스럽게 바꿔주는 서비스입니다.
                <br />
                고객 얼굴을 직접 쓰지 않아 초상권 부담을 줄이고 안심하고 활용하실 수 있어요.
              </p>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <span className="text-lg">↩</span>
              <span>대시보드로</span>
            </button>
          </div>
        </header>

        <div className="space-y-6 md:space-y-7 text-sm md:text-base text-slate-800">
          {/* 1. 서비스 소개 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100">
            <h2 className="text-base md:text-lg font-semibold mb-3">
              1. HairFit은 어떤 서비스인가요? 💇‍♀️
            </h2>
            <ul className="space-y-2 leading-relaxed">
              <li>• 머리는 그대로 두고, 얼굴만 AI로 자연스럽게 바뀝니다.</li>
              <li>• 고객의 실제 얼굴을 사용하지 않아 초상권 부담을 줄일 수 있습니다.</li>
              <li>• 상담 사진·인스타·블로그 홍보 이미지에 활용하기 좋습니다.</li>
            </ul>
          </section>

          {/* 2. 사용 방법 3단계 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100">
            <h2 className="text-base md:text-lg font-semibold mb-3">
              2. 어떻게 쓰나요? (3단계) 📸
            </h2>
            <ol className="space-y-3 leading-relaxed list-decimal pl-5">
              <li>
                <span className="font-semibold">고객 사진 올리기 📷</span>
                <p className="mt-1 text-slate-700">
                  정면·옆모습 모두 괜찮습니다. <b>얼굴이 선명하게만 보이면 됩니다.</b>
                </p>
              </li>
              <li>
                <span className="font-semibold">눈·코·입만 쓱쓱 칠하기 🎨</span>
                <p className="mt-1 text-slate-700">
                  얼굴 전체를 칠할 필요 없이, <b>눈·코·입만 마스킹</b>하면 가장 자연스럽게 바뀝니다.
                </p>
              </li>
              <li>
                <span className="font-semibold">AI 스타일 변환하기 ✨</span>
                <p className="mt-1 text-slate-700">
                  한 번 변환할 때마다 <b>1 크레딧</b>이 사용됩니다.
                </p>
              </li>
            </ol>
          </section>

          {/* 3. 크레딧·요금 안내 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100">
            <h2 className="text-base md:text-lg font-semibold mb-3">
              3. 크레딧 · 요금 안내 💳
            </h2>
            <p className="mb-3 leading-relaxed">
              AI 스타일 변환 <b>1회 = 1 크레딧</b>이 사용됩니다.
            </p>

            <div className="space-y-2">
              <p>🟦 <b>Free</b> : 가입 시 기본 제공 · 무료</p>

              <div className="border-t border-slate-200 my-2" />

              <p>🔹 <b>Starter</b> : 30 크레딧 · 3,000원</p>
              <p>⚫ <b>Pro</b> : 100 크레딧 · 9,000원</p>
              <p>🟣 <b>VIP</b> : 300 크레딧 · 25,000원</p>
            </div>

            <p className="mt-3 text-xs md:text-sm text-slate-600 leading-relaxed">
              어떤 플랜을 선택할지 고민된다면,{" "}
              <b>먼저 Free로 사용해 보신 뒤</b> 사용량에 따라 Starter → Pro 순으로
              올려보시는 것을 추천드립니다.
            </p>
          </section>

          {/* 4. 추천 활용 예시 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100">
            <h2 className="text-base md:text-lg font-semibold mb-3">
              4. 이런 용도로 쓰면 좋아요 👍
            </h2>
            <ul className="space-y-2 leading-relaxed">
              <li>📱 인스타그램·카카오채널·블로그용 스타일 이미지 만들기</li>
              <li>🗣️ 시술 전, 고객에게 스타일을 미리 보여주기</li>
              <li>🪞 매장 대표 스타일 사진을 모아 홍보 이미지로 활용하기</li>
            </ul>
          </section>

          {/* CTA */}
          <section className="pt-2 text-center text-sm md:text-base text-slate-700">
            <p>이제 바로 첫 이미지를 만들어 보세요.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm md:text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              HairFit 시작하기 ✨
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
