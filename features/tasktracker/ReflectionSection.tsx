"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, CheckCircle } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import confetti from "canvas-confetti";
import { finishDay } from "./hooks/trackerSlice";

interface ReflectionProps {
  activeDay: number;
  currentMonth: number;
  year: number;
}

const ReflectionSection: React.FC<ReflectionProps> = ({
  activeDay,
  currentMonth,
  year,
}) => {
  const [text, setText] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const month = String(currentMonth + 1).padStart(2, "0");
  const day = String(activeDay).padStart(2, "0");

  const dayKey = `${year}-${month}-${day}`;

  useEffect(() => {
    const saved = localStorage.getItem(dayKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setText(parsed.reflection || "");
        setIsCompleted(parsed.isFinished || false);
      } catch (e) {
        console.error("Ошибка загрузки данных дня", e);
      }
    } else {
      setText("");
      setIsCompleted(false);
    }
  }, [dayKey]);

  const handleFinishDay = () => {
    // 1. Проверка на пустой текст
    if (text.trim().length === 0) return;

    dispatch(
      finishDay({
        dayKey,
      })
    );

    // 4. Сохраняем текст мысли локально для этого дня
    // const localData = { reflection: text, isFinished: true };
    // localStorage.setItem(dayKey, JSON.stringify(localData));

    setIsCompleted(true);

    // 5. КЛАССНЫЙ ЭФФЕКТ: Салют
    // Используем zIndex, чтобы конфетти были поверх всех слоев
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f4a01c", "#ffffff", "#10b981"],
      zIndex: 9999,
    });
  };

  return (
    <div
      className={`bg-[#0f0f0f] border rounded-[2.5rem] p-8 space-y-5 shadow-2xl transition-all duration-700 ${
        isCompleted
          ? "border-emerald-500/40 shadow-emerald-900/10"
          : "border-[#1a1a1a]"
      }`}
    >
      {/* Заголовок секции */}
      <div className="flex items-center gap-3 text-[#f4a01c]">
        <MessageSquare size={18} strokeWidth={2.5} />
        <h3 className="text-[10px] uppercase font-black tracking-[0.2em]">
          Что я понял сегодня?
        </h3>
      </div>

      {/* Поле ввода мыслей */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCompleted}
          placeholder="Напишите ваши размышления..."
          className={`w-full bg-black border rounded-[1.5rem] p-6 text-sm h-40 resize-none outline-none transition-all
            ${
              isCompleted
                ? "border-transparent text-gray-500"
                : "border-[#1a1a1a] focus:border-[#f4a01c] text-gray-200"
            }
            placeholder:text-gray-800 leading-relaxed font-medium`}
        />

        {/* Индикатор завершения */}
        {isCompleted && (
          <div className="absolute top-4 right-4 text-emerald-500 animate-bounce">
            <CheckCircle size={20} fill="currentColor" className="text-black" />
          </div>
        )}
      </div>

      {/* Кнопка действия */}
      {!isCompleted ? (
        <button
          onClick={handleFinishDay}
          className="w-full bg-[#f4a01c] cursor-pointer text-black font-black py-4.5 rounded-2xl flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest active:scale-95 transition-all shadow-lg shadow-[#f4a01c]/10"
        >
          Завершить день
        </button>
      ) : (
        <div className="text-center py-2">
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 animate-pulse font-bold">
            День зафиксирован ✨
          </span>
        </div>
      )}
    </div>
  );
};

export default ReflectionSection;
