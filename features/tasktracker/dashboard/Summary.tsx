import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DayEntry, TrackerState } from "../types/types";
import { BookOpen } from "lucide-react";
import { ExportBlockKey, Period } from "../types/dashboard.type";

interface Props {
  className?: string;
  isDark: boolean;
  filteredDays: [string, DayEntry][];
  tracker: TrackerState;
  period: Period;
  todayKey: string;
  card: string;
  accentSoft: string;
  titleText: string;
  cardSecondary: string;
  muted: string;
  muted2: string;
  exportConfig: Record<ExportBlockKey, boolean>;
}

export const Summary: React.FC<Props> = ({
  className,
  isDark,
  filteredDays,
  tracker,
  period,
  todayKey,
  card,
  accentSoft,
  titleText,
  cardSecondary,
  muted,
  muted2,
  exportConfig,
}) => {
  // 📊 ANALYTICS
  const analytics = useMemo(() => {
    const habits = tracker.habits || [];

    let activeDays = 0;
    let finishedDays = 0;
    let totalHabitCompletions = 0;
    let todayHabitDone = 0;
    let bestHabitStreak = 0;

    for (const [, entry] of filteredDays) {
      if (entry.isFinished) {
        finishedDays++;
        activeDays++;
      }
    }

    for (const habit of habits) {
      const progress = habit.progress || {};

      const filteredCompletions = Object.keys(progress).filter((date) => {
        const dayProgress = progress[date];

        if (!dayProgress) return false;

        const d = new Date(date);
        const now = new Date();

        if (period === "day") {
          return date === todayKey;
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

      totalHabitCompletions += filteredCompletions.length;

      if (progress[todayKey]) {
        todayHabitDone++;
      }

      bestHabitStreak = Math.max(bestHabitStreak, habit.streak || 0);
    }

    const completionRate =
      habits.length === 0
        ? 0
        : Math.round((todayHabitDone / habits.length) * 100);

    const getPeriodDays = () => {
      const now = new Date();

      switch (period) {
        case "day":
          return 1;

        case "month":
          return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        case "halfyear": {
          const sixMonthsAgo = new Date(now);

          sixMonthsAgo.setMonth(now.getMonth() - 6);

          return Math.ceil(
            (now.getTime() - sixMonthsAgo.getTime()) / (1000 * 60 * 60 * 24)
          );
        }

        case "year":
          return new Date(now.getFullYear(), 1, 29).getMonth() === 1
            ? 366
            : 365;

        case "all":
          return filteredDays.length || 1;

        default:
          return 1;
      }
    };

    const consistency = Math.round((activeDays / getPeriodDays()) * 100);

    return {
      totalDays: filteredDays.length,
      activeDays,
      finishedDays,
      totalHabitCompletions,
      todayHabitDone,
      bestHabitStreak,
      completionRate,
      consistency,
    };
  }, [tracker, filteredDays, period]);
  return (
    <>
      {exportConfig.summary && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className={cn(
            "rounded-[32px] border p-5 overflow-hidden relative",
            card
          )}
        >
          <div
            className={cn(
              "absolute bottom-0 left-0 h-[2px]",
              isDark ? "bg-amber-500" : "bg-emerald-400"
            )}
            style={{
              width: `${analytics.consistency}%`,
            }}
          />

          <div className="flex items-center gap-2 mb-4">
            <div
              className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center",
                accentSoft
              )}
            >
              <BookOpen
                size={18}
                className={isDark ? "text-amber-400" : "text-emerald-400"}
              />
            </div>

            <div>
              <h3 className={cn("font-semibold", titleText)}>Сводка системы</h3>

              <p className={cn("text-[11px]", muted2)}>
                Повторение формирует идентичность
              </p>
            </div>
          </div>

          <div className={cn("grid grid-cols-2 gap-3 text-xs", muted)}>
            <div>📅 Всего дней: {analytics.totalDays}</div>

            <div>🔥 Активных: {analytics.activeDays}</div>

            <div>✅ Завершённых: {analytics.finishedDays}</div>

            <div>📊 Выполнений: {analytics.totalHabitCompletions}</div>
          </div>

          <div
            className={cn(
              "mt-5 rounded-2xl border p-4",
              cardSecondary,
              isDark ? "border-zinc-800" : "border-emerald-900/40"
            )}
          >
            <div className={cn("text-xs", muted)}>
              Сегодняшние действия — это голос за человека, которым ты
              становишься.
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};
