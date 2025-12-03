"use client";

import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-8 md:px-6 md:pt-10">
        {/* 헤더 */}
        <header className="mb-8 md:mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Re-Fac Art 이용약관
            </h1>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
            >
              ↩ 돌아가기
            </button>
          </div>
        </header>

        {/* 본문 */}
        <div className="space-y-6 text-sm md:text-base text-slate-800 leading-relaxed">
          {/* 서문 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100">
            <p>
              이 약관은 필름드림(이하 &quot;회사&quot;)가 제공하는 Re-Fac Art(이하
              &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의 권리, 의무
              및 책임 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제1조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">제1조 (정의)</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                &quot;서비스&quot;란 회사가 운영하는 웹사이트(
                <span className="text-sky-600">https://re-fac.art</span>) 및 관련
                웹 애플리케이션을 통해 제공하는 AI 기반 얼굴 변환, 이미지
                편집·생성 등 디지털 콘텐츠 서비스를 말합니다.
              </li>
              <li>
                &quot;이용자&quot;란 본 약관에 동의하고 회사가 제공하는 서비스를
                이용하는 회원 및 비회원을 말합니다.
              </li>
              <li>
                &quot;디지털 콘텐츠&quot;란 서비스 이용을 통해 생성·제공되는
                이미지, 파일, 기타 무형의 콘텐츠를 말합니다.
              </li>
              <li>
                &quot;크레딧&quot;이란 서비스 내 유료 기능을 이용하기 위해
                회사가 정한 기준에 따라 부여되는 결제 단위를 말합니다.
              </li>
            </ol>
          </section>

          {/* 제2조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제2조 (약관의 게시와 개정)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                회사는 본 약관의 내용을 이용자가 쉽게 확인할 수 있도록 서비스
                초기 화면 또는 연결 화면에 게시합니다.
              </li>
              <li>
                회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수
                있으며, 개정 시 시행일 및 개정 사유를 명시하여 적용일 7일
                전부터 공지합니다. 이용자에게 불리한 변경의 경우 최소 30일 전에
                공지합니다.
              </li>
              <li>
                이용자가 개정 약관 시행일까지 명시적으로 거부 의사를 표시하지
                않고 서비스를 계속 이용하는 경우, 변경된 약관에 동의한 것으로
                봅니다.
              </li>
            </ol>
          </section>

          {/* 제3조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제3조 (서비스의 제공 및 변경)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                회사는 다음과 같은 서비스를 제공합니다.
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>AI 기반 얼굴 변환 및 이미지 편집·생성 서비스</li>
                  <li>이미지 업로드, 관리 및 다운로드 기능</li>
                  <li>기타 회사가 정하는 부가 서비스</li>
                </ol>
              </li>
              <li>
                회사는 운영상·기술상의 필요에 따라 서비스의 내용을 변경할 수
                있으며, 중요한 변경의 경우 사전에 공지합니다.
              </li>
            </ol>
          </section>

          {/* 제4조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제4조 (회원가입 및 계정 관리)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                이용자는 회사가 정한 가입 양식에 따라 필요한 정보를 입력함으로써
                회원가입을 신청할 수 있습니다.
              </li>
              <li>
                회사는 회원가입 신청에 대해 원칙적으로 승낙하나, 다음 각 호에
                해당하는 경우 승낙을 거절하거나 사후에 이용을 제한할 수
                있습니다.
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>타인의 명의 또는 허위 정보를 사용한 경우</li>
                  <li>서비스를 부정한 목적으로 이용하려는 경우</li>
                  <li>관련 법령 및 약관을 위반한 이력이 있는 경우</li>
                </ol>
              </li>
              <li>
                회원은 자신의 계정 정보가 도난·유출되지 않도록 관리할 책임이
                있으며, 제3자에게 양도하거나 대여할 수 없습니다.
              </li>
            </ol>
          </section>

          {/* 제5조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제5조 (이용자의 의무)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                이용자는 다음 행위를 하여서는 아니 됩니다.
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>
                    타인의 얼굴·초상·개인정보를 무단으로 업로드하거나 사용하는
                    행위
                  </li>
                  <li>타인의 저작권 등 지식재산권을 침해하는 행위</li>
                  <li>
                    법령에 위반되거나 공공질서 및 미풍양속에 반하는 콘텐츠
                    생성·이용 행위
                  </li>
                  <li>서비스의 정상적인 운영을 방해하는 모든 행위</li>
                </ol>
              </li>
              <li>
                이용자의 위법 또는 약관 위반으로 인해 발생한 손해에 대해서는
                해당 이용자가 책임을 부담합니다.
              </li>
            </ol>
          </section>

          {/* 제6조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제6조 (저작권 및 이용 권리)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                이용자가 서비스에 업로드하는 원본 이미지는 해당 이용자의 책임과
                권리 하에 있으며, 회사는 서비스 제공 목적 범위 내에서만 이를
                처리·저장합니다.
              </li>
              <li>
                서비스를 통해 생성된 결과물(이미지 등 디지털 콘텐츠)의 저작권
                및 이용 권리는 관련 법령과 개별 안내에 따르며, 상업적 이용
                가능 여부는 회사가 별도로 안내한 정책에 따릅니다.
              </li>
              <li>
                회사는 서비스 품질 향상, 기능 개선, 통계 및 분석 등을 위해
                비식별화된 형태로 데이터를 활용할 수 있습니다.
              </li>
            </ol>
          </section>

          {/* 제7조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제7조 (서비스 이용요금 및 결제)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                서비스의 일부 또는 전부는 유료로 제공될 수 있으며, 구체적인
                요금, 결제 방법, 환불 규정 등은 서비스 내 결제 페이지에 별도로
                게시합니다.
              </li>
              <li>
                이용자는 회사가 정한 방법(신용·체크카드, 간편결제 등)을
                통하여 이용요금을 결제할 수 있습니다.
              </li>
              <li>
                크레딧은 현금으로 환불하거나 제3자에게 양도할 수 없으며, 이용
                기간 및 소멸 조건은 별도의 정책에 따릅니다.
              </li>
            </ol>
          </section>

          {/* 제8조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제8조 (환불 및 청약철회)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                디지털 콘텐츠 특성상, 결제 후 서비스 제공(이미지 생성 시작 또는
                크레딧 사용)이 이루어진 경우에는 「전자상거래법」 등 관련 법령에
                따라 청약철회가 제한될 수 있습니다.
              </li>
              <li>
                상세 환불 정책은 별도의{" "}
                <a
                  href="/refund-policy"
                  className="text-sky-600 underline underline-offset-2"
                >
                  환불정책
                </a>{" "}
                페이지에 게시하며, 이용자는 결제 전에 반드시 확인해야 합니다.
              </li>
            </ol>
          </section>

          {/* 제9조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제9조 (서비스 중단 및 변경)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                회사는 천재지변, 정전, 서비스 설비 장애, 트래픽 폭주, 외부 서비스
                연계 장애 등 불가피한 사유가 발생한 경우 서비스 제공을 일시
                중단할 수 있습니다.
              </li>
              <li>
                이 경우 회사는 사후에라도 서비스 내 공지 또는 이메일 등을 통해
                이용자에게 알리기 위해 노력합니다.
              </li>
            </ol>
          </section>

          {/* 제10조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제10조 (책임의 제한)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                회사는 관련 법령에서 허용되는 범위 내에서 서비스 이용과 관련하여
                발생한 간접·우발·특별·결과적 손해에 대하여 책임을 지지 않습니다.
              </li>
              <li>
                이용자의 귀책사유로 인한 서비스 장애 또는 손해에 대하여 회사는
                책임을 지지 않습니다.
              </li>
            </ol>
          </section>

          {/* 제11조 + 부칙 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제11조 (분쟁 해결 및 관할법원)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                회사와 이용자 간에 발생한 분쟁은 상호 성실한 협의를 통해
                해결하도록 노력합니다.
              </li>
              <li>
                협의로 해결되지 않는 분쟁에 대해서는 회사의 본점 소재지를
                관할하는 법원을 제1심 전속 관할법원으로 합니다.
              </li>
            </ol>

            <p className="mt-3 text-sm text-slate-600">
              부칙: 이 약관은 2025년 __월 __일부터 시행합니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
