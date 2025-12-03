"use client";

import { useRouter } from "next/navigation";

export default function RefundPolicyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-8 md:px-6 md:pt-10">
        {/* 헤더 */}
        <header className="mb-8 md:mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              환불정책
            </h1>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
            >
              ↩ 돌아가기
            </button>
          </div>
        </header>

        <div className="space-y-6 text-sm md:text-base text-slate-800 leading-relaxed">
          {/* 서문 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100">
            <p>
              본 환불정책은 필름드림이 제공하는 Re-Fac Art(이하
              &quot;서비스&quot;)의 유료 결제 및 디지털 콘텐츠 이용과 관련된
              환불 기준을 규정합니다.
            </p>
          </section>

          {/* 제1조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제1조 (적용 대상)
            </h2>
            <p>
              본 정책은 서비스 내에서 결제한 크레딧, 이용권, 패키지 등 디지털
              콘텐츠 및 유료 기능 이용에 적용됩니다.
            </p>
          </section>

          {/* 제2조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제2조 (디지털 콘텐츠의 특성)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                서비스는 AI를 활용하여 이용자가 업로드한 이미지를 기반으로 얼굴
                변환 및 이미지 생성·편집을 제공하는 디지털 콘텐츠 서비스입니다.
              </li>
              <li>
                디지털 콘텐츠의 특성상, 한 번 생성된 결과물은 회수·삭제가
                가능하더라도 이미 열람 또는 다운로드가 이루어진 경우 재사용
                방지가 어려울 수 있습니다.
              </li>
            </ol>
          </section>

          {/* 제3조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제3조 (청약철회 제한)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                「전자상거래 등에서의 소비자 보호에 관한 법률」 제17조 및 같은
                법 시행령 제21조에 따라, 디지털 콘텐츠를 제공받은 경우에는
                청약철회가 제한될 수 있습니다.
              </li>
              <li>
                이용자가 결제 후 다음 각 호에 해당하는 경우, 사용된 부분에
                대해서는 환불이 제한됩니다.
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>이미지 생성이 시작되었거나 완료된 경우</li>
                  <li>크레딧을 사용하여 일부라도 결과물을 생성한 경우</li>
                </ol>
              </li>
            </ol>
          </section>

          {/* 제4조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제4조 (결제 후 미사용 분에 대한 환불)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                결제 후 어떠한 이미지 생성·편집도 진행하지 않은 상태(크레딧
                미사용)에서 7일 이내 환불을 요청하는 경우, 결제 수수료 및 PG사
                수수료를 제외한 금액을 환불할 수 있습니다.
              </li>
              <li>
                부분 사용이 이미 이루어진 경우, 사용된 크레딧에 상응하는 금액은
                환불 대상에서 제외됩니다.
              </li>
              <li>
                이벤트·프로모션 등으로 무상 지급된 크레딧은 환불 대상에
                포함되지 않습니다.
              </li>
            </ol>
          </section>

          {/* 제5조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제5조 (서비스 장애에 따른 환불·보상)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                회사의 귀책 사유로 인해 결제 후 일정 기간 동안 서비스 이용이
                불가능한 경우, 회사는 장애 시간 및 사용 이력 등을 고려하여
                크레딧 복구 또는 추가 제공 등의 방식으로 보상할 수 있습니다.
              </li>
              <li>
                천재지변, 통신사 장애, 외부 서비스(클라우드, PG사 등) 문제로
                인한 서비스 중단의 경우, 관련 법령에서 정한 범위 내에서 책임을
                집니다.
              </li>
            </ol>
          </section>

          {/* 제6조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제6조 (환불 절차)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                이용자가 환불을 요청할 경우, 다음 정보를 고객센터 또는 이메일(예:
                <span className="ml-1 text-sky-600">myfilmdrim@gmail.com</span>)을
                통해 제출해야 합니다.
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>이름 또는 가입 계정(ID)</li>
                  <li>결제 일시 및 결제 수단</li>
                  <li>환불 요청 사유</li>
                </ol>
              </li>
              <li>
                회사는 환불 요청을 접수한 날로부터 7영업일 이내에 검토하고,
                승인 시 PG사 절차에 따라 환불을 진행합니다.
              </li>
              <li>
                환불 처리에 소요되는 기간은 결제 수단 및 PG사 정책 등에 따라
                다를 수 있습니다.
              </li>
            </ol>
          </section>

          {/* 제7조 + 부칙 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">제7조 (기타)</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                본 환불정책에 명시되지 않은 사항은 관련 법령 및 서비스
                이용약관에 따릅니다.
              </li>
              <li>
                회사는 서비스 운영 정책 및 관련 법령 변경에 따라 본 환불정책을
                개정할 수 있으며, 변경 시 서비스 내 공지를 통해 사전에
                안내합니다.
              </li>
            </ol>

            <p className="mt-3 text-sm text-slate-600">
              부칙: 이 환불정책은 2025년 __월 __일부터 시행합니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
