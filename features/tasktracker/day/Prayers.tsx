"use client";
import React from "react";
import QuoteSection from "./QuoteSection";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { View } from "../types/types";
import { MetricCard } from "../MetricCard";
import { updateQuranTime } from "@/store/hooks/trackerSlice";


interface Props {
  className?: string;
  activeDay: number;
  currentMonth: number;
  year: number;
  setView: React.Dispatch<React.SetStateAction<View>>;
  isDarkTheme: boolean;
}


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


  const timerHandler = (minutes: number) => {
    dispatch(updateQuranTime({ dayKey, minutes }));
  };


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
