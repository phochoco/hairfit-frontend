"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ChevronLeft,
  Coins,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Minus,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

type UserMe = {
  id: number;
  email: string;
  shop_name?: string | null;
  plan_type: string;
  credits: number;
  is_active: boolean;
};

type CreditLogItem = {
  id: number;
  change: number;
  reason: string;
  created_at: string | null;
};

type CreditLogResponse = {
  total_count: number;
  items: CreditLogItem[];
};

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMe | null>(null);
  const [logs, setLogs] = useState<CreditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hairfit_token") ||
        localStorage.getItem("token")
      : null;

  useEffect(() => {
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [meRes, logRes] = await Promise.all([
          axios.get<UserMe>(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<CreditLogResponse>(`${API_URL}/me/credit-logs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(meRes.data);
        setLogs(logRes.data.items);
      } catch (err) {
        console.error(err);
        alert("마이페이지 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, router]);

  const formatDate = (iso: string | null) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(d.getDate()).padStart(2, "0")} ${String(
      d.getHours()
    ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const renderChange = (change: number) => {
    if (change > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs md:text-sm">
          <ArrowUpRight className="h-3 w-3" />
          +{change}
        </span>
      );
    }
    if (change < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-rose-600 text-xs md:text-sm">
          <ArrowDownLeft className="h-3 w-3" />
          {change}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-slate-500 text-xs md:text-sm">
        <Minus className="h-3 w-3" />
        0
      </span>
    );
  };

  const renderReason = (reason: string) => {
    if (reason === "free_trial") return "무료 체험 1회";
    if (reason === "generate") return "AI 생성 사용";
    if (reason.startsWith("purchase_")) {
      const plan = reason.replace("purchase_", "");
      return `플랜 구매 (${plan})`;
    }
    return reason;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">마이페이지 불러오는 중...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 상단 바 */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-1 text-xs md:text-sm text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
            대시보드로 돌아가기
          </button>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-800">
              My Re-Fac Art
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8 space-y-6">
        {/* 상단 요약 카드 */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 mb-1">
              계정 정보
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {user.shop_name || "이름 미설정"}
            </p>
            <p className="text-xs text-slate-500">{user.email}</p>
            <p className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
              플랜: {user.plan_type || "free"}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-amber-800 mb-1">
                잔여 크레딧
              </p>
              <p className="text-2xl font-bold text-amber-900">
                {user.credits.toLocaleString()}{" "}
                <span className="text-xs font-medium">크레딧</span>
              </p>
            </div>
            <button
              onClick={() => router.push("/pricing")}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-amber-900 px-3 py-1.5 text-xs font-semibold text-amber-50 hover:bg-black"
            >
              크레딧 충전하기
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 mb-1">
              안내
            </p>
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <Clock className="h-4 w-4 mt-0.5 text-slate-400" />
              <p>
                첫 생성 1회는 <span className="font-semibold">무료 체험</span>으로
                제공됩니다. 그 이후부터는 생성 1회당 기본 1 크레딧이 차감됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* 크레딧 로그 리스트 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 md:text-base">
              크레딧 사용 / 충전 내역
            </h2>
            <span className="text-[11px] text-slate-500">
              최근 {logs.length}건 표시
            </span>
          </div>

          {logs.length === 0 ? (
            <p className="text-xs text-slate-500">
              아직 크레딧 사용/충전 내역이 없습니다.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2.5"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-slate-800 md:text-sm">
                      {renderReason(log.reason)}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {formatDate(log.created_at)}
                    </span>
                  </div>
                  <div className="text-right">
                    {renderChange(log.change)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
