"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://hairfit-backend-production.up.railway.app";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 회원 목록 불러오기
  const fetchUsers = async () => {
    try {
      const token =
        (typeof window !== "undefined" &&
          (localStorage.getItem("hairfit_token") ||
            localStorage.getItem("token"))) ||
        "";

      if (!token) {
        alert("로그인이 필요합니다.");
        router.push("/");
        return;
      }

      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("관리자만 들어올 수 있습니다.");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 정보 수정 (크레딧 충전 등)
  const handleUpdate = async (userId: number, plan: string, credits: number) => {
    try {
      const token =
        (typeof window !== "undefined" &&
          (localStorage.getItem("hairfit_token") ||
            localStorage.getItem("token"))) ||
        "";

      await axios.put(
        `${API_URL}/admin/users/${userId}`,
        {
          plan_type: plan,
          credits: credits,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("수정 완료!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">관리자 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">👑 관리자 페이지</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-500 underline"
          >
            서비스 화면으로
          </button>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-500">등록된 회원이 아직 없습니다.</p>
        ) : (
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
                      className="border p-1 rounded w-20 text-right"
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
                        handleUpdate(user.id, plan, parseInt(cred || "0", 10));
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      저장
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
