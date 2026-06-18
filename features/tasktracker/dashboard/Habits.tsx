import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ExportBlockKey, HabitProgress, Period } from "../types/dashboard.type";
import { DayEntry, HabitTask, TrackerState } from "../types/types";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface IHabitAnalytics {
  completedTasks: number;
  totalTasks: number;
  consistency: number;
  id: string;
  name: string;
  streak: number;
  createdAt: string;
  category: "spiritual" | "health" | "learning" | "productivity";
  timeOfDay: string;
  tasks: HabitTask[];
  progress?: Record<string, Record<string, HabitProgress>>;
}

interface Props {
  className?: string;
  todayKey: string;
  isDark: boolean;
  filteredDays: [string, DayEntry][];
  tracker: TrackerState;
  period: Period;
  card: string;
  accentSoft: string;
  titleText: string;
  cardSecondary: string;
  muted: string;
  muted2: string;
  exportConfig: Record<ExportBlockKey, boolean>;
  habitAnalytics: IHabitAnalytics[]
}

export const Habits: React.FC<Props> = ({
  className,
  todayKey,
  isDark,
  filteredDays,
  tracker,
  period,
  card,
  accentSoft,
  titleText,
  cardSecondary,
  muted,
  muted2,
  exportConfig,
  habitAnalytics
}) => {

  return (
    <>
      {exportConfig.habits && (
        <div className="flex flex-col gap-3">
          {habitAnalytics.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              className={cn(
                "rounded-[28px] border p-4 overflow-hidden relative",
                card
              )}
            >
              {/* glow */}
              <div
                className={cn(
                  "absolute top-0 right-0 w-28 h-28 blur-3xl opacity-10 rounded-full",
                  isDark ? "bg-amber-400" : "bg-emerald-400"
                )}
              />

              <div className="relative z-10">
                {/* top */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className={cn("font-semibold text-base", titleText)}>
                      {habit.name}
                    </h3>

                    <div
                      className={cn(
                        "flex items-center gap-2 mt-2 text-[11px] flex-wrap",
                        muted
                      )}
                    >
                      <span>🧠 {habit.category}</span>

                      <span>☀️ {habit.timeOfDay || "anytime"}</span>
                    </div>
                  </div>

                  <div
                    className={cn("px-3 py-2 rounded-2xl border", accentSoft)}
                  >
                    <div className={cn("text-lg font-bold", titleText)}>
                      🔥 {habit.streak}
                    </div>

                    <div className={cn("text-[10px]", muted2)}>streak</div>
                  </div>
                </div>

                {/* stats */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className={cn("rounded-2xl p-3", cardSecondary)}>
                    <div className={cn("text-[10px]", muted2)}>Выполнено</div>

                    <div className={cn("text-xl font-bold mt-1", titleText)}>
                      {habit.completedTasks}
                    </div>
                  </div>

                  <div className={cn("rounded-2xl p-3", cardSecondary)}>
                    <div className={cn("text-[10px]", muted2)}>
                      Консистентность
                    </div>

                    <div className={cn("text-xl font-bold mt-1", titleText)}>
                      {habit.consistency}%
                    </div>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-[11px]", muted)}>
                      Прогресс привычки
                    </span>

                    <span
                      className={cn("text-[11px] font-semibold", titleText)}
                    >
                      {habit.consistency}%
                    </span>
                  </div>

                  <div
                    className={cn(
                      "h-3 rounded-full overflow-hidden",
                      cardSecondary
                    )}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${habit.consistency}%` }}
                      transition={{ duration: 0.7 }}
                      className={cn(
                        "h-full rounded-full",
                        isDark
                          ? "bg-gradient-to-r from-amber-500 to-orange-400"
                          : "bg-gradient-to-r from-emerald-400 to-emerald-300"
                      )}
                    />
                  </div>
                </div>

                {/* EXTRA STATS */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  {habit.tasks?.map((task: any, index: number) => {
                    const progress = habit.progress?.[todayKey]?.[task.id];

                    let percent = 0;

                    if (task.type === "boolean") {
                      percent = progress?.completed ? 100 : 0;
                    } else {
                      percent = Math.min(
                        100,
                        Math.round(((progress?.value || 0) / task.target) * 100)
                      );
                    }

                    const color =
                      percent >= 100
                        ? isDark
                          ? "text-emerald-400"
                          : "text-emerald-500"
                        : percent >= 60
                        ? isDark
                          ? "text-amber-400"
                          : "text-yellow-500"
                        : percent > 0
                        ? "text-orange-400"
                        : "text-zinc-600";

                    const circumference = 2 * Math.PI * 22;
                    const offset =
                      circumference - (percent / 100) * circumference;

                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.08 }}
                        className={cn("rounded-3xl p-4 border", cardSecondary)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14">
                            <svg width="56" height="56" className="-rotate-90">
                              <circle
                                cx="28"
                                cy="28"
                                r="22"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                className="text-white/10"
                              />

                              <motion.circle
                                cx="28"
                                cy="28"
                                r="22"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                className={color}
                                strokeDasharray={circumference}
                                initial={{
                                  strokeDashoffset: circumference,
                                }}
                                animate={{
                                  strokeDashoffset: offset,
                                }}
                                transition={{
                                  duration: 1,
                                  delay: index * 0.1,
                                }}
                              />
                            </svg>

                            <div className="absolute inset-0 flex items-center justify-center">
                              <span
                                className={cn(
                                  "text-[11px] font-bold",
                                  titleText
                                )}
                              >
                                {percent}%
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div
                              className={cn(
                                "font-semibold text-sm truncate",
                                titleText
                              )}
                            >
                              {task.title}
                            </div>

                            <div className={cn("text-[11px] mt-1", muted2)}>
                              {task.type === "boolean" ? (
                                <CircleCheck
                                  className={
                                    progress?.value ? "text-amber-400" : ""
                                  }
                                />
                              ) : (
                                `${progress?.value || 0} / ${task.target}`
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};
