"use client";
import React, { useState } from "react";
import QuoteSection from "./QuoteSection";
import { Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addPrayer, updateQuranTime } from "./hooks/trackerSlice";
import { View } from "./types/types";
import { MetricCard } from "./MetricCard";

interface Props {
  className?: string;
  activeDay: number;
  dayKey: string;
  setView: React.Dispatch<React.SetStateAction<View>>;
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
  dayKey,
  setView,
}) => {
  const dispatch = useAppDispatch();

  const yearlyData = useAppSelector(
    (state) => state.tracker.yearlyData[dayKey]
  );

  // всегда гарантирован объект
  const prayersData = yearlyData?.prayers ?? defaultPrayers;
  // const [minutes, setMinutes] = useState(0);

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
  return (
    <div className="bg-[#0a1510] border border-[#14261d] rounded-[2.5rem] p-6 space-y-4">
      <QuoteSection dayNumber={activeDay} setView={setView} />
      <h3 className="text-[10px] uppercase font-black tracking-widest text-[#f4a01c]">
        Обязательные молитвы
      </h3>
      <div className="space-y-2">
        {["Фаджр", "Зухр", "Аср", "Магриб", "Иша"].map((p) => (
          <div
            key={p}
            onClick={() => togglePrayer(p)}
            className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 cursor-pointer active:scale-[0.98] transition-all"
          >
            <span className="text-sm font-bold text-gray-300">{p}</span>
            <div
              className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                prayersData[p]
                  ? "bg-[#f4a01c] border-[#f4a01c]"
                  : "border-[#14261d]"
              }`}
            >
              {prayersData[p] && (
                <Check size={14} className="text-black" strokeWidth={4} />
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 500 }}>
        <MetricCard
          title="Коран (минуты)"
          value={yearlyData?.Quran}
          min={0}
          max={180}
          step={5}
          onChange={timerHandler}
        />
      </div>
    </div>
  );
};
