"use client";

import { useMemo } from "react";

export default function ProgressPage() {
  const YEAR_DAYS = 365;
  const startDate = new Date("2026-01-01"); // поменяй на свою дату старта
  const today = new Date();

  // сколько дней прошло
  const daysPassed = useMemo(() => {
    const diff = today.getTime() - startDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return Math.max(Math.min(days, YEAR_DAYS), 0);
  }, []);

  // визуальный прогресс по году
  const percent = (daysPassed / YEAR_DAYS) * 100;

  // реальный сложный рост
  const growthMultiplier = Math.pow(1.01, daysPassed);

  // ===== SVG настройки =====
  const size = 250;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-10 shadow-[0_0_60px_rgba(0,0,0,0.7)]">

        <h1 className="text-center text-2xl font-bold tracking-widest mb-8">
          ПРОГРЕСС ГОДА
        </h1>

        <div className="relative flex items-center justify-center">
          <svg width={size} height={size}>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* фон круга */}
            <circle
              stroke="#18181b"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />

            {/* прогресс */}
            <circle
              stroke="url(#gradient)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              r={radius}
              cx={size / 2}
              cy={size / 2}
              className="transition-all duration-1000 ease-out drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
            />
          </svg>

          <div className="absolute text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              {percent.toFixed(1)}%
            </div>
            <div className="text-sm text-zinc-500 tracking-wide">
              год завершён
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-3 text-center">
          <p className="text-zinc-400">
            Дней прошло:{" "}
            <span className="text-white font-semibold">
              {daysPassed} / {YEAR_DAYS}
            </span>
          </p>

          <p className="text-zinc-400">
            Реальный рост:{" "}
            <span className="text-yellow-400 font-semibold">
              {growthMultiplier.toFixed(2)}x
            </span>
          </p>

          <p className="text-xs text-zinc-600 mt-4">
            1% лучше каждый день = 37.78x за год
          </p>
        </div>
      </div>
    </div>
  );
}
