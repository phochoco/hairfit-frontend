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
  today: number;       // /admin/generation-stats 용
  this_week: number;   // /admin/generation-stats 용
};

export default function AdminPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [stats, setStats] = useState<StatSummary | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    (typeof window !== "undefined" &&
      (localStorage.getItem("hairfit_token") ||
        localStorage.getItem("token"))) ||
    "";

  // -------- API 호출들 --------
  const fetchUsers = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("no token");

      const res = await axios.get<User[]>(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error("유저 목록 불러오기 실패", err);
      alert("관리자만 들어올 수 있습니다.");
      router.push("/dashboard");
    }
  };

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

      // 생성 로그
      const logsRes = await axios.get(`${API_URL}/admin/generations`, {
        headers,
        params: {
          user_email: emailFilter || undefined,
          limit: 100,
          offset: 0,
        },
      });

      // 백엔드가 { items: [...] } 형식이기 때문에 방어적으로 처리
      const raw = (logsRes.data as any) || {};
      const items: GenerationLog[] = Array.isArray(raw.items)
        ? raw.items
        : Array.isArray(raw)
        ? raw
        : [];
      setLogs(items);
    } catch (err) {
      console.error("생성 로그/통계 불러오기 실패", err);
      // 관리자 권한 없으면 여기서도 튕김
    }
  };

  const handleUpdateUser = async (
    userId: number,
    planType: string,
    credits: number
  ) => {
    try {
      const token = getToken();
      if (!token) throw new Error("no token");

      await axios.put(
        `${API_URL}/admin/users/${userId}`,
        {
          plan_type: planType,
          credits,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("수정 완료!");
      await Promise.all([fetchUsers(), fetchStatsAndLogs(searchEmail)]);
    } catch (err) {
      console.error("회원 수정 실패", err);
      alert("수정 실패");
    }
  };

  const handleSearch = async () => {
    await fetchStatsAndLogs(searchEmail.trim() || undefined);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchStatsAndLogs()]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-sm">관리자 페이지 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>👑 관리자 페이지</span>
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-500 underline"
          >
            서비스 화면으로
          </button>
        </div>

        {/* 오늘/이번주 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <div className="text-sm text-gray-500 mb-1">로그 검색</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="이메일 일부 입력"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="flex-1 border rounded-lg px-2 py-1 text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="px-3 py-1 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700"
                >
                  검색
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 생성 로그 테이블 */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">최근 생성 로그</h2>
            <span className="text-xs text-gray-400">
              최대 100건까지 표시됩니다.
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
                        ? new Date(log.created_at).toLocaleString()
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
        </div>

        {/* 회원 / 크레딧 관리 테이블 */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">회원 / 크레딧 관리</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">이메일</th>
                  <th className="p-2">미용실명</th>
                  <th className="p-2">등급</th>
                  <th className="p-2">크레딧</th>
                  <th className="p-2">관리</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{u.id}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.shop_name || "-"}</td>
                    <td className="p-2">
                      <select
                        id={`plan-${u.id}`}
                        defaultValue={u.plan_type}
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
                        className="border p-1 rounded w-20 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          const plan = (
                            document.getElementById(
                              `plan-${u.id}`
                            ) as HTMLSelectElement
                          ).value;
                          const creditStr = (
                            document.getElementById(
                              `credit-${u.id}`
                            ) as HTMLInputElement
                          ).value;
                          const creditNum = parseInt(creditStr || "0", 10);
                          handleUpdateUser(u.id, plan, creditNum);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        저장
                      </button>
                    </td>
                  </tr>
                ))}
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
