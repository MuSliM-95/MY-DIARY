"use client";

import { useAppSelector } from "@/store/hooks";
import { BookOpen, CheckCircle2, Download } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { cn } from "@/lib/utils";
import { ExportBlockKey, Period } from "../types/dashboard.type";
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

export default function TrackerDashboard({ theme, todayKey }: Props) {
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

  const prayers = filteredDays.reduce((acc, el) => {
    acc += Object.values(el[1].prayers).filter((i) => i).length;
    return acc;
  }, 0);
  const Quran = filteredDays.reduce((acc, el) => (acc += el[1].Quran), 0);

  const exportStatsAsPNG = async () => {
    // Две ваши реальные темы с картинок:
    // isDark === true (Зелёная тема)
    // isDark === false (Оранжево-угольная тема)
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
          align-items: flex-end; 
          margin-bottom: 36px;
          border-bottom: 1px solid ${config.cardBorder};
          padding-bottom: 24px;
        ">
          <div>
            <div style="font-size: 32px; font-weight: 800; letter-spacing: -0.03em; color: ${
              config.textPrimary
            };">
            YOUR DIARY
            </div>
            <div style="margin-top: 6px; font-size: 14px; color: ${
              config.textSecondary
            }; font-weight: 500;">
              Статистика за период: <span style="color: #ffffff; font-weight: 600; text-shadow: 0 0 10px ${
                config.accent
              }40;">${periodsData[period]}</span>
            </div>
          </div>
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${
            config.textSecondary
          }; background: rgba(255,255,255,0.03); padding: 4px 10px; border-radius: 6px; border: 1px solid ${
      config.cardBorder
    };">
            Atomic System
          </div>
        </div>
  
        <!-- TOP GRID -->
        <div style="
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 36px;
        ">
          <!-- QURAN -->
          <div style="
            background: ${config.cardBg};
            border: 1px solid ${config.cardBorder};
            border-radius: 20px;
            padding: 22px;
            position: relative;
            overflow: hidden;
          ">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="color: ${
                config.textSecondary
              }; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em;">
                Мин. Корана
              </div>
              <!-- Иконка книги -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${
                config.accent
              }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.85;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </div>
            <div style="font-size: 36px; font-weight: 800; margin-top: 14px; letter-spacing: -0.02em; color: #ffffff;">
              ${Quran}
            </div>
            <div style="font-size: 11px; color: ${
              config.textSecondary
            }; margin-top: 8px; display: flex; align-items: center; gap: 4px;">
              <span style="display: inline-block; width: 4px; height: 4px; background: ${
                config.accent
              }; border-radius: 50%;"></span> не разрывай цепь
            </div>
          </div>
  
          <!-- PRAYERS -->
          <div style="
            background: ${config.cardBg};
            border: 1px solid ${config.cardBorder};
            border-radius: 20px;
            padding: 22px;
            position: relative;
            overflow: hidden;
          ">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="color: ${
                config.textSecondary
              }; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em;">
                Молитвы
              </div>
              <!-- Иконка часов -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${
                config.accent
              }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.85;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div style="font-size: 36px; font-weight: 800; margin-top: 14px; letter-spacing: -0.02em; color: #ffffff;">
              ${prayers}
            </div>
            <div style="font-size: 11px; color: ${
              config.textSecondary
            }; margin-top: 8px; display: flex; align-items: center; gap: 4px;">
              <span style="display: inline-block; width: 4px; height: 4px; background: ${
                config.accent
              }; border-radius: 50%;"></span> повторение > мотивация
            </div>
          </div>
  
          <!-- TOTAL HABITS -->
          <div style="
            background: ${config.streakBg};
            border: 1px solid ${config.cardBorder};
            border-radius: 20px;
            padding: 22px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 10px 30px ${config.accent}12;
            position: relative;
          ">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="color: ${
                config.textSecondary
              }; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em;">
                Привычки
              </div>
              <!-- Иконка огонька -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${
                config.accent
              }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
            </div>
            <div style="margin-top: 14px;">
              <div style="font-size: 40px; font-weight: 900; letter-spacing: -0.02em; line-height: 1; color: ${
                config.accent
              }; text-shadow: 0 0 15px ${config.accent}50;">
                ${habitAnalytics.length}
              </div>
              <div style="font-size: 11px; color: ${
                config.textSecondary
              }; margin-top: 8px; font-weight: 500;">
                всего целей в работе
              </div>
            </div>
          </div>
        </div>
  
        <!-- SECTION TITLE -->
        <div style="
          font-size: 14px;
          font-weight: 700;
          color: ${config.textSecondary};
          margin-bottom: 18px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          Прогресс привычек <span style="flex: 1; height: 1px; background: ${
            config.cardBorder
          };"></span>
        </div>
  
        <!-- HABITS LIST -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${habitAnalytics
            .map(
              (h) => `
            <div style="
              background: ${config.cardBg};
              border: 1px solid ${config.cardBorder};
              border-radius: 18px;
              padding: 22px;
              transition: all 0.2s ease;
            ">
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
              ">
                <div>
                  <div style="font-size: 17px; font-weight: 700; letter-spacing: -0.01em; color: #ffffff;">
                    ${h.name}
                  </div>
                  <!-- Теги-точки выполнения в стиле Github-коммитов -->
                  <div style="font-size: 12px; color: ${
                    config.textSecondary
                  }; margin-top: 6px; display: flex; align-items: center; gap: 6px;">
                    <span>Выполнено: <b>${h.completedTasks}</b> из ${
                h.totalTasks
              }</span>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 24px; font-weight: 900; color: ${
                    config.accent
                  }; letter-spacing: -0.02em; text-shadow: 0 0 10px ${
                config.accent
              }30;">
                    ${h.consistency}%
                  </div>
                  <div style="font-size: 10px; color: ${
                    config.textSecondary
                  }; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">
                    Стабильность
                  </div>
                </div>
              </div>
  
              <!-- PROGRESS BAR -->
              <div style="
                height: 8px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.02);
                border-radius: 999px;
                overflow: hidden;
                position: relative;
              ">
                <div style="
                  width: ${h.consistency}%;
                  height: 100%;
                  background: ${config.accent};
                  border-radius: 999px;
                  box-shadow: 0 0 12px ${config.accent};
                "></div>
              </div>
              <div style="
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              margin-top: 10px;
            ">
              ${h.tasks
                .map(
                  (el) => `
                <div style="
                  display: inline-flex;
                  align-items: center;
                  background: rgba(255, 255, 255, 0.03);
                  border: 1px solid ${config.cardBorder};
                  border-radius: 8px;
                  padding: 4px 10px;
                  font-size: 12px;
                  font-weight: 600;
                  color: ${config.textPrimary};
                  letter-spacing: -0.01em;
                ">
                  <!-- Маленькая точка-индикатор слева от названия -->
                  <span style="
                    width: 5px; 
                    height: 5px; 
                    background: ${config.accent}; 
                    border-radius: 50%; 
                    margin-right: 6px;
                    box-shadow: 0 0 6px ${config.accent};
                  "></span>
                  
                  ${el.name}
                </div>
              `
                )
                .join("")}
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
            title: "Читать",
            value: tracker.yearlyData[todayKey]?.Quran || 0,
            icon: BookOpen,
            color: isDark ? "text-amber-400" : "text-emerald-400",
            desc: "читали Коран",
          },
          {
            title: "Молитвы",
            value: prayers,
            icon: CheckCircle2,
            color: isDark ? "text-green-400" : "text-emerald-300",
            desc: "совершено молитв",
          },
        ]
      : [
          {
            title: "Мин. Корана",
            value: Quran,
            icon: BookOpen,
            color: "text-orange-400",
            desc: "не разрывай цепь",
          },
          {
            title: "Молитвы",
            value: prayers,
            icon: CheckCircle2,
            color: isDark ? "text-zinc-200" : "text-emerald-200",
            desc: "повторение > мотивация",
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
