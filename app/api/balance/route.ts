import { NextResponse } from "next/server";

// Имитация API вебкам-сайтов — отдаёт случайные данные
export async function GET() {
  const platforms = ["Chaturbate", "StripChat", "BongaCams", "MyFreeCams"];

  // Генерация случайного дохода за текущую неделю по дням
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyEarnings = weekDays.map((day) => ({
    day,
    amount: Math.round((Math.random() * 400 + 100) * 100) / 100,
  }));

  // Общий доход
  const totalGross = weeklyEarnings.reduce((sum, d) => sum + d.amount, 0);
  // Модель получает 70%
  const modelShare = Math.round(totalGross * 0.7 * 100) / 100;
  // Рекрутер получает 10%
  const recruiterShare = Math.round(totalGross * 0.1 * 100) / 100;

  // Доход по платформам
  const platformBreakdown = platforms.map((name) => ({
    name,
    amount: Math.round((Math.random() * 800 + 200) * 100) / 100,
    sessions: Math.floor(Math.random() * 20 + 5),
  }));

  // Последние выплаты
  const recentPayouts = Array.from({ length: 5 }, (_, i) => ({
    id: `payout-${i + 1}`,
    date: new Date(Date.now() - i * 86400000 * 3).toISOString().split("T")[0],
    amount: Math.round((Math.random() * 500 + 100) * 100) / 100,
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    status: i === 0 ? "pending" : "completed",
  }));

  return NextResponse.json({
    totalGross: Math.round(totalGross * 100) / 100,
    modelShare,
    recruiterShare,
    weeklyEarnings,
    platformBreakdown,
    recentPayouts,
    pendingBalance: Math.round((Math.random() * 300 + 50) * 100) / 100,
    lifetimeEarnings: Math.round((Math.random() * 50000 + 10000) * 100) / 100,
    hoursOnline: Math.round((Math.random() * 20 + 15) * 10) / 10,
  });
}
