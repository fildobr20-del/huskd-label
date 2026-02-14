"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  DollarSign,
  Clock,
  Flame,
  Users,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BalanceData {
  totalGross: number;
  modelShare: number;
  recruiterShare: number;
  weeklyEarnings: { day: string; amount: number }[];
  platformBreakdown: { name: string; amount: number; sessions: number }[];
  recentPayouts: {
    id: string;
    date: string;
    amount: number;
    platform: string;
    status: string;
  }[];
  pendingBalance: number;
  lifetimeEarnings: number;
  hoursOnline: number;
}

export function ModelDashboardClient({
  userEmail,
  displayName,
}: {
  userEmail: string;
  displayName: string;
}) {
  const [data, setData] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/balance")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Failed to load data</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background overflow-hidden">
      {/* Ambient background orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[100px]" />
        <div className="absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.02] blur-[80px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <DashboardHeader userEmail={userEmail} role="model" />

        <main className="flex-1 px-4 py-5 md:px-6 md:py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 md:gap-6">
            {/* Welcome banner */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                  Welcome back, {displayName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {"Here's your earnings overview"}
                </p>
              </div>
              <span className="glass-pill hidden rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary md:inline-block">
                Premium Model
              </span>
            </div>

            {/* Finance Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FinanceCard
                icon={<DollarSign className="h-5 w-5" />}
                iconColor="text-emerald-400"
                iconBg="bg-emerald-400/10 border-emerald-400/20"
                label="Your Earnings (70%)"
                value={`$${data.modelShare.toFixed(2)}`}
                sub="This week"
                trend="up"
              />
              <FinanceCard
                icon={<Wallet className="h-5 w-5" />}
                iconColor="text-primary"
                iconBg="bg-primary/10 border-primary/20"
                label="Pending Balance"
                value={`$${data.pendingBalance.toFixed(2)}`}
                sub="Awaiting payout"
                trend="neutral"
              />
              <FinanceCard
                icon={<TrendingUp className="h-5 w-5" />}
                iconColor="text-blue-400"
                iconBg="bg-blue-400/10 border-blue-400/20"
                label="Lifetime Earnings"
                value={`$${data.lifetimeEarnings.toFixed(0)}`}
                sub="All time"
                trend="up"
              />
              <FinanceCard
                icon={<Clock className="h-5 w-5" />}
                iconColor="text-orange-400"
                iconBg="bg-orange-400/10 border-orange-400/20"
                label="Hours Online"
                value={`${data.hoursOnline} hrs`}
                sub="This week"
                trend="neutral"
              />
            </div>

            {/* Chart + Platform Breakdown */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 md:gap-6">
              {/* Weekly Chart */}
              <div className="glass glass-highlight glass-float rounded-2xl p-6 lg:col-span-3">
                <h3 className="mb-4 text-lg font-semibold">Weekly Earnings</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.weeklyEarnings}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "#888", fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: "#888", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(0 0% 8%)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        formatter={(value: number) => [
                          `$${value.toFixed(2)}`,
                          "Earnings",
                        ]}
                      />
                      <Bar
                        dataKey="amount"
                        fill="hsl(263 70% 58%)"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Platform Breakdown */}
              <div className="glass glass-highlight glass-float rounded-2xl p-6 lg:col-span-2">
                <h3 className="mb-4 text-lg font-semibold">Platform Breakdown</h3>
                <div className="space-y-3">
                  {data.platformBreakdown.map((p) => {
                    const maxAmount = Math.max(
                      ...data.platformBreakdown.map((x) => x.amount)
                    );
                    const pct = (p.amount / maxAmount) * 100;
                    return (
                      <div key={p.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-muted-foreground">
                            ${p.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="mt-0.5 text-right text-[10px] text-muted-foreground">
                          {p.sessions} sessions
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Payouts + Quick Stats */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 md:gap-6">
              {/* Recent Payouts */}
              <div className="glass glass-highlight glass-float rounded-2xl p-6">
                <h3 className="mb-4 text-lg font-semibold">Recent Payouts</h3>
                <div className="space-y-3">
                  {data.recentPayouts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-medium">{p.platform}</div>
                        <div className="text-xs text-muted-foreground">{p.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          ${p.amount.toFixed(2)}
                        </div>
                        <div
                          className={`text-xs ${
                            p.status === "completed"
                              ? "text-emerald-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {p.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-col gap-3 md:gap-4">
                <QuickStat
                  label="Hours Online This Week"
                  value={`${data.hoursOnline} hrs`}
                  sub={`Avg ${(data.hoursOnline / 7).toFixed(1)} hrs/day`}
                  icon={<Clock className="h-4 w-4" />}
                  iconColor="text-blue-400"
                  iconBg="bg-blue-400/10 border-blue-400/20"
                />
                <QuickStat
                  label="Top Earning Day"
                  value={
                    data.weeklyEarnings.reduce((best, d) =>
                      d.amount > best.amount ? d : best
                    ).day
                  }
                  sub={`$${data.weeklyEarnings.reduce((best, d) => (d.amount > best.amount ? d : best)).amount.toFixed(0)} earned`}
                  icon={<Flame className="h-4 w-4" />}
                  iconColor="text-orange-400"
                  iconBg="bg-orange-400/10 border-orange-400/20"
                />
                <QuickStat
                  label="Gross Revenue"
                  value={`$${data.totalGross.toFixed(0)}`}
                  sub="Before splits"
                  icon={<Users className="h-4 w-4" />}
                  iconColor="text-primary"
                  iconBg="bg-primary/10 border-primary/20"
                />
              </div>
            </div>
          </div>
        </main>

        <footer className="glass-header relative z-10 px-4 py-4 text-center text-xs text-muted-foreground md:px-6">
          {"Husk'd Label"} &middot; Secure Dashboard &middot; All amounts in USD
        </footer>
      </div>
    </div>
  );
}

function FinanceCard({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  sub,
  trend,
}: {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
  trend: "up" | "down" | "neutral";
}) {
  return (
    <div className="glass glass-highlight glass-float rounded-2xl p-5 transition-all">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        {trend === "up" && <ArrowUpRight className="h-4 w-4 text-emerald-400" />}
        {trend === "down" && <ArrowDownRight className="h-4 w-4 text-red-400" />}
      </div>
      <div className="mt-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <div className="mt-0.5 text-xl font-bold text-foreground md:text-2xl">
          {value}
        </div>
        <span className="text-xs text-muted-foreground">{sub}</span>
      </div>
    </div>
  );
}

function QuickStat({
  label,
  value,
  sub,
  icon,
  iconColor,
  iconBg,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="glass glass-highlight glass-float relative flex flex-1 items-center gap-4 overflow-hidden rounded-2xl p-5 transition-all">
      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
      <div className="relative z-10 flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="mt-0.5 text-xl font-bold text-foreground md:text-2xl">
          {value}
        </span>
        <span className="text-xs text-muted-foreground">{sub}</span>
      </div>
    </div>
  );
}
