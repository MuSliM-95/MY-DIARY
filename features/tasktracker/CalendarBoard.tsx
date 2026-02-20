"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { DayEntry } from "./types/types";

interface CalendarBoardProps {
  activeDay: number;
  currentMonth: number;
  dataState: Record<string, DayEntry>;
  dayKey: string;
  onDaySelect: (day: number) => void;
  onMonthChange: (month: number) => void;
}

const CalendarBoard: React.FC<CalendarBoardProps> = ({
  activeDay,
  currentMonth,
  dataState,
  dayKey,
  onDaySelect,
  onMonthChange,
}) => {
  // ОБЯЗАТЕЛЬНО: Проверь путь в сторе (state.tracker или state.todo и т.д.)

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
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const dateY = `${currentYear}-${month}-${day}`;
    let asActive = "pen";
    if (dateY in dataState && dataState[dateY].isFinished) {
      asActive = "yes";
    } else if (!(dateY in dataState) && dateY < dayKey) {
      asActive = "no";
    } else if (!(dateY in dataState) && dateY === dayKey) {
      asActive = "dow";
    }
    console.log(dateY < dayKey);

    return { d: i + 1, asActive };
  });

  console.log(days);

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center px-1 text-[11px] uppercase tracking-[0.2em] font-black text-gray-500">
        <span>Доска {monthNames[currentMonth]}</span>
        <div className="flex gap-2">
          <button
            onClick={() =>
              onMonthChange(currentMonth === 0 ? 11 : currentMonth - 1)
            }
            className="p-1 hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() =>
              onMonthChange(currentMonth === 11 ? 0 : currentMonth + 1)
            }
            className="p-1 hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {days.map(({ d, asActive }: any) => {
          return (
            <button
              key={d}
              onClick={() => {
                const day = String(d).padStart(2, "0");
                const data = `${currentYear}-${month}-${day}`;
                if (data <= dayKey) {
                  onDaySelect(d);
                }
              }}
              className={`aspect-square cursor-pointer flex items-center justify-center rounded-2xl text-[12px] font-black transition-all duration-300
                ${
                  asActive === "dow"
                    ? "bg-[#f4a01c] text-black scale-110 shadow-[0_0_15px_rgba(244,160,28,0.3)] z-10" // Активный (желтый)
                    : asActive === "yes"
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-500" // Пройденный (зеленый)
                    : asActive === "no"
                    ? "bg-red-500/15 border border-red-500/40 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                    : "bg-[#080808] border border-[#151515] text-[#2a2a2a]" // Обычный
                }`}
            >
              {asActive === "yes" ? <Check size={14} strokeWidth={4} /> : d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarBoard;
