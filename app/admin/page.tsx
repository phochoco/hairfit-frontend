"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

interface User {
  id: number;
  email: string;
  shop_name?: string;
  plan_type: string;
  credits: number;
}

interface Summary {
  today_count: number;
  week_count: number;
  total_count: number;
}

interface GenerationLog {
  id: number;
  user_email: string;
  shop_name?: string;
  plan_type: string;
  created_at: string;
  input_image: string;
  result_image: string;
}

export default function AdminPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [logs, setLogs] = useState<GenerationLog[]>([]);

  const [emailFilter, setEmailFilter] = useState("");
  const [days, setDays] = useState(7);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const getAuthHeaders = () => {
    if (typeof window === "undefined") return {};
    const token =
      localStorage.getItem("hairfit_token") ||
      localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 회원 목록 불러오기
  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(`${API_URL}/admin/users`, {
        headers: getAuthHeaders(),
      });
      setUsers(res.data);
    } catch (err) {
      alert("관리자만 접근할 수 있습니다.");
      router.push("/dashboard");
    }
  };

  // 생성 요약 불러오기
  const fetchSummary = async () => {
    try {
      const res = await axios.get<Summary>(
        `${API_URL}/admin/generations/summary`,
        { headers: getAuthHeaders() }
      );
      setSummary(res.data);
    } catch (err) {
      console.error("요약 불러오기 실패", err);
    }
  };

  // 생성 로그 불러오기
  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const params: any = {};
      if (emailFilter) params.email = emailFilter;
      if (days) params.days = days;

      const res = await axios.get<GenerationLog[]>(
        `${API_URL}/admin/generations`,
        {
          headers: getAuthHeaders(),
          params,
        }
      );
      setLogs(res.data);
    } catch (err) {
      console.error("생성 로그 불러오기 실패", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    // 로그인 토큰 없으면 내보내기
    if (typeof window === "undefined") return;
    const token =
      localStorage.getItem("hairfit_token") ||
      localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/");
      return;
    }

    fetchUsers();
    fetchSummary();
    fetchLogs();
  }, [router]);

  // 회원 정보 수정 (플랜/크레딧)
  const handleUpdateUser = async (
    userId: number,
    plan: string,
    credits: number
  ) => {
    try {
      await axios.put(
        `${API_URL}/admin/users/${userId}`,
        {
          plan_type: plan,
          credits: credits,
        },
        {
          headers: getAuthHeaders(),
        }
      );
      alert("수정 완료!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* 상단 헤더 */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">👑 HairFit 관리자 대시보드</h1>
          <p className="text-gray-500 text-sm mt-1">
            오늘/이번주 생성 현황과 회원/생성 로그를 한눈에 관리합니다.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-blue-600 hover:underline"
        >
          ← 서비스 화면으로
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* 1. 생성 요약 카드 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-500">오늘 생성 수</div>
            <div className="text-3xl font-bold mt-1">
              {summary ? summary.today_count : "-"}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-500">최근 7일 생성 수</div>
            <div className="text-3xl font-bold mt-1">
              {summary ? summary.week_count : "-"}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-500">총 누적 생성 수</div>
            <div className="text-3xl font-bold mt-1">
              {summary ? summary.total_count : "-"}
            </div>
          </div>
        </section>

        {/* 2. 생성 로그 테이블 */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">생성 로그</h2>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="이메일 검색"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="border rounded-lg px-3 py-1 text-sm"
              />
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="border rounded-lg px-2 py-1 text-sm"
              >
                <option value={1}>오늘</option>
                <option value={7}>최근 7일</option>
                <option value={30}>최근 30일</option>
                <option value={0}>전체</option>
              </select>
              <button
                onClick={fetchLogs}
                className="text-sm px-3 py-1 rounded-lg bg-gray-900 text-white hover:bg-black"
              >
                필터 적용
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">이메일</th>
                  <th className="p-2 text-left">샵명</th>
                  <th className="p-2 text-left">플랜</th>
                  <th className="p-2 text-left">생성 시각</th>
                  <th className="p-2 text-left">입력 이미지</th>
                  <th className="p-2 text-left">결과 이미지</th>
                </tr>
              </thead>
              <tbody>
                {loadingLogs ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-400">
                      로딩 중...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-400">
                      생성 로그가 없습니다.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{log.id}</td>
                      <td className="p-2">{log.user_email}</td>
                      <td className="p-2">{log.shop_name || "-"}</td>
                      <td className="p-2">{log.plan_type}</td>
                      <td className="p-2">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="p-2">
                        <a
                          href={log.input_image}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          보기
                        </a>
                      </td>
                      <td className="p-2">
                        <a
                          href={log.result_image}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          보기
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. 회원 관리 테이블 */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">회원 관리</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">이메일</th>
                  <th className="p-2 text-left">미용실명</th>
                  <th className="p-2 text-left">등급</th>
                  <th className="p-2 text-left">크레딧</th>
                  <th className="p-2 text-left">관리</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const planId = `plan-${user.id}`;
                  const creditId = `credit-${user.id}`;
                  return (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{user.id}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.shop_name || "-"}</td>
                      <td className="p-2">
                        <select
                          id={planId}
                          defaultValue={user.plan_type}
                          className="border p-1 rounded"
                        >
                          <option value="free">Free</option>
                          <option value="vip">VIP</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          id={creditId}
                          type="number"
                          defaultValue={user.credits}
                          className="border p-1 rounded w-20"
                        />
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => {
                            const plan = (
                              document.getElementById(
                                planId
                              ) as HTMLSelectElement
                            ).value;
                            const credStr = (
                              document.getElementById(
                                creditId
                              ) as HTMLInputElement
                            ).value;
                            const cred = parseInt(credStr || "0", 10);
                            handleUpdateUser(user.id, plan, cred);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          저장
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
