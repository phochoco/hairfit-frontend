"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Download, ArrowLeft } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

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
  const [data, setData] = useState<MyGenResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMyGenerations = async () => {
    try {
      const token =
        (typeof window !== "undefined" &&
          (localStorage.getItem("hairfit_token") ||
            localStorage.getItem("token"))) ||
        null;
      if (!token) {
        alert("로그인이 필요합니다.");
        router.push("/");
        return;
      }

      const res = await axios.get<MyGenResponse>(
        `${API_URL}/me/generations?limit=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("이용 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGenerations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">내 이용 내역을 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">이용 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* 상단바 */}
      <nav className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft size={16} />
            대시보드로
          </button>
          <h1 className="text-xl font-bold text-gray-800">내 생성 내역</h1>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold">
            전체 생성 {data.total_count}장
          </div>
          <div className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
            이번 달 {data.this_month_count}장
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {data.items.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            아직 생성된 내역이 없습니다. 대시보드에서 첫 스타일을 만들어 보세요!
          </p>
        ) : (
          <div className="space-y-4">
            {data.items.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center"
              >
                <div className="flex-1 flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {item.result_image ? (
                      <img
                        src={item.result_image}
                        alt="결과 이미지"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">
                        이미지 없음
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">
                      생성 ID #{item.id}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {item.result_image && (
                    <a
                      href={item.result_image}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-black"
                    >
                      <Download size={14} />
                      결과 다운로드
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
