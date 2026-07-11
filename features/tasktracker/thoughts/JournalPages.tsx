"use client";

import { forwardRef } from "react";
import { CalendarDays, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const BasePage = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-full h-full p-6 sm:p-10 flex flex-col justify-between overflow-y-auto select-none shadow-[inset_0_0_40px_rgba(0,0,0,0.3)] border border-black/10",
      className
    )}
  >
    {children}
  </div>
));
BasePage.displayName = "BasePage";

// ЛЕВАЯ СТРАНИЦА: Дневниковая запись
export const JournalLeftPage = forwardRef<HTMLDivElement, any>(
  ({ item, theme, muted, accent, currentPage, reflections }, ref) => {
    const formatDate = (d: string) =>
      new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(d));

    const pageStyle = theme
      ? "bg-[#1f1d1a] text-stone-200 rounded-l-[16px] md:pr-12"
      : "bg-[#091612] text-emerald-100/90 rounded-l-[16px] md:pr-12";

    const dotColor =
      accent === "emerald"
        ? "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
        : "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]";

    return (
      <BasePage ref={ref} className={pageStyle}>
        <div className="space-y-5 h-full flex flex-col justify-start">
          {/* Заголовок страницы */}
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
            <div
              className={cn(
                "flex items-center gap-2 font-sans text-xs tracking-wider",
                muted
              )}
            >
              <CalendarDays size={13} className="opacity-60" />
              <span className="font-medium opacity-80">
                {formatDate(item.date)}
              </span>
            </div>
            <div className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
          </div>

          {/* Текст заметки с экзотическим стилем манускрипта */}
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar relative">
            {/* Тонкие архивные строки древней бумаги на фоне */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(transparent,transparent_27px,rgba(255,255,255,0.5)_27px,rgba(255,255,255,0.5)_28px)]" />

            <p
              className={cn(
                "text-sm sm:text-base tracking-wide text-white/80 whitespace-pre-wrap font-serif relative z-10",
                "leading-[28px]", // Текст ложится точно на фоновые строки
                // Элегантная каллиграфическая буквица
                theme
                  ? "first-letter:text-amber-500 first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:drop-shadow-[0_2px_4px_rgba(217,119,6,0.3)]"
                  : "first-letter:text-emerald-400 first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:drop-shadow-[0_2px_4px_rgba(52,211,153,0.3)]"
              )}
            >
              {item.reflection}
            </p>
          </div>
          <div className="flex justify-center">
            <span
              className={cn(
                "text-xs font-sans tracking-wide opacity-50 flex items-center gap-1.5",
                muted
              )}
            >
              {currentPage !== 0 && (
                <>
                  <span className="opacity-40">۞</span>
                  <span>
                    Страница {currentPage} / {reflections.length * 2}
                  </span>
                  <span className="opacity-40">۞</span>
                </>
              )}
            </span>
          </div>
        </div>
      </BasePage>
    );
  }
);
JournalLeftPage.displayName = "JournalLeftPage";

// ПРАВАЯ СТРАНИЦА: Таблица показателей и Привычки
export const JournalRightPage = forwardRef<HTMLDivElement, any>(
  ({ item, habits, theme, muted, accent, currentPage, reflections }, ref) => {
    const dayHabits = habits.filter(
      (habit: any) => habit.progress?.[item.date]
    );

    const pageStyle = theme
      ? "bg-[#1f1d1a] text-stone-200 rounded-r-[16px] md:pl-12 border-l border-white/[0.02]"
      : "bg-[#091612] text-emerald-100/90 rounded-r-[16px] md:pl-12 border-l border-white/[0.01]";

    const gridBlock =
      "bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5 text-center shadow-[sm] transition-all hover:bg-white/[0.04]";

    return (
      <BasePage ref={ref} className={pageStyle}>
        <div className="space-y-6 h-full flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-white/[0.04] pb-3">
              <h3
                className={cn(
                  "text-xs font-sans font-semibold uppercase tracking-widest flex items-center gap-1.5",
                  muted
                )}
              >
                <span className="opacity-30">۞</span>
                Метрики дня
              </h3>
            </div>

            {/* Изящная сетка параметров */}
            <div className="grid grid-cols-2 gap-3 font-sans">
              <div className={gridBlock}>
                <div className="text-xl font-bold tracking-tight text-white/90">
                  {item.day?.Quran || 0}
                </div>
                <div className="text-[11px] opacity-40 mt-1 uppercase tracking-wider">
                  Коран (стр)
                </div>
              </div>
              <div className={gridBlock}>
                <div className="text-xl font-bold tracking-tight text-white/90">
                  {
                    Object.values(item.day?.prayers || {}).filter(Boolean)
                      .length
                  }{" "}
                  / 5
                </div>
                <div className="text-[11px] opacity-40 mt-1 uppercase tracking-wider">
                  Намазы
                </div>
              </div>
              <div className={gridBlock}>
                <div className="text-xl font-bold tracking-tight text-white/90">
                  {
                    (item.day?.todos || []).filter((t: any) => t.completed)
                      .length
                  }{" "}
                  / {(item.day?.todos || []).length}
                </div>
                <div className="text-[11px] opacity-40 mt-1 uppercase tracking-wider">
                  Задачи
                </div>
              </div>
              <div className={gridBlock}>
                <div
                  className={cn(
                    "text-sm font-semibold tracking-wide",
                    item.day?.isFinished
                      ? "text-emerald-400/90"
                      : "text-amber-500/80"
                  )}
                >
                  {item.day?.isFinished ? "Завершен" : "В процессе"}
                </div>
                <div className="text-[11px] opacity-40 mt-2 uppercase tracking-wider">
                  Статус дня
                </div>
              </div>
            </div>

            {/* Сводка по привычкам */}
            {dayHabits.length > 0 && (
              <div className="border-t border-white/[0.04] pt-4 font-sans">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                  <span className="opacity-20">۞</span>
                  Привычки и ритуалы
                </div>
                <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                  {dayHabits.map((habit: any) => {
                    const progress = habit.progress?.[item.date] || {};
                    const completed = Object.values(progress).filter(
                      (p: any) => p.completed
                    ).length;
                    const total = habit.tasks.length;
                    const done = total > 0 && completed === total;

                    return (
                      <div
                        key={habit.id || habit.name}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all",
                          done
                            ? "bg-white/[0.02] border-white/[0.06] text-white/80"
                            : "bg-transparent border-white/[0.02] text-white/40"
                        )}
                      >
                        <span className="truncate max-w-[170px] font-medium">
                          {habit.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono opacity-50">
                            {completed}/{total}
                          </span>
                          {done ? (
                            <CheckCircle2
                              size={12}
                              className={
                                accent === "emerald"
                                  ? "text-emerald-400"
                                  : "text-amber-500"
                              }
                            />
                          ) : (
                            <Circle size={12} className="opacity-20" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </BasePage>
    );
  }
);
JournalRightPage.displayName = "JournalRightPage";
