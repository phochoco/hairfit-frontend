"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

type User = {
  id: number;
  email: string;
  shop_name: string | null;
  plan_type: string;
  credits: number;
};

type Summary = {
  today_count: number;
  week_count: number;
  month_count: number;
};

type GenerationLog = {
  id: number;
  user_email: string;
  shop_name: string | null;
  created_at: string | null;
  input_image: string;
  result_image: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loadingLogs, setLoadingLogs] = useState(false);

  // 토큰 가져오기 헬퍼
  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("hairfit_token") || localStorage.getItem("token");
  };

  // 회원 목록
  const fetchUsers = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("no token");

      const res = await axios.get<User[]>(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      alert("관리자만 들어올 수 있습니다.");
      router.push("/dashboard");
    }
  };

  // 요약 정보
  const fetchSummary = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get<Summary>(
        `${API_URL}/admin/generations/summary`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSummary(res.data);
    } catch (err) {
      console.error("요약 정보 불러오기 실패", err);
    }
  };

  // 생성 로그 목록
  const fetchLogs = async (emailFilter?: string) => {
    try {
      const token = getToken();
      if (!token) return;

      setLoadingLogs(true);

      const res = await axios.get<GenerationLog[]>(
        `${API_URL}/admin/generations`,
        {
          params: {
            email: emailFilter || undefined,
            limit: 50,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLogs(res.data);
    } catch (err) {
      console.error("로그 불러오기 실패", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  // 정보 수정 (크레딧/플랜)
  const handleUpdateUser = async (userId: number, plan: string, credits: number) => {
    try {
      const token = getToken();
      if (!token) return;

      await axios.put(
        `${API_URL}/admin/users/${userId}`,
        { plan_type: plan, credits },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("수정 완료!");
      fetchUsers();
    } catch (err) {
      alert("수정 실패");
    }
  };

  // 최초 로딩
  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/");
      return;
    }

    fetchUsers();
    fetchSummary();
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span role="img" aria-label="crown">
              👑
            </span>
            관리자 페이지
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:underline text-sm"
          >
            서비스 화면으로
          </button>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-xs text-gray-500 mb-1">오늘 생성</p>
            <p className="text-2xl font-bold text-blue-600">
              {summary ? summary.today_count : "-"}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-xs text-gray-500 mb-1">최근 7일</p>
            <p className="text-2xl font-bold text-indigo-600">
              {summary ? summary.week_count : "-"}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-xs text-gray-500 mb-1">이번 달</p>
            <p className="text-2xl font-bold text-purple-600">
              {summary ? summary.month_count : "-"}
            </p>
          </div>
        </div>

        {/* 1) 회원/크레딧 관리 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">회원 / 크레딧 관리</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">이메일</th>
                  <th className="p-3">미용실명</th>
                  <th className="p-3">등급</th>
                  <th className="p-3">크레딧</th>
                  <th className="p-3">관리</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.shop_name}</td>
                    <td className="p-3">
                      <select
                        id={`plan-${user.id}`}
                        defaultValue={user.plan_type}
                        className="border p-1 rounded"
                      >
                        <option value="free">Free</option>
                        <option value="vip">VIP</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        id={`credit-${user.id}`}
                        type="number"
                        defaultValue={user.credits}
                        className="border p-1 rounded w-20"
                      />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          const plan = (
                            document.getElementById(
                              `plan-${user.id}`
                            ) as HTMLSelectElement
                          ).value;
                          const cred = (
                            document.getElementById(
                              `credit-${user.id}`
                            ) as HTMLInputElement
                          ).value;
                          handleUpdateUser(user.id, plan, parseInt(cred, 10));
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                      >
                        저장
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={6}>
                      등록된 회원이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2) 생성 로그 */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">생성 로그 (최근 50건)</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="이메일 검색"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
              <button
                onClick={() => fetchLogs(searchEmail)}
                className="text-sm bg-gray-800 text-white px-3 py-1 rounded hover:bg-black"
              >
                검색
              </button>
            </div>
          </div>

          {loadingLogs ? (
            <p className="text-sm text-gray-500">로그 불러오는 중...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">시간</th>
                    <th className="p-2">이메일</th>
                    <th className="p-2">미용실명</th>
                    <th className="p-2">결과 보기</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{log.id}</td>
                      <td className="p-2">
                        {log.created_at
                          ? new Date(log.created_at).toLocaleString()
                          : "-"}
                      </td>
                      <td className="p-2">{log.user_email}</td>
                      <td className="p-2">{log.shop_name}</td>
                      <td className="p-2">
                        <a
                          href={log.result_image}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          이미지
                        </a>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td className="p-3 text-gray-500" colSpan={5}>
                        아직 생성 로그가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
