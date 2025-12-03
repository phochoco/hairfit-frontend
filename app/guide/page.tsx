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
                Re-Fac Art는 머리는 그대로 두고
                <br className="md:hidden" />
                <span className="hidden md:inline">, </span>
                얼굴만 AI로 자연스럽게 바꿔주는 서비스입니다.
                <br />
                고객 얼굴을 직접 쓰지 않아 초상권 부담을 줄이고 안심하고
                활용하실 수 있어요.
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
              1. Re-Fac Art는 어떤 서비스인가요? 💇‍♀️
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
                  정면·옆모습 모두 괜찮습니다.{" "}
                  <b>얼굴이 선명하게만 보이면 됩니다.</b>
                </p>
              </li>
              <li>
                <span className="font-semibold">눈·코·입만 쓱쓱 칠하기 🎨</span>
                <p className="mt-1 text-slate-700">
                  얼굴 전체를 칠할 필요 없이, <b>눈·코·입만 마스킹</b>하면 가장
                  자연스럽게 바뀝니다.
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

          {/* 3. 크레딧·요금 안내 – 풀버전 플랜 */}
          <section className="rounded-2xl bg-white px-5 py-5 shadow-sm border border-slate-100">
            <h2 className="text-base md:text-lg font-semibold mb-3">
              3. 크레딧 · 요금 안내 💳
            </h2>
            <p className="mb-3 leading-relaxed">
              AI 스타일 변환 <b>1회 = 1 크레딧</b>이 사용됩니다. 아래 플랜은
              크레딧 충전용 예시이며, 실제 가격/구성은 결제 화면 기준으로
              적용됩니다.
            </p>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-slate-900">🟦 Free</p>
                <p className="text-slate-700 text-sm">
                  가입만 해도 <b>기본 체험 크레딧</b> 제공 — 서비스 느낌만
                  먼저 테스트해 보고 싶을 때 사용하세요.
                </p>
              </div>

              <div className="border-t border-slate-200" />

              <div>
                <p className="font-semibold text-slate-900">
                  🔹 Starter · 약 30 크레딧 · 3,000원
                </p>
                <p className="text-slate-700 text-sm">
                  소규모로 여러 스타일을 테스트해 보고 싶은{" "}
                  <b>개인 사용자 / 1인 샵</b>에 추천됩니다.
                </p>
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  🔵 Pro · 약 100 크레딧 · 9,000원
                </p>
                <p className="text-slate-700 text-sm">
                  유튜브 썸네일, 블로그·상세페이지용 이미지 등{" "}
                  <b>꾸준히 얼굴 교체가 필요한 크리에이터 / 셀러</b>에게
                  적합합니다.
                </p>
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  🟣 Premium · 약 330 크레딧 · 25,000원{" "}
                  <span className="text-xs text-emerald-600">
                    (+ 보너스 크레딧 포함)
                  </span>
                </p>
                <p className="text-slate-700 text-sm">
                  정기적으로 홍보용 이미지를 많이 쓰는{" "}
                  <b>미용실·샵 스튜디오 / 1인 크리에이터</b>에게 어울리는
                  패키지입니다.
                </p>
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  🟠 Ultra · 약 650 크레딧 · 49,000원{" "}
                  <span className="text-xs text-emerald-600">
                    (+ 보너스 크레딧 포함)
                  </span>
                </p>
                <p className="text-slate-700 text-sm">
                  여러 지점/직원을 운영하거나, <b>캠페인 단위로 대량 이미지를
                  생산</b>해야 하는 경우에 적합합니다.
                </p>
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  ⚫ Studio · 약 1,400 크레딧 · 99,000원{" "}
                  <span className="text-xs text-emerald-600">
                    (+ 보너스 크레딧 포함)
                  </span>
                </p>
                <p className="text-slate-700 text-sm">
                  영상 제작사, 광고·마케팅 대행사, 대형 샵/스튜디오처럼{" "}
                  <b>매달 많은 양의 얼굴 교체 이미지</b>가 필요한 곳을 위한
                  플랜입니다.
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs md:text-sm text-slate-600 leading-relaxed">
              처음이시라면 <b>Free → Starter → Pro</b> 순으로 사용량을 보면서
              단계적으로 올리는 방식을 추천드립니다. 대량 사용이 예상되면
              Premium 이상 플랜을 선택하시는 것이 크레딧 단가가 더
              유리합니다.
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
              Re-Fac Art 시작하기 ✨
            </button>
          </section>

          {/* 5. 약관 및 정책 안내 */}
          <section className="rounded-2xl bg-white px-5 py-6 shadow-sm border border-slate-100">
            <h2 className="text-base md:text-lg font-semibold mb-4">
              5. 약관 및 정책 안내 📄
            </h2>

            <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-4">
              아래에는 Re-Fac Art 서비스 이용에 적용되는{" "}
              <b>이용약관, 개인정보처리방침, 환불정책</b>이 정리되어 있습니다.
              실제 결제 및 서비스 이용 전 반드시 확인해 주세요.
            </p>

            <div className="mb-5 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  document
                    .getElementById("terms-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs md:text-sm text-slate-700 hover:bg-slate-50"
              >
                이용약관 바로가기
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("privacy-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs md:text-sm text-slate-700 hover:bg-slate-50"
              >
                개인정보처리방침
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("refund-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs md:text-sm text-slate-700 hover:bg-slate-50"
              >
                환불정책
              </button>
            </div>

            {/* 이용약관 */}
            <div
              id="terms-section"
              className="mt-4 space-y-4 text-sm md:text-base leading-relaxed"
            >
              <h3 className="text-base md:text-lg font-semibold mb-2">
                5-1. Re-Fac Art 이용약관
              </h3>

              <p>
                이 약관은 필름드림(이하 &quot;회사&quot;)가 제공하는 Re-Fac
                Art(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의
                권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">제1조 (정의)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      &quot;서비스&quot;란 회사가 운영하는 웹사이트(https://re-fac.art) 및
                      관련 웹 애플리케이션을 통해 제공하는 AI 기반 얼굴 변환,
                      이미지 편집·생성 등 디지털 콘텐츠 서비스를 말합니다.
                    </li>
                    <li>
                      &quot;이용자&quot;란 본 약관에 동의하고 회사가 제공하는 서비스를
                      이용하는 회원 및 비회원을 말합니다.
                    </li>
                    <li>
                      &quot;디지털 콘텐츠&quot;란 서비스 이용을 통해 생성·제공되는 이미지,
                      파일, 기타 무형의 콘텐츠를 말합니다.
                    </li>
                    <li>
                      &quot;크레딧&quot;이란 서비스 내 유료 기능을 이용하기 위해 회사가
                      정한 기준에 따라 부여되는 결제 단위를 말합니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">제2조 (약관의 게시와 개정)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      회사는 본 약관의 내용을 이용자가 쉽게 확인할 수 있도록
                      서비스 초기 화면 또는 연결 화면에 게시합니다.
                    </li>
                    <li>
                      회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수
                      있으며, 개정 시 시행일 및 개정 사유를 명시하여 적용일 7일
                      전부터 공지합니다. 이용자에게 불리한 변경의 경우 최소 30일
                      전에 공지합니다.
                    </li>
                    <li>
                      이용자가 개정 약관 시행일까지 명시적으로 거부 의사를
                      표시하지 않고 서비스를 계속 이용하는 경우, 변경된 약관에
                      동의한 것으로 봅니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">제3조 (서비스의 제공 및 변경)</h4>
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
                      회사는 운영상·기술상의 필요에 따라 서비스의 내용을 변경할
                      수 있으며, 중요한 변경의 경우 사전에 공지합니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">제4조 (회원가입 및 계정 관리)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      이용자는 회사가 정한 가입 양식에 따라 필요한 정보를
                      입력함으로써 회원가입을 신청할 수 있습니다.
                    </li>
                    <li>
                      회사는 회원가입 신청에 대해 원칙적으로 승낙하나, 다음 각
                      호에 해당하는 경우 승낙을 거절하거나 사후에 이용을 제한할
                      수 있습니다.
                      <ol className="list-decimal pl-5 mt-1 space-y-1">
                        <li>타인의 명의 또는 허위 정보를 사용한 경우</li>
                        <li>서비스를 부정한 목적으로 이용하려는 경우</li>
                        <li>관련 법령 및 약관을 위반한 이력이 있는 경우</li>
                      </ol>
                    </li>
                    <li>
                      회원은 자신의 계정 정보가 도난·유출되지 않도록 관리할
                      책임이 있으며, 제3자에게 양도하거나 대여할 수 없습니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">제5조 (이용자의 의무)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      이용자는 다음 행위를 하여서는 아니 됩니다.
                      <ol className="list-decimal pl-5 mt-1 space-y-1">
                        <li>
                          타인의 얼굴·초상·개인정보를 무단으로 업로드하거나
                          사용하는 행위
                        </li>
                        <li>
                          타인의 저작권 등 지식재산권을 침해하는 행위
                        </li>
                        <li>
                          법령에 위반되거나 공공질서 및 미풍양속에 반하는
                          콘텐츠 생성·이용 행위
                        </li>
                        <li>
                          서비스의 정상적인 운영을 방해하는 모든 행위
                        </li>
                      </ol>
                    </li>
                    <li>
                      이용자의 위법 또는 약관 위반으로 인해 발생한 손해에
                      대해서는 해당 이용자가 책임을 부담합니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">제6조 (저작권 및 이용 권리)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      이용자가 서비스에 업로드하는 원본 이미지는 해당 이용자의
                      책임과 권리 하에 있으며, 회사는 서비스 제공 목적 범위
                      내에서만 이를 처리·저장합니다.
                    </li>
                    <li>
                      서비스를 통해 생성된 결과물(이미지 등 디지털 콘텐츠)의
                      저작권 및 이용 권리는 관련 법령과 개별 안내에 따르며,
                      상업적 이용 가능 여부는 회사가 별도로 안내한 정책에
                      따릅니다.
                    </li>
                    <li>
                      회사는 서비스 품질 향상, 기능 개선, 통계 및 분석 등을
                      위해 비식별화된 형태로 데이터를 활용할 수 있습니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">
                    제7조 (서비스 이용요금 및 결제)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      서비스의 일부 또는 전부는 유료로 제공될 수 있으며, 구체적인
                      요금, 결제 방법, 환불 규정 등은 서비스 내 결제 페이지에
                      별도로 게시합니다.
                    </li>
                    <li>
                      이용자는 회사가 정한 방법(신용·체크카드, 간편결제 등)을
                      통하여 이용요금을 결제할 수 있습니다.
                    </li>
                    <li>
                      크레딧은 현금으로 환불하거나 제3자에게 양도할 수 없으며,
                      이용기간 및 소멸 조건은 별도의 정책에 따릅니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">제8조 (환불 및 청약철회)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      디지털 콘텐츠 특성상, 결제 후 서비스 제공(이미지 생성
                      시작 또는 크레딧 사용)이 이루어진 경우에는
                      「전자상거래법」 등 관련 법령에 따라 청약철회가 제한될 수
                      있습니다.
                    </li>
                    <li>
                      상세 환불 정책은 아래{" "}
                      <a
                        href="#refund-section"
                        className="text-sky-600 underline underline-offset-2"
                      >
                        환불정책
                      </a>{" "}
                      부분에 게시하며, 이용자는 결제 전에 반드시 확인해야
                      합니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">제9조 (서비스 중단 및 변경)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      회사는 천재지변, 정전, 서비스 설비 장애, 트래픽 폭주, 외부
                      서비스 연계 장애 등 불가피한 사유가 발생한 경우 서비스
                      제공을 일시 중단할 수 있습니다.
                    </li>
                    <li>
                      이 경우 회사는 사후에라도 서비스 내 공지 또는 이메일 등을
                      통해 이용자에게 알리기 위해 노력합니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">제10조 (책임의 제한)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      회사는 관련 법령에서 허용되는 범위 내에서 서비스 이용과
                      관련하여 발생한 간접·우발·특별·결과적 손해에 대하여
                      책임을 지지 않습니다.
                    </li>
                    <li>
                      이용자의 귀책사유로 인한 서비스 장애 또는 손해에 대하여
                      회사는 책임을 지지 않습니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">
                    제11조 (분쟁 해결 및 관할법원)
                  </h4>
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
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  부칙: 이 약관은 2025년 __월 __일부터 시행합니다.
                </p>
              </div>
            </div>

            {/* 개인정보처리방침 */}
            <div
              id="privacy-section"
              className="mt-8 space-y-4 text-sm md:text-base leading-relaxed"
            >
              <h3 className="text-base md:text-lg font-semibold mb-2">
                5-2. 개인정보처리방침
              </h3>

              <p>
                필름드림(이하 &quot;회사&quot;)는 Re-Fac Art
                서비스(https://re-fac.art)를 이용하는 이용자의 개인정보를
                중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
                회사는 본 개인정보처리방침을 통해 어떤 정보를 어떠한 목적으로
                이용하는지, 이용자의 권리를 어떻게 보장하는지 알려드립니다.
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">
                    제1조 (수집하는 개인정보 항목)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      회원가입 및 서비스 이용 시
                      <ol className="list-decimal pl-5 mt-1 space-y-1">
                        <li>
                          필수: 이름(닉네임), 이메일 주소, 비밀번호,
                          휴대전화번호
                        </li>
                        <li>
                          선택: 프로필 이미지, 기타 이용자가 자발적으로 입력한
                          정보
                        </li>
                      </ol>
                    </li>
                    <li>
                      결제 및 환불 처리 시
                      <ol className="list-decimal pl-5 mt-1 space-y-1">
                        <li>
                          PG사(토스페이먼츠 등)를 통해 전달되는 결제 승인/취소
                          정보
                        </li>
                        <li>
                          신용·체크카드 정보, 계좌 정보 등은 PG사가 직접
                          처리하며, 회사는 원본 정보를 보관하지 않습니다.
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
                </div>

                <div>
                  <h4 className="font-semibold">
                    제2조 (개인정보의 수집·이용 목적)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>회원 관리 및 본인확인</li>
                    <li>서비스 제공 및 기능 구현 (AI 얼굴 변환, 이미지 편집·생성 등)</li>
                    <li>결제, 환불, 결제 내역 조회 등 전자상거래 관련 업무 처리</li>
                    <li>서비스 개선, 신규 서비스 개발, 이용 통계 분석</li>
                    <li>고객 문의 대응, 공지사항 전달, 보안 및 부정 이용 방지</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">
                    제3조 (개인정보의 보유 및 이용 기간)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>원칙적으로 개인정보의 수집·이용 목적이 달성되면 지체 없이 파기합니다.</li>
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
                </div>

                <div>
                  <h4 className="font-semibold">
                    제4조 (개인정보의 제3자 제공)
                  </h4>
                  <p>
                    회사는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.
                  </p>
                  <ol className="list-decimal pl-5 mt-1 space-y-1">
                    <li>이용자가 사전에 동의한 경우</li>
                    <li>법령에 특별한 규정이 있는 경우</li>
                    <li>수사기관이 적법한 절차에 따라 요청한 경우</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">
                    제5조 (개인정보 처리의 위탁)
                  </h4>
                  <p>
                    회사는 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁할 수 있습니다. 위탁 시 관련 법령에 따라 개인정보가 안전하게 처리되도록 관리·감독합니다.
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>PG사(토스페이먼츠 등): 결제 처리 및 결제 내역 관리</li>
                    <li>클라우드/호스팅 업체: 서비스 서버 운영 및 데이터 보관</li>
                    <li>로그 분석/통계 서비스: 서비스 이용 통계 분석</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">
                    제6조 (이용자 및 법정대리인의 권리와 행사 방법)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>이용자는 언제든지 본인의 개인정보를 조회·수정·삭제 요청할 수 있습니다.</li>
                    <li>회원 탈퇴를 요청하는 경우, 관련 법령에 따른 보관 의무가 있는 정보를 제외하고 즉시 파기합니다.</li>
                    <li>
                      권리 행사는 고객센터 또는 이메일(
                      <span className="text-sky-600">
                        myfilmdrim@gmail.com
                      </span>
                      )을 통해 요청할 수 있습니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">
                    제7조 (개인정보의 파기 절차 및 방법)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>회사는 보유 기간이 경과하거나 처리 목적이 달성된 개인정보를 지체 없이 파기합니다.</li>
                    <li>전자 파일 형태의 정보는 복구 불가능한 기술적 방법을 이용하여 삭제하며, 종이 문서는 분쇄 또는 소각을 통해 파기합니다.</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">제8조 (쿠키의 사용)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>회사는 이용자 맞춤형 서비스 제공을 위해 쿠키(cookie)를 사용할 수 있습니다.</li>
                    <li>이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있으나, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">
                    제9조 (개인정보 보호를 위한 기술적·관리적 대책)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>개인정보를 암호화하여 저장·관리하며, 중요한 데이터는 별도의 보안 기능을 통해 보호합니다.</li>
                    <li>개인정보에 접근할 수 있는 인원을 최소화하고, 정기적인 보안 교육을 실시합니다.</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">
                    제10조 (개인정보 보호책임자)
                  </h4>
                  <p>
                    회사는 개인정보 보호 관련 업무를 총괄하는 개인정보
                    보호책임자를 지정하고 있습니다.
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>성명: 윤예준</li>
                    <li>이메일: myfilmdrim@gmail.com</li>
                    <li>연락처: 010-9288-5650</li>
                  </ul>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  부칙: 이 개인정보처리방침은 2025년 __월 __일부터 시행합니다.
                </p>
              </div>
            </div>

            {/* 환불정책 */}
            <div
              id="refund-section"
              className="mt-8 space-y-4 text-sm md:text-base leading-relaxed"
            >
              <h3 className="text-base md:text-lg font-semibold mb-2">
                5-3. 환불정책
              </h3>

              <p>
                본 환불정책은 필름드림이 제공하는 Re-Fac Art(이하 &quot;서비스&quot;)의
                유료 결제 및 디지털 콘텐츠 이용과 관련된 환불 기준을 규정합니다.
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">제1조 (적용 대상)</h4>
                  <p>
                    본 정책은 서비스 내에서 결제한 크레딧, 이용권, 패키지 등
                    디지털 콘텐츠 및 유료 기능 이용에 적용됩니다.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">
                    제2조 (디지털 콘텐츠의 특성)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      서비스는 AI를 활용하여 이용자가 업로드한 이미지를 기반으로
                      얼굴 변환 및 이미지 생성·편집을 제공하는 디지털 콘텐츠
                      서비스입니다.
                    </li>
                    <li>
                      디지털 콘텐츠의 특성상, 한 번 생성된 결과물은 회수·삭제가
                      가능하더라도 이미 열람 또는 다운로드가 이루어진 경우
                      재사용 방지가 어려울 수 있습니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">제3조 (청약철회 제한)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      「전자상거래 등에서의 소비자 보호에 관한 법률」 제17조 및
                      같은 법 시행령 제21조에 따라, 디지털 콘텐츠를 제공받은
                      경우에는 청약철회가 제한될 수 있습니다.
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
                </div>

                <div>
                  <h4 className="font-semibold">
                    제4조 (결제 후 미사용 분에 대한 환불)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      결제 후 어떠한 이미지 생성·편집도 진행하지 않은 상태(크레딧
                      미사용)에서 7일 이내 환불을 요청하는 경우, 결제 수수료 및
                      PG사 수수료를 제외한 금액을 환불할 수 있습니다.
                    </li>
                    <li>
                      부분 사용이 이미 이루어진 경우, 사용된 크레딧에 상응하는
                      금액은 환불 대상에서 제외됩니다.
                    </li>
                    <li>
                      이벤트·프로모션 등으로 무상 지급된 크레딧은 환불 대상에
                      포함되지 않습니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">
                    제5조 (서비스 장애에 따른 환불·보상)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      회사의 귀책 사유로 인해 결제 후 일정 기간 동안 서비스
                      이용이 불가능한 경우, 회사는 장애 시간 및 사용 이력 등을
                      고려하여 크레딧 복구 또는 추가 제공 등의 방식으로 보상할
                      수 있습니다.
                    </li>
                    <li>
                      천재지변, 통신사 장애, 외부 서비스(클라우드, PG사 등)
                      문제로 인한 서비스 중단의 경우, 관련 법령에서 정한 범위
                      내에서 책임을 집니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">제6조 (환불 절차)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      이용자가 환불을 요청할 경우, 다음 정보를 고객센터 또는
                      이메일(
                      <span className="text-sky-600">
                        myfilmdrim@gmail.com
                      </span>
                      )을 통해 제출해야 합니다.
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
                      환불 처리에 소요되는 기간은 결제 수단 및 PG사 정책 등에
                      따라 다를 수 있습니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">제7조 (기타)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      본 환불정책에 명시되지 않은 사항은 관련 법령 및 서비스
                      이용약관에 따릅니다.
                    </li>
                    <li>
                      회사는 서비스 운영 정책 및 관련 법령 변경에 따라 본
                      환불정책을 개정할 수 있으며, 변경 시 서비스 내 공지를 통해
                      사전에 안내합니다.
                    </li>
                  </ol>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  부칙: 이 환불정책은 2025년 __월 __일부터 시행합니다.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
