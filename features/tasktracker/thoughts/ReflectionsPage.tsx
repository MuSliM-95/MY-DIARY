"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, BookText } from "lucide-react";
import { useMemo, useState } from "react";

import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

type Props = {
  theme: boolean;
};

export const ReflectionsPage = ({ theme }: Props) => {
  const { yearlyData, habits } = useAppSelector((state) => state.tracker);

  const muted = theme ? "text-zinc-400" : "text-emerald-100/70";

  const card = theme
    ? "bg-[#171717]/95 border-[#2d2d2d]"
    : "bg-[#071a14]/95 border-[#15392c]";

  const accent = !theme ? "emerald" : "amber";

  const pageBg = theme ? "bg-[#0b0c10]" : "bg-[#06130f]";

  const reflections = useMemo(() => {
    return Object.entries(yearlyData || {})
      .filter(([_, day]: any) => day?.reflection?.trim())
      .map(([date, day]: any) => ({
        date,
        reflection: day.reflection,
        day,
      }))
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [yearlyData]);

  const [openDate, setOpenDate] = useState<string | null>(null);

  const toggle = (date: string) => {
    setOpenDate((prev) => (prev === date ? null : date));
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  const accentClasses =
    accent === "emerald"
      ? {
          active: "border-emerald-500/40 bg-emerald-500/10",
          dot: "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]",
          glow: "shadow-[0_0_25px_rgba(16,185,129,0.15)]",
          badge:
            "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
          badgeSoft:
            "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
        }
      : {
          active: "border-amber-500/40 bg-amber-500/10",
          dot: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]",
          glow: "shadow-[0_0_25px_rgba(251,191,36,0.12)]",
          badge: "border-amber-500/30 bg-amber-500/10 text-amber-300",
          badgeSoft:
            "bg-amber-500/15 text-amber-300 border-amber-500/20",
        };

  return (
    <div className={cn("min-h-screen px-4 py-6 text-white", pageBg)}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Мысли & Заметки</h1>

        <p className={cn("mt-2 text-sm", muted)}>
          Все ваши заметки и размышления
        </p>
      </div>

      {reflections.length === 0 && (
        <div className={cn("rounded-3xl border py-24 text-center", card)}>
          <BookText size={44} className="mx-auto text-white/20" />

          <h2 className="mt-4 text-lg font-semibold">
            Пока нет reflections
          </h2>
        </div>
      )}

      <div className="space-y-3">
        {reflections.map((item: any) => {
          const open = openDate === item.date;

          const dayHabits = habits.filter(
            (habit: any) => habit.progress?.[item.date]
          );

          return (
            <div key={item.date} className="overflow-hidden rounded-2xl">
              <button
                onClick={() => toggle(item.date)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition-all",
                  card,
                  open && accentClasses.active,
                  open && accentClasses.glow
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={cn("flex items-center gap-2", muted)}>
                      <CalendarDays
                        size={14}
                        className={cn(
                          theme &&
                            "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                        )}
                      />

                      <span className="text-xs">
                        {formatDate(item.date)}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-1 text-sm text-white/70">
                      {item.reflection}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      open && accentClasses.dot
                    )}
                  />
                </div>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="overflow-hidden"
                  >
                    <div className={cn("mt-2 rounded-2xl border p-4", card)}>
                      <div className="text-sm leading-relaxed text-white/80">
                        {item.reflection}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-white/5 p-3">
                          <div className="text-lg font-bold">
                            {item.day?.Quran || 0}
                          </div>

                          <div className="text-xs opacity-60">Коран</div>
                        </div>

                        <div className="rounded-xl bg-white/5 p-3">
                          <div className="text-lg font-bold">
                            {
                              Object.values(item.day?.prayers || {}).filter(
                                Boolean
                              ).length
                            }
                            /5
                          </div>

                          <div className="text-xs opacity-60">Намазы</div>
                        </div>

                        <div className="rounded-xl bg-white/5 p-3">
                          <div className="text-lg font-bold">
                            {
                              (item.day?.todos || []).filter(
                                (t: any) => t.completed
                              ).length
                            }
                            /{(item.day?.todos || []).length}
                          </div>

                          <div className="text-xs opacity-60">Задачи</div>
                        </div>

                        <div className="rounded-xl bg-white/5 p-3">
                          <div className="text-lg font-bold">
                            {item.day?.isFinished ? "✓" : "✕"}
                          </div>

                          <div className="text-xs opacity-60">Статус</div>
                        </div>
                      </div>

                      {dayHabits.length > 0 && (
                        <div className="mt-5 border-t border-white/10 pt-5">
                          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                            Привычки дня
                          </div>

                          <div className="space-y-3">
                            {dayHabits.map((habit: any) => {
                              const progress =
                                habit.progress?.[item.date] || {};

                              const completed = Object.values(
                                progress
                              ).filter((p: any) => p.completed).length;

                              const total = habit.tasks.length;

                              const done =
                                total > 0 && completed === total;

                              return (
                                <div
                                  key={habit.id}
                                  className={cn(
                                    "rounded-xl border p-3",
                                    done
                                      ? accentClasses.badge
                                      : "border-white/10 bg-white/[0.03]"
                                  )}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      <div className="font-medium">
                                        {habit.name}
                                      </div>

                                      <div className="mt-1 text-xs text-white/50">
                                        {completed}/{total} задач выполнено
                                      </div>
                                    </div>

                                    <div
                                      className={cn(
                                        "rounded-full border px-2.5 py-1 text-xs font-medium",
                                        done
                                          ? accentClasses.badgeSoft
                                          : "border-white/10 bg-white/5 text-white/50"
                                      )}
                                    >
                                      {done
                                        ? "Готово"
                                        : `${completed}/${total}`}
                                    </div>
                                  </div>

                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {habit.tasks.map((task: any) => {
                                      const taskProgress =
                                        progress?.[task.id];

                                      return (
                                        <div
                                          key={task.id}
                                          className={cn(
                                            "rounded-full border px-2.5 py-1 text-xs",
                                            taskProgress?.completed
                                              ? accentClasses.badge
                                              : "border-white/10 bg-white/[0.03] text-white/50"
                                          )}
                                        >
                                          {taskProgress?.completed && "✓ "}
                                          {task.name}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};