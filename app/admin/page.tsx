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
  plan_type?: string | null;
  credits: number;
  role?: string | null;
};

type GenerationLog = {
  id: number;
  user_id: number;
  user_email: string;
  shop_name?: string | null;
  input_image: string;
  result_image: string;
  created_at: string | null;
};

type StatSummary = {
  today: number;
  this_week: number;
};

export default function AdminPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [stats, setStats] = useState<StatSummary | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<number | null>(null);

  const getToken = () =>
    (typeof window !== "undefined" &&
      (localStorage.getItem("hairfit_token") ||
        localStorage.getItem("token"))) ||
    "";

  // ---------- API: 회원 목록 ----------
  const fetchUsers = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("no token");

      const res = await axios.get<User[]>(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
      setIsAdmin(true);
    } catch (err: any) {
      console.error("유저 목록 불러오기 실패", err);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          setIsAdmin(false);
          setError("관리자 권한이 없습니다.");
        } else if (err.response?.status === 401) {
          setError("로그인이 필요합니다.");
          router.push("/");
        } else {
          setError("유저 목록을 불러오지 못했습니다.");
        }
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // ---------- API: 통계 + 생성 로그 ----------
  const fetchStatsAndLogs = async (emailFilter?: string) => {
    try {
      const token = getToken();
      if (!token) throw new Error("no token");

      const headers = { Authorization: `Bearer ${token}` };

      // 오늘/이번주 통계
      const statsRes = await axios.get<StatSummary>(
        `${API_URL}/admin/generation-stats`,
        { headers }
      );
      setStats(statsRes.data);

      // 생성 로그 (v2: /admin/generation-logs, { items: [...] } 반환)
      const logsRes = await axios.get(`${API_URL}/admin/generation-logs`, {
        headers,
        params: {
          user_email: emailFilter || undefined,
          limit: 100,
          offset: 0,
        },
      });

      const raw = logsRes.data as any;
      const items: GenerationLog[] = Array.isArray(raw?.items)
        ? raw.items
        : [];
      setLogs(items);
    } catch (err) {
      console.error("생성 로그/통계 불러오기 실패", err);
      // 여기서는 에러만 콘솔에, 상단 error는 유저 목록에서 처리
    }
  };

  // ---------- 회원 정보(플랜/크레딧) 수정 ----------
  const handleUpdateUser = async (user: User) => {
    const token = getToken();
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/");
      return;
    }

    const planSelect = document.getElementById(
      `plan-${user.id}`
    ) as HTMLSelectElement | null;
    const creditInput = document.getElementById(
      `credit-${user.id}`
    ) as HTMLInputElement | null;

    if (!planSelect || !creditInput) return;

    const newPlan = planSelect.value;
    const creditStr = creditInput.value;
    const newCredits = parseInt(creditStr || "0", 10);

    if (Number.isNaN(newCredits) || newCredits < 0) {
      alert("크레딧은 0 이상의 숫자로 입력해 주세요.");
      return;
    }

    if (
      !confirm(
        `${user.email}\n플랜: ${user.plan_type || "없음"} → ${newPlan}\n크레딧: ${
          user.credits
        } → ${newCredits}\n\n이대로 저장할까요?`
      )
    ) {
      return;
    }

    try {
      setSavingUserId(user.id);
      await axios.put(
        `${API_URL}/admin/users/${user.id}`,
        {
          plan_type: newPlan,
          credits: newCredits,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 프론트 상태 갱신
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, plan_type: newPlan, credits: newCredits }
            : u
        )
      );
      alert("회원 정보가 저장되었습니다.");
    } catch (err) {
      console.error("회원 수정 실패", err);
      alert("회원 정보를 저장하는 중 오류가 발생했습니다.");
    } finally {
      setSavingUserId(null);
    }
  };

  // ---------- 회원 삭제 ----------
  const handleDeleteUser = async (user: User) => {
    const ok = confirm(
      `${user.email} 계정을 정말 삭제하시겠습니까?\n(생성 로그 등 관련 데이터도 함께 영향 받을 수 있습니다.)`
    );
    if (!ok) return;

    const token = getToken();
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/");
      return;
    }

    try {
      setSavingUserId(user.id);
      await axios.delete(`${API_URL}/admin/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      alert("회원이 삭제되었습니다.");
    } catch (err) {
      console.error("회원 삭제 실패", err);
      alert("회원 삭제 중 오류가 발생했습니다.");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleSearchLogs = async () => {
    await fetchStatsAndLogs(searchEmail.trim() || undefined);
  };

  // ---------- 초기 로딩 ----------
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchUsers();
      await fetchStatsAndLogs();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- 상태별 화면 ----------

  if (loading && isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">관리자 페이지 로딩 중...</p>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-3">
          <h1 className="text-xl font-bold text-gray-900">관리자 권한 없음</h1>
          <p className="text-sm text-gray-500">
            이 페이지는 관리자 전용입니다. 관리자 계정으로 다시 로그인해 주세요.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 w-full py-2 rounded-xl bg-gray-900 text-white text-sm"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 상단 헤더 */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              👑 HairFit 관리자 페이지
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              회원 크레딧 / 플랜 / 생성 로그를 한 눈에 관리하는 어드민 콘솔입니다.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-blue-600 underline"
          >
            ← 대시보드로 돌아가기
          </button>
        </header>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* 통계 카드 + 로그 검색 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500 mb-1">오늘 생성 건수</div>
            <div className="text-3xl font-bold text-blue-600">
              {stats?.today ?? 0}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500 mb-1">이번 주 생성 건수</div>
            <div className="text-3xl font-bold text-indigo-600">
              {stats?.this_week ?? 0}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
            <div className="text-sm text-gray-500 mb-2">생성 로그 이메일 검색</div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="이메일 일부 입력"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="flex-1 border rounded-lg px-2 py-1 text-sm"
              />
              <button
                onClick={handleSearchLogs}
                className="px-3 py-1 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                검색
              </button>
            </div>
          </div>
        </section>

        {/* 생성 로그 테이블 */}
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">최근 생성 로그</h2>
            <span className="text-xs text-gray-400">
              /admin/generation-logs 기준 최대 100건 표시
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">이메일</th>
                  <th className="p-2">미용실명</th>
                  <th className="p-2">생성시간</th>
                  <th className="p-2">원본</th>
                  <th className="p-2">결과</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-4 text-center text-gray-400 text-xs"
                    >
                      생성 로그가 아직 없습니다.
                    </td>
                  </tr>
                )}
                {logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{log.id}</td>
                    <td className="p-2">{log.user_email}</td>
                    <td className="p-2">{log.shop_name || "-"}</td>
                    <td className="p-2 text-xs text-gray-500">
                      {log.created_at
                        ? new Date(log.created_at).toLocaleString("ko-KR")
                        : "-"}
                    </td>
                    <td className="p-2">
                      <a
                        href={log.input_image}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-500 underline"
                      >
                        보기
                      </a>
                    </td>
                    <td className="p-2">
                      <a
                        href={log.result_image}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-500 underline"
                      >
                        보기
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 회원 / 크레딧 관리 테이블 */}
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">회원 / 크레딧 관리</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">이메일</th>
                  <th className="p-2">미용실명</th>
                  <th className="p-2">플랜</th>
                  <th className="p-2">크레딧</th>
                  <th className="p-2">관리</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-4 text-center text-gray-400 text-xs"
                    >
                      등록된 회원이 없습니다.
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{u.id}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.shop_name || "-"}</td>
                    <td className="p-2">
                      <select
                        id={`plan-${u.id}`}
                        defaultValue={u.plan_type || "free"}
                        className="border p-1 rounded text-xs"
                      >
                        <option value="free">Free</option>
                        <option value="starter">Starter</option>
                        <option value="pro">Pro</option>
                        <option value="vip">VIP</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        id={`credit-${u.id}`}
                        type="number"
                        defaultValue={u.credits}
                        className="border p-1 rounded w-24 text-xs"
                      />
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleUpdateUser(u)}
                        disabled={savingUserId === u.id}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                      >
                        {savingUserId === u.id ? "저장 중..." : "저장"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u)}
                        disabled={savingUserId === u.id}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
