"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

type User = {
  id: number;
  email: string;
  shop_name?: string | null;
  plan_type: string;
  credits: number;
};

type GenerationItem = {
  id: number;
  input_image: string;
  result_image: string;
  created_at: string | null;
};

type MyGenResponse = {
  total_count: number;
  this_month_count: number;
  items: GenerationItem[];
};

export default function MyPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<MyGenResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const getToken = () =>
    (typeof window !== "undefined" &&
      (localStorage.getItem("hairfit_token") ||
        localStorage.getItem("token"))) ||
    "";

  const fetchUser = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("no token");

      const res = await axios.get<User>(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("유저 정보 불러오기 실패:", err);
      setErrorMsg("로그인 정보가 유효하지 않습니다. 다시 로그인해 주세요.");
    }
  };

  const fetchGenerations = async (page: number = 1) => {
    try {
      const token = getToken();
      if (!token) throw new Error("no token");

      const offset = (page - 1) * PAGE_SIZE;

      const res = await axios.get<MyGenResponse>(
        `${API_URL}/me/generations`,
        {
          params: {
            limit: PAGE_SIZE,
            offset,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setData(res.data);
      setCurrentPage(page);
    } catch (err) {
      console.error("생성 내역 불러오기 실패:", err);
      setErrorMsg("이용 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg(null);
      await fetchUser();
      await fetchGenerations(1);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages =
    data && data.total_count > 0
      ? Math.ceil(data.total_count / PAGE_SIZE)
      : 1;

  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    setLoading(true);
    fetchGenerations(currentPage - 1);
  };

  const handleNextPage = () => {
    if (!data) return;
    if (currentPage >= totalPages) return;
    setLoading(true);
    fetchGenerations(currentPage + 1);
  };

  const formatDateTime = (iso: string | null) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString("ko-KR");
    } catch {
      return iso;
    }
  };

  if (!getToken()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <h1 className="text-xl font-bold text-gray-900">
            로그인이 필요합니다
          </h1>
          <p className="text-sm text-gray-500">
            마이페이지는 로그인한 고객만 이용하실 수 있습니다.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 w-full py-2 rounded-xl bg-gray-900 text-white text-sm"
          >
            로그인 화면으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 상단 헤더 */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              나의 이용 내역
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              헤어핏 AI 사용으로 차감된 크레딧과 이용 기록을 한눈에 확인할 수
              있어요.
            </p>
          </div>
            <button
    onClick={() => router.push("/dashboard")}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-xs md:text-sm text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition"
  >
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white text-[10px]">
      ←
    </span>
    <span className="font-medium">대시보드로 돌아가기</span>
  </button>
        </header>

        {/* 에러 메시지 */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* 요약 카드 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
            <div className="text-sm text-gray-500 mb-1">현재 크레딧</div>
            <div className="text-3xl font-bold text-indigo-600">
              {user?.credits ?? "-"}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              요금제: {user?.plan_type || "free"}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
            <div className="text-sm text-gray-500 mb-1">전체 생성 횟수</div>
            <div className="text-3xl font-bold text-gray-900">
              {data?.total_count ?? 0}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              AI 생성으로 차감된 총 건수
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
            <div className="text-sm text-gray-500 mb-1">이번 달 생성 횟수</div>
            <div className="text-3xl font-bold text-gray-900">
              {data?.this_month_count ?? 0}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              이번 달 헤어 스타일 변환 요청 수
            </div>
          </div>
        </section>

        {/* 이용 내역 리스트 (이미지 X) */}
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-semibold text-gray-800">크레딧 이용 내역</h2>
              <p className="text-xs text-gray-400 mt-1">
                AI 스타일 변환으로 차감된 내역을 표시합니다. (건당 -1 크레딧)
              </p>
            </div>
            {!loading && (
              <span className="text-xs text-gray-400">
                페이지 {currentPage} / {totalPages || 1}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-10 bg-gray-100 rounded-lg"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-2">ID</th>
                      <th className="p-2">일시</th>
                      <th className="p-2">유형</th>
                      <th className="p-2">크레딧 변화</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!data || data.items.length === 0) && (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-4 text-center text-gray-400 text-xs"
                        >
                          아직 이용 내역이 없습니다.
                        </td>
                      </tr>
                    )}

                    {data?.items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-2 text-xs text-gray-700">
                          #{item.id}
                        </td>
                        <td className="p-2 text-xs text-gray-700">
                          {formatDateTime(item.created_at)}
                        </td>
                        <td className="p-2 text-xs text-gray-700">
                          AI 생성 (헤어 변환)
                        </td>
                        <td className="p-2 text-xs">
                          <span className="font-semibold text-red-500">
                            -1 크레딧
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              {data && data.total_count > PAGE_SIZE && (
                <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || loading}
                    className={`px-3 py-1 rounded-lg border ${
                      currentPage === 1 || loading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    ← 이전
                  </button>

                  <span>
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={
                      loading || !data || currentPage >= totalPages
                    }
                    className={`px-3 py-1 rounded-lg border ${
                      loading || !data || currentPage >= totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    다음 →
                  </button>
                </div>
              )}
            </>
          )}

          {/* 결제(충전) 내역 안내 텍스트 - 나중에 CreditLog 붙일 자리 */}
          <div className="mt-6 border-t pt-4">
            <p className="text-xs text-gray-400">
              ※ 요금제 결제(크레딧 충전) 내역은 추후 결제 로그 기능 추가 후 이
              화면에서 함께 확인하실 수 있도록 확장 예정입니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
