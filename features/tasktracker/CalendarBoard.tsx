"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { DayEntry, Habit } from "./types/types";

interface CalendarBoardProps {
  currentMonth: number;
  dataState: Record<string, DayEntry>;
  habits: Habit[];
  today: string;
  onDaySelect: (day: number) => void;
  onMonthChange: (month: number) => void;
  isDarkTheme: boolean;
}

const CalendarBoard: React.FC<CalendarBoardProps> = ({
  currentMonth,
  dataState,
  habits,
  today,
  onDaySelect,
  onMonthChange,
  isDarkTheme,
}) => {
  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const currentYear = new Date().getFullYear();
  const month = String(currentMonth + 1).padStart(2, "0");
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calculateProgress = (entry?: DayEntry, date?: string) => {
    let total = 0;
    let done = 0;

    // TODOS
    if (entry?.todos?.length) {
      total += entry.todos.length;
      done += entry.todos.filter((t: any) => t.completed).length;
    }
  
    // QURAN
    total += 1;
    if ((entry?.Quran || 0) > 0) done += 1;

    // REFLECTION
    total += 1;
    if (entry?.reflection?.trim()) done += 1;

    // HABITS
    if (date && habits?.length) {
      habits.forEach((habit: any) => {
        if (!habit.tasks?.length) return;

        habit.tasks.forEach((task: any) => {
          total += 1;

          const progress = habit.progress?.[date]?.[task.id];

          const value = progress?.value || 0;

          const completed =
            task.type === "boolean"
              ? progress?.completed
              : value >= task.target;

          if (completed) {
            done += 1;
          }
        });
      });
    }

    if (!total) return 0;

    return Math.round((done / total) * 100);
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const dateY = `${currentYear}-${month}-${day}`;

    const entry = dataState[dateY];
    const progress = calculateProgress(entry, dateY);

    let asActive = "pen";

    if (dateY in dataState && dataState[dateY].isFinished) {
      asActive = "yes";
    } else if (
      (!(dateY in dataState) && dateY < today) ||
      (dateY in dataState && !dataState[dateY].isFinished && dateY < today)
    ) {
      asActive = "no";
    } else if (dateY === today) {
      asActive = "dow";
    }

    return {
      d: i + 1,
      asActive,
      progress,
    };
  });

  return (
    <div
      className={`${
        isDarkTheme ? "bg-[#1a1a1a]" : "bg-[#0b1f17]"
      } rounded-[2.5rem] p-6 border ${
        isDarkTheme ? "border-[#2d2d2d]" : "border-[#123d2c]"
      } space-y-4 w-full`}
    >
      <div className="flex justify-between items-center px-1 text-[11px] uppercase tracking-[0.2em] font-black text-gray-500">
        <span>Доска {monthNames[currentMonth]}</span>

        <div className="flex gap-2">
          <button
            onClick={() =>
              onMonthChange(currentMonth === 0 ? 11 : currentMonth - 1)
            }
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() =>
              onMonthChange(currentMonth === 11 ? 0 : currentMonth + 1)
            }
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {days.map(({ d, asActive, progress }: any) => {
          const dayColors = {
            dark: {
              dow: "bg-amber-500 text-black",

              yes: "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400",

              no: "bg-red-500/15 border border-red-500/40 text-red-400",

              pen: "bg-[#080808] border border-[#151515] text-[#2a2a2a]",

              low: "bg-orange-500/15 border border-orange-500/40 text-orange-300",

              mid: "bg-yellow-500/15 border border-yellow-500/40 text-yellow-300",

              high: "bg-lime-500/15 border border-lime-500/40 text-lime-300",
            },

            green: {
              dow: "bg-emerald-500 text-black",

              yes: "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400",

              no: "bg-red-500/15 border border-red-500/40 text-red-400",

              pen: "bg-[#0a1a12] border border-[#1a2a22] text-[#2a3a32]",

              low: "bg-orange-500/15 border border-orange-500/40 text-orange-300",

              mid: "bg-yellow-500/15 border border-yellow-500/40 text-yellow-300",

              high: "bg-lime-500/15 border border-lime-500/40 text-lime-300",
            },
          };

          const currentTheme = isDarkTheme ? "dark" : "green";

          return (
            <button
              key={d}
              onClick={() => onDaySelect(d)}
              className={`aspect-square cursor-pointer flex flex-col items-center justify-center rounded-2xl text-[12px] font-black transition-all duration-300
                ${
                  asActive === "dow"
                    ? `${dayColors[currentTheme].dow} scale-110 shadow-[0_0_15px_rgba(244,160,28,0.3)] z-10`
                    : progress >= 100
                    ? dayColors[currentTheme].yes
                    : progress >= 70
                    ? dayColors[currentTheme].high
                    : progress >= 40
                    ? dayColors[currentTheme].mid
                    : progress > 0
                    ? dayColors[currentTheme].low
                    : asActive === "no"
                    ? `${dayColors[currentTheme].no} shadow-[0_0_12px_rgba(239,68,68,0.25)]`
                    : dayColors[currentTheme].pen
                }`}
            >
              {asActive === "yes" ? (
                <>
                  <Check size={14} strokeWidth={4} />
                  <span className="text-[9px] mt-[2px] opacity-80">
                    {progress}%
                  </span>
                </>
              ) : (
                <>
                  <span>{d}</span>
                  {progress > 0 && (
                    <span className="text-[9px] mt-[2px] opacity-80">
                      {progress}%
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarBoard;
