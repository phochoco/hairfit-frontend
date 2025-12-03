"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-8 md:px-6 md:pt-10">
        {/* 헤더 */}
        <header className="mb-8 md:mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              개인정보처리방침
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
              필름드림(이하 &quot;회사&quot;)는 Re-Fac Art 서비스(
              <span className="text-sky-600">https://re-fac.art</span>)를
              이용하는 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」
              등 관련 법령을 준수합니다. 회사는 본 개인정보처리방침을 통해 어떤
              정보를 어떠한 목적으로 이용하는지, 이용자의 권리를 어떻게
              보장하는지 알려드립니다.
            </p>
          </section>

          {/* 제1조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제1조 (수집하는 개인정보 항목)
            </h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                회원가입 및 서비스 이용 시
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>필수: 이름(닉네임), 이메일 주소, 비밀번호, 휴대전화번호</li>
                  <li>선택: 프로필 이미지, 기타 이용자가 자발적으로 입력한 정보</li>
                </ol>
              </li>
              <li>
                결제 및 환불 처리 시
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>
                    PG사(토스페이먼츠 등)를 통해 전달되는 결제 승인/취소 정보
                  </li>
                  <li>
                    신용·체크카드 정보, 계좌 정보 등은 PG사가 직접 처리하며,
                    회사는 원본 정보를 보관하지 않습니다.
                  </li>
                </ol>
              </li>
              <li>
                서비스 이용 과정에서 자동으로 생성·수집되는 정보
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>접속 IP, 쿠키, 서비스 이용 기록, 기기 정보, 브라우저 정보 등</li>
                </ol>
              </li>
              <li>
                이미지 업로드 시
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>이용자가 업로드한 얼굴 사진 및 기타 이미지 파일</li>
                </ol>
              </li>
            </ol>
          </section>

          {/* 제2조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제2조 (개인정보의 수집·이용 목적)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>회원 관리 및 본인확인</li>
              <li>서비스 제공 및 기능 구현 (AI 얼굴 변환, 이미지 편집·생성 등)</li>
              <li>결제, 환불, 결제 내역 조회 등 전자상거래 관련 업무 처리</li>
              <li>서비스 개선, 신규 서비스 개발, 이용 통계 분석</li>
              <li>고객 문의 대응, 공지사항 전달, 보안 및 부정 이용 방지</li>
            </ol>
          </section>

          {/* 제3조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제3조 (개인정보의 보유 및 이용 기간)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                원칙적으로 개인정보의 수집·이용 목적이 달성되면 지체 없이
                파기합니다.
              </li>
              <li>
                단, 다음의 경우에는 명시한 기간 동안 보관합니다.
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>
                    전자상거래 등에서의 소비자 보호에 관한 법률에 따른 보관
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                      <li>대금 결제 및 재화 등의 공급에 관한 기록: 5년</li>
                      <li>소비자의 불만 또는 분쟁 처리에 관한 기록: 3년</li>
                    </ul>
                  </li>
                  <li>서비스 부정 이용 방지 및 운영 정책상 필요한 경우: 최대 1년</li>
                </ol>
              </li>
            </ol>
          </section>

          {/* 제4조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제4조 (개인정보의 제3자 제공)
            </h2>
            <p>
              회사는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 특별한 규정이 있는 경우</li>
              <li>수사기관이 적법한 절차에 따라 요청한 경우</li>
            </ol>
          </section>

          {/* 제5조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제5조 (개인정보 처리의 위탁)
            </h2>
            <p>
              회사는 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁할 수
              있습니다. 위탁 시 관련 법령에 따라 개인정보가 안전하게 처리되도록
              관리·감독합니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>PG사(토스페이먼츠 등): 결제 처리 및 결제 내역 관리</li>
              <li>클라우드/호스팅 업체: 서비스 서버 운영 및 데이터 보관</li>
              <li>로그 분석/통계 서비스: 서비스 이용 통계 분석</li>
            </ul>
          </section>

          {/* 제6조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제6조 (이용자 및 법정대리인의 권리와 행사 방법)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                이용자는 언제든지 본인의 개인정보를 조회·수정·삭제 요청할 수
                있습니다.
              </li>
              <li>
                회원 탈퇴를 요청하는 경우, 관련 법령에 따른 보관 의무가 있는
                정보를 제외하고 즉시 파기합니다.
              </li>
              <li>
                권리 행사는 고객센터 또는 이메일(예:
                <span className="ml-1 text-sky-600">myfilmdrim@gmail.com</span>)
                을 통해 요청할 수 있습니다.
              </li>
            </ol>
          </section>

          {/* 제7조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제7조 (개인정보의 파기 절차 및 방법)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                회사는 보유 기간이 경과하거나 처리 목적이 달성된 개인정보를
                지체 없이 파기합니다.
              </li>
              <li>
                전자 파일 형태의 정보는 복구 불가능한 기술적 방법을 이용하여
                삭제하며, 종이 문서는 분쇄 또는 소각을 통해 파기합니다.
              </li>
            </ol>
          </section>

          {/* 제8조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제8조 (쿠키의 사용)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                회사는 이용자 맞춤형 서비스 제공을 위해 쿠키(cookie)를 사용할 수
                있습니다.
              </li>
              <li>
                이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수
                있으나, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
              </li>
            </ol>
          </section>

          {/* 제9조 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              제9조 (개인정보 보호를 위한 기술적·관리적 대책)
            </h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                개인정보를 암호화하여 저장·관리하며, 중요한 데이터는 별도의 보안
                기능을 통해 보호합니다.
              </li>
              <li>
                개인정보에 접근할 수 있는 인원을 최소화하고, 정기적인 보안
                교육을 실시합니다.
              </li>
            </ol>
          </section>

          {/* 제10조 + 부칙 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100 space-y-3">
            <h2 className="text-base md:text-lg font-semibold">
              제10조 (개인정보 보호책임자)
            </h2>
            <p>
              회사는 개인정보 보호 관련 업무를 총괄하는 개인정보 보호책임자를
              지정하고 있습니다.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>성명: 윤예준</li>
              <li>이메일: myfilmdrim@gmail.com</li>
              <li>연락처: 010-9288-5650</li>
            </ul>

            <p className="mt-3 text-sm text-slate-600">
              부칙: 이 개인정보처리방침은 2025년 __월 __일부터 시행합니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
