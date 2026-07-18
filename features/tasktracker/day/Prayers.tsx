"use client";
import React from "react";
import QuoteSection from "./QuoteSection";
import { Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { View } from "../types/types";
import { MetricCard } from "../MetricCard";
import { addPrayer, updateQuranTime } from "@/store/hooks/trackerSlice";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  activeDay: number;
  currentMonth: number;
  year: number;
  setView: React.Dispatch<React.SetStateAction<View>>;
  isDarkTheme: boolean;
}

const defaultPrayers = {
  Фаджр: false,
  Зухр: false,
  Аср: false,
  Магриб: false,
  Иша: false,
};

export const Prayers: React.FC<Props> = ({
  className,
  activeDay,
  currentMonth,
  year,
  setView,
  isDarkTheme,
}) => {
  const dispatch = useAppDispatch();
  const month = String(currentMonth + 1).padStart(2, "0");
  const day = String(activeDay).padStart(2, "0");

  const dayKey = `${year}-${month}-${day}`;

  const yearlyData = useAppSelector(
    (state) => state.tracker.yearlyData[dayKey]
  );

  const prayersData = yearlyData?.prayers ?? defaultPrayers;

  const timerHandler = (minutes: number) => {
    dispatch(updateQuranTime({ dayKey, minutes }));
  };

  const togglePrayer = (name: string) => {
    dispatch(
      addPrayer({
        dayKey,
        prayers: {
          ...prayersData,
          [name]: !prayersData[name],
        },
      })
    );
  };

  const prayerAccentColor = isDarkTheme ? "amber" : "emerald";

  return (
    <div
      className={`${isDarkTheme ? "bg-[#1a1a1a]" : "bg-[#0b1f17]"} border ${
        isDarkTheme ? "border-[#2d2d2d]" : "border-[#123d2c]"
      } rounded-[2.5rem] p-6 space-y-4`}
    >
      <QuoteSection
        dayNumber={activeDay}
        setView={setView}
        isDarkTheme={isDarkTheme}
      />

      {/* <h3
        className={`text-[10px] uppercase font-black tracking-widest ${
          isDarkTheme ? "text-amber-400" : "text-emerald-400"
        }`}
      >
        Азкары
      </h3> */}

      {/* <div className="flex divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10">
        <button className="flex flex-1 items-center justify-between p-5 hover:bg-white/5 transition">
          <span className="font-medium text-white">Утренние азкары</span>
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              isDarkTheme ? "bg-amber-400" : "bg-emerald-400"
            )}
          />
        </button>

        <button className="flex flex-1 items-center justify-between p-5 hover:bg-white/5 transition">
          <span className="font-medium text-white">Вечерние азкары</span>
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              isDarkTheme ? "bg-amber-400" : "bg-emerald-400"
            )}
          />
        </button>
      </div> */}
      <div style={{ maxWidth: 500 }}>
        <MetricCard
          title="Коран (минуты)"
          value={yearlyData?.Quran || 0}
          min={0}
          max={180}
          step={5}
          onChange={timerHandler}
          isDarkTheme={isDarkTheme}
        />
      </div>
    </div>
  );
};
