"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  Users,
  DollarSign,
  TrendingUp,
  Copy,
  Check,
  Link as LinkIcon,
  UserPlus,
  ArrowUpRight,
  BarChart3,
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

interface Recruit {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

interface Props {
  userEmail: string;
  displayName: string;
  referralCode: string;
  recruits: Recruit[];
}

// Mock earnings data per model (in real app, this comes from the balance API)
function generateMockModelEarnings(modelId: string) {
  // Use model id as seed for consistent-ish random
  const seed = modelId.charCodeAt(0) + modelId.charCodeAt(1);
  const gross = ((seed * 137) % 3000) + 500;
  return {
    grossEarnings: gross,
    recruiterCut: Math.round(gross * 0.1 * 100) / 100,
  };
}

export function RecruiterDashboardClient({
  userEmail,
  displayName,
  referralCode,
  recruits,
}: Props) {
  const [copied, setCopied] = useState(false);
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = `${siteUrl}/login?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate earnings
  const modelsWithEarnings = recruits.map((m) => ({
    ...m,
    ...generateMockModelEarnings(m.id),
  }));

  const totalRecruiterEarnings = modelsWithEarnings.reduce(
    (sum, m) => sum + m.recruiterCut,
    0
  );

  // Mock monthly chart data
  const monthlyData = [
    { month: "Sep", earnings: 420 },
    { month: "Oct", earnings: 680 },
    { month: "Nov", earnings: 550 },
    { month: "Dec", earnings: 890 },
    { month: "Jan", earnings: 1120 },
    { month: "Feb", earnings: Math.round(totalRecruiterEarnings) || 750 },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient light orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="ambient-orb -left-32 top-16 h-[600px] w-[600px] bg-violet-600/[0.08]"
          style={{ animation: "orb-float 14s ease-in-out infinite" }}
        />
        <div
          className="ambient-orb -right-24 top-1/4 h-[500px] w-[500px] bg-blue-600/[0.07]"
          style={{ animation: "orb-float-slow 18s ease-in-out infinite" }}
        />
        <div
          className="ambient-orb bottom-[-100px] left-1/3 h-[450px] w-[450px] bg-emerald-500/[0.05]"
          style={{ animation: "orb-float 20s ease-in-out infinite reverse" }}
        />
      </div>

      <DashboardHeader userEmail={userEmail} role="recruiter" />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {/* Welcome */}
        <div className="mb-8 lg:mb-10">
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {"Here's an overview of your recruitment performance"}
          </p>
        </div>

        {/* Stats Cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:mb-10">
          <StatCard
            icon={<Users className="h-5 w-5" />}
            iconColor="text-blue-400"
            iconBg="bg-blue-400/10 border-blue-400/20"
            label="Total Models"
            value={String(recruits.length)}
            sub={recruits.length > 0 ? "Active" : "Invite your first model"}
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5" />}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-400/10 border-emerald-400/20"
            label="Your Earnings (10%)"
            value={`$${totalRecruiterEarnings.toFixed(2)}`}
            sub="This period"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            iconColor="text-primary"
            iconBg="bg-primary/10 border-primary/20"
            label="Avg per Model"
            value={
              recruits.length > 0
                ? `$${(totalRecruiterEarnings / recruits.length).toFixed(2)}`
                : "$0.00"
            }
            sub="Recruiter cut"
          />
          <StatCard
            icon={<BarChart3 className="h-5 w-5" />}
            iconColor="text-orange-400"
            iconBg="bg-orange-400/10 border-orange-400/20"
            label="Models Gross"
            value={`$${modelsWithEarnings.reduce((s, m) => s + m.grossEarnings, 0).toFixed(0)}`}
            sub="Total model revenue"
          />
        </section>

        {/* Chart + Referral */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:mb-10 lg:grid-cols-5">
          {/* Chart */}
          <section className="glass glass-highlight glass-float rounded-2xl p-6 lg:col-span-3">
            <h2 className="mb-4 text-lg font-semibold">Earnings Overview</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#888", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(0 0% 8%)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    formatter={(value: number) => [`$${value}`, "Earnings"]}
                  />
                  <Bar
                    dataKey="earnings"
                    fill="hsl(263 70% 58%)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Referral Tools */}
          <section className="glass glass-highlight glass-float rounded-2xl p-6 lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              Referral Tools
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Your Referral Code
                </label>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 font-mono text-lg font-bold text-primary">
                  {referralCode}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Referral Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 truncate rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-muted-foreground">
                    {referralLink}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-muted-foreground transition hover:bg-white/[0.08] hover:text-foreground"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <UserPlus className="h-4 w-4" />
                  How it works
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Share your link with models. When they sign up and start earning,
                  you automatically receive 10% of their gross revenue.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Models Table */}
        <section className="glass glass-highlight glass-float rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Your Models</h2>
          {modelsWithEarnings.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">No models recruited yet</p>
              <p className="mt-1 text-sm text-muted-foreground/60">
                Share your referral link to start building your network
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 font-medium">Model</th>
                    <th className="pb-3 font-medium">Joined</th>
                    <th className="pb-3 text-right font-medium">Gross Earnings</th>
                    <th className="pb-3 text-right font-medium">Your Cut (10%)</th>
                  </tr>
                </thead>
                <tbody>
                  {modelsWithEarnings.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                    >
                      <td className="py-3">
                        <div className="font-medium">
                          {m.display_name || m.email?.split("@")[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">{m.email}</div>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right font-medium">
                        ${m.grossEarnings.toFixed(2)}
                      </td>
                      <td className="py-3 text-right font-semibold text-emerald-400">
                        <span className="inline-flex items-center gap-1">
                          ${m.recruiterCut.toFixed(2)}
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="liquid-glass-inset rounded-2xl px-6 py-4">
            <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
              <p>{"Husk'd Label Recruiter Portal"}</p>
              <p>{"Need help? Contact support@huskdlabel.com"}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="glass glass-highlight glass-float rounded-2xl p-5 transition-all">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          <div className="mt-0.5 text-xl font-bold text-foreground">{value}</div>
          <span className="text-xs text-muted-foreground">{sub}</span>
        </div>
      </div>
    </div>
  );
}
