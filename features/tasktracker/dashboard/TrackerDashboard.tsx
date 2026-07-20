"use client";

import { useAppSelector } from "@/store/hooks";
import { BookOpen, CheckCircle2, Download, Trophy } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { cn } from "@/lib/utils";
import { ExportBlockKey, Period } from "../types/types";
import { Habits } from "./Habits";
import { Summary } from "./Summary";
import { Cards } from "./Cards";

export interface Habit {
  id: string;
  name: string;
  completed: Record<string, boolean>;
  streak: number;
  createdAt: string;
  category: string;
  timeOfDay?: string;
}

interface Props {
  theme: boolean;
  todayKey: string;
  count: {
    max: number;
    curr: number;
    QuranCount: number;
  };
}

const periods = [
  { key: "all", label: "Все" },
  { key: "year", label: "Год" },
  { key: "halfyear", label: "6М" },
  { key: "month", label: "Месяц" },
  { key: "day", label: "День" },
];
const periodsData = {
  all: "Все",
  year: "Год",
  halfyear: "6М",
  month: "Месяц",
  day: "День",
};

export default function TrackerDashboard({ theme, todayKey, count }: Props) {
  const tracker = useAppSelector((state) => state.tracker);

  const cardRef = useRef<HTMLDivElement>(null);

  const [period, setPeriod] = useState<Period>("month");

  const [exportConfig, setExportConfig] = useState<
    Record<ExportBlockKey, boolean>
  >({
    cards: true,
    habits: true,
    summary: true,
  });

  const isDark = theme;

  // 🎨 THEME
  const card = isDark
    ? "bg-[#161616] border-[#2a2a2a]"
    : "bg-[#0b1f17] border-[#123d2c]";

  const cardSecondary = isDark ? "bg-[#1d1d1d]" : "bg-[#10271e]";

  const muted = isDark ? "text-zinc-400" : "text-emerald-100/70";

  const muted2 = isDark ? "text-zinc-500" : "text-emerald-100/50";

  const titleText = isDark ? "text-white" : "text-emerald-50";

  const accent = isDark
    ? "bg-amber-500 text-black border-amber-400"
    : "bg-emerald-500 text-black border-emerald-400";

  const accentSoft = isDark
    ? "bg-amber-500/10 border-amber-500/20"
    : "bg-emerald-500/10 border-emerald-500/20";

  // 📅 FILTERED DAYS
  const filteredDays = useMemo(() => {
    const now = new Date();

    return Object.entries(tracker.yearlyData || {}).filter(([date]) => {
      const d = new Date(date);

      if (period === "day") {
        return d.toDateString() === now.toDateString();
      }

      if (period === "month") {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }

      if (period === "halfyear") {
        const sixMonthsAgo = new Date();

        sixMonthsAgo.setMonth(now.getMonth() - 6);

        return d >= sixMonthsAgo;
      }

      if (period === "year") {
        return d.getFullYear() === now.getFullYear();
      }

      if (period === "all") {
        return true;
      }

      return true;
    });
  }, [tracker.yearlyData, period]);

  const habitAnalytics = useMemo(() => {
    const now = new Date();

    return (tracker.habits || []).map((habit) => {
      let totalTasks = 0;
      let completedTasks = 0;

      Object.entries(habit.progress || {}).forEach(([date, dayProgress]) => {
        const d = new Date(date);

        // фильтр периода
        if (period === "day" && d.toDateString() !== now.toDateString()) return;

        if (
          period === "month" &&
          (d.getMonth() !== now.getMonth() ||
            d.getFullYear() !== now.getFullYear())
        )
          return;

        if (period === "halfyear") {
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(now.getMonth() - 6);

          if (d < sixMonthsAgo) return;
        }

        if (period === "year" && d.getFullYear() !== now.getFullYear()) return;

        habit.tasks.forEach((task: any) => {
          totalTasks++;

          const progress = dayProgress?.[task.id];

          if (!progress) return;

          const isDone =
            task.type === "boolean"
              ? progress.completed
              : (progress.value || 0) >= task.target;

          if (isDone) {
            completedTasks++;
          }
        });
      });

      const consistency =
        totalTasks === 0
          ? 0
          : Math.min(100, Math.round((completedTasks / totalTasks) * 100));

      return {
        ...habit,
        completedTasks,
        totalTasks,
        consistency,
      };
    });
  }, [tracker.habits, filteredDays, period]);

  const Quran = filteredDays.reduce((acc, el) => (acc += el[1].Quran), 0);

  const exportStatsAsPNG = async () => {
    // Две ваши реальные темы с картинок:
    // isDark === true (Зелёная тема)
    const config = !isDark
      ? {
          bg: "#071a14", // Изумрудно-зелёный фон
          cardBg: "#0c251e", // Тёмно-зелёные карточки
          cardBorder: "rgba(16, 185, 129, 0.15)",
          textPrimary: "#ffffff",
          textSecondary: "rgba(16, 185, 129, 0.6)",
          accent: "#10b981", // Изумрудный акцент
          streakBg: "linear-gradient(135deg, #0c251e, #071713)",
        }
      : {
          bg: "#121212", // Угольно-чёрный фон
          cardBg: "#1a1a1a", // Графитовые карточки
          cardBorder: "rgba(255, 152, 0, 0.12)",
          textPrimary: "#ffffff",
          textSecondary: "rgba(255, 152, 0, 0.5)",
          accent: "#ff9800", // Янтарно-оранжевый акцент
          streakBg: "linear-gradient(135deg, #24190e, #1a1a1a)",
        };

    const container = document.createElement("div");
    container.style.position = "fixed";
    // container.style.left = "-9999px";
    container.style.top = "0";

    container.innerHTML = `
    <div style="
      width: 800px;
      padding: 44px;
      background: ${config.bg};
      color: ${config.textPrimary};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-sizing: border-box;
    ">
      
      <!-- HEADER -->
      <div style="
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: 40px;
        border-bottom: 2px solid ${config.cardBorder};
        padding-bottom: 28px;
      ">
        <div>
          <div style="font-size: 36px; font-weight: 900; letter-spacing: -0.04em; color: #ffffff; text-transform: uppercase;">
            YOUR DIARY
          </div>
        </div>
        <!-- СЕРИЯ ДНЕЙ -->
        <div style="
          font-size: 13px; 
          font-weight: 700; 
          letter-spacing: 0.03em; 
          color: #ffffff; 
          background: linear-gradient(135deg, ${config.accent}20, ${
      config.accent
    }40); 
          padding: 8px 16px; 
          border-radius: 12px; 
          border: 1px solid ${config.accent}60;
          box-shadow: 0 0 15px ${config.accent}30;
          display: flex;
          align-items: center;
          gap: 6px;
        ">
          <span style="color: ${
            config.accent
          }">🔥</span> Серия дней: <span style="font-weight: 900; font-size: 15px;">${
      count.max
    }</span>
        </div>
      </div>
  
      <!-- TOP GRID -->
      <div style="
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-bottom: 40px;
      ">
        <!-- QURAN -->
        <div style="
          background: ${config.cardBg};
          border: 1px solid ${config.cardBorder};
          border-radius: 24px;
          padding: 26px;
          position: relative;
          box-shadow: inset 0 0 20px rgba(255,255,255,0.01), 0 4px 20px rgba(0, 0, 0, 0.2);
        ">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="color: ${
              config.textSecondary
            }; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
              Мин. Корана
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${
              config.accent
            }" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          </div>
          <div style="font-size: 46px; font-weight: 900; margin-top: 20px; letter-spacing: -0.03em; color: #ffffff; line-height: 1;">
            ${Quran}
          </div>
        </div>
  
        <!-- TOTAL HABITS -->
        <div style="
          background: ${config.cardBg};
          border: 1px solid ${config.cardBorder};
          border-radius: 24px;
          padding: 26px;
          box-shadow: inset 0 0 20px rgba(255,255,255,0.01), 0 12px 30px ${
            config.accent
          }15;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="color: ${
              config.textSecondary
            }; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
              Привычки
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${
              config.accent
            }" stroke-width="2.2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
          </div>
          <div style="font-size: 46px; font-weight: 900; margin-top: 20px; letter-spacing: -0.03em; line-height: 1; color: ${
            config.accent
          }; text-shadow: 0 0 20px ${config.accent}40;">
            ${habitAnalytics.length}
          </div>
        </div>
      </div>
  
      <!-- HABITS LIST -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${habitAnalytics
          .map(
            (h) => `
          <div style="
            background: ${config.cardBg};
            border: 1px solid ${config.cardBorder};
            border-radius: 20px;
            padding: 24px;
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
              <div>
                <div style="font-size: 19px; font-weight: 700; color: #ffffff;">${h.name}</div>
                <div style="font-size: 13px; color: ${config.textSecondary}; margin-top: 4px;">
                  Выполнено: <span style="color: #ffffff; font-weight: 600;">${h.completedTasks}</span> из ${h.totalTasks}
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 28px; font-weight: 900; color: ${config.accent}; text-shadow: 0 0 15px ${config.accent}25;">
                  ${h.consistency}%
                </div>
              </div>
            </div>
            <!-- PROGRESS BAR -->
            <div style="height: 10px; background: rgba(255, 255, 255, 0.04); border-radius: 999px; overflow: hidden;">
              <div style="width: ${h.consistency}%; height: 100%; background: linear-gradient(90deg, ${config.accent}, #ffffff 200%); border-radius: 999px; box-shadow: 0 0 10px ${config.accent}40;"></div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

    document.body.appendChild(container);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const dataUrl = await toPng(container, {
      backgroundColor: config.bg,
      pixelRatio: 3,
      cacheBust: true,
    });

    document.body.removeChild(container);

    const link = document.createElement("a");
    link.download = `atomic-stats-${period}.png`;
    link.href = dataUrl;
    link.click();
  };

  // 🧩 CARDS
  const cards =
    period === "day"
      ? [
          {
            title: "Мин. Корана",
            value: tracker.yearlyData[todayKey]?.Quran || 0,
            icon: BookOpen,
            color: isDark ? "text-amber-400" : "text-emerald-400",
            desc: "читай",
          },
          {
            title: "Серия дней",
            value: count.max,
            icon: Trophy,
            color: isDark ? "text-green-400" : "text-emerald-300",
            desc: "не разрывай цепь",
          },
        ]
      : [
          {
            title: "Мин. Корана",
            value: Quran,
            icon: BookOpen,
            color: "text-orange-400",
            desc: "читай",
          },
          {
            title: "Серия дней",
            value: count.max,
            icon: Trophy,
            color: isDark ? "text-zinc-200" : "text-emerald-200",
            desc: "не разрывай цепь",
          },
        ];

  return (
    <div className="flex flex-col gap-4">
      {/* TOP BAR */}
      <div className="flex items-center justify-between gap-3">
        {/* FILTERS */}
        <div className="flex gap-2 flex-wrap">
          {periods.map((item) => (
            <button
              key={item.key}
              onClick={() => setPeriod(item.key as Period)}
              className={cn(
                "px-2 py-1 rounded-2xl border text-[13px] transition-all whitespace-nowrap",
                period === item.key
                  ? accent
                  : `${card} ${muted} hover:scale-[1.02]`
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* EXPORT */}
        <button
          onClick={exportStatsAsPNG}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all hover:scale-[1.03]",
            card,
            titleText
          )}
        >
          <Download size={16} />
        </button>
      </div>

      {/* EXPORTABLE */}
      <div ref={cardRef} className="flex flex-col gap-4">
        {/* STATS */}
        <Cards
          card={card}
          accentSoft={accentSoft}
          titleText={titleText}
          cards={cards}
          muted={muted}
          muted2={muted2}
          exportConfig={exportConfig}
        />

        {/* HABITS */}
        <Habits
          isDark={theme}
          todayKey={todayKey}
          filteredDays={filteredDays}
          tracker={tracker}
          period={period}
          card={card}
          accentSoft={accentSoft}
          titleText={titleText}
          cardSecondary={cardSecondary}
          muted={muted}
          muted2={muted2}
          exportConfig={exportConfig}
          habitAnalytics={habitAnalytics}
        />

        {/* SUMMARY */}
        <Summary
          isDark={theme}
          filteredDays={filteredDays}
          tracker={tracker}
          period={period}
          todayKey={todayKey}
          card={card}
          accentSoft={accentSoft}
          titleText={titleText}
          cardSecondary={cardSecondary}
          muted={muted}
          muted2={muted2}
          exportConfig={exportConfig}
        />
      </div>
    </div>
  );
}
