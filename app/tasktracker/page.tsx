"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  BookOpen,
  Calendar,
  Zap,
  BarChart3,
  User,
  TrendingUp,
} from "lucide-react";

import FinalTodoSection from "@/features/tasktracker/GoalsSection";
import ReflectionSection from "@/features/tasktracker/ReflectionSection";
import CalendarBoard from "@/features/tasktracker/CalendarBoard";
import { Prayers } from "@/features/tasktracker/Prayers";
import { HousePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { View } from "@/features/tasktracker/types/types";
import ProgressPage from "@/features/tasktracker/ProgressCircle";

// --- ТИПЫ ---

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface DayData {
  prayers: { [key: string]: boolean };
  reflection: string;
  tasks: Task[];
}

const PersistenceTracker: React.FC = () => {
  const router = useRouter();
  // Состояния
  const [view, setView] = useState<View>("BOARD");
  const [activeDay, setActiveDay] = useState<number>(1);
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );

  const dataState = useAppSelector((state) => state.tracker.yearlyData);

  // Состояния данных (которые будем хранить)
  const [prayers, setPrays] = useState<{ [key: string]: boolean }>({});
  const [reflection, setReflection] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // 1. Загрузка данных при старте
  const date = new Date();

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const dayKey = `${date.getFullYear()}-${month}-${day}`;

  const savedData = localStorage.getItem(`${dayKey}`);
  useEffect(() => {
    if (savedData) {
      const parsed = JSON.parse(savedData) as DayData;
      setPrays(parsed.prayers || {});
      setReflection(parsed.reflection || "");
      setTasks(parsed.tasks || []);
    } else {
      // Сброс полей, если данных для этого дня нет
      setPrays({});
      setReflection("");
      setTasks([]);
    }
  }, [activeDay, currentMonth]);

  const count = Object.values(dataState).filter(
    (el) => el.isFinished === true
  ).length;

  // 2. Автоматическое сохранение при любых изменениях
  useEffect(() => {
    const dataToSave: DayData = { prayers, reflection, tasks };
    localStorage.setItem(`${dayKey}`, JSON.stringify(dataToSave));
  }, [prayers, reflection, tasks, activeDay, currentMonth]);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center select-none overflow-x-hidden">
      <main className="w-full max-w-md p-5 pb-36 min-h-screen relative">
        <AnimatePresence mode="wait">
          {view === "BOARD" ? (
            <motion.div
              key="board"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-6"
            >
              {/* Хедер Доски */}
              <div className="bg-[#0f0f0f] rounded-[2.5rem] p-8 text-center border border-[#1a1a1a] relative overflow-hidden">
                <div className="absolute top-[-20px] right-[-20px] opacity-5 text-[#f4a01c] -rotate-12">
                  <TrendingUp size={140} />
                </div>
                <p className="text-gray-500 text-[11px] mb-1">
                  Мир вам, Пользователь!
                </p>
                <h1 className="text-2xl font-bold mb-6 tracking-tight">
                  Сегодня{" "}
                  <span className="text-[#f4a01c] font-black">
                    {activeDay} день
                  </span>
                </h1>

                <button
                  onClick={() => setView("DAY_DETAILS")}
                  className="w-full bg-[#f4a01c] text-black font-black py-4.5 rounded-2xl flex items-center justify-center gap-2 uppercase text-sm tracking-widest active:scale-95 transition-all shadow-[0_10px_30px_rgba(244,160,28,0.2)]"
                >
                  Открыть трекер <Zap size={18} fill="currentColor" />
                </button>
              </div>
              {/* Статистика */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={<Trophy className="text-[#f4a01c]" />}
                  val={count.toString()}
                  label="Серия дней"
                />
                <StatCard
                  icon={<BookOpen className="text-emerald-500" />}
                  val="15"
                  label="Мин. Корана"
                />
              </div>
              {/* Календарь */}

              <CalendarBoard
                activeDay={activeDay}
                currentMonth={currentMonth}
                dataState={dataState}
                dayKey={dayKey}
                onDaySelect={(day) => {
                  setActiveDay(day);
                  setView("DAY_DETAILS");
                }}
                onMonthChange={(month) => setCurrentMonth(month)}
              />
            </motion.div>
          ) : view === "PROGRESS" ? (
            <ProgressPage
            //  percent={count}
            />
          ) : (
            /* ЭКРАН ДЕТАЛЕЙ ДНЯ */
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Сетка Молитв */}
              <Prayers
                setView={setView}
                activeDay={activeDay}
                currentMonth={currentMonth}
              />

              {/* Добавление целей */}
              <FinalTodoSection
                activeDay={activeDay}
                currentMonth={currentMonth}
              />

              {/* Рефлексия */}
              <ReflectionSection
                activeDay={activeDay}
                currentMonth={currentMonth}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Навигация */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-[#1a1a1a] py-6 px-10 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <NavItem
            icon={<Calendar size={20} />}
            label="Доска"
            active={view === "BOARD"}
            onClick={() => setView("BOARD")}
          />
          <NavItem
            icon={<Zap size={20} />}
            label="Сегодня"
            active={view === "DAY_DETAILS"}
            onClick={() => setView("DAY_DETAILS")}
          />
          <NavItem
            icon={<HousePlus size={20} />}
            label="Главное"
            active={view === "HOME"}
            onClick={() => router.push("/")}
          />
          <NavItem
            onClick={() => setView("PROGRESS")}
            active={view === "PROGRESS"}
            icon={<BarChart3 size={20} />}
            label="Прогресс"
          />
          <NavItem icon={<User size={20} />} label="Профиль" />
        </div>
      </nav>
    </div>
  );
};

const StatCard = ({
  icon,
  val,
  label,
}: {
  icon: React.ReactNode;
  val: string;
  label: string;
}) => (
  <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-6 rounded-[2.5rem] flex flex-col items-center">
    <div className="mb-1">{icon}</div>
    <span className="text-2xl font-black italic">{val}</span>
    <span className="text-[9px] text-gray-600 uppercase tracking-widest font-black">
      {label}
    </span>
  </div>
);

const NavItem = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col cursor-pointer items-center gap-1.5 transition-all ${
      active ? "text-[#f4a01c] scale-105" : "text-gray-700 hover:text-gray-400"
    }`}
  >
    {icon}
    <span className="text-[9px] uppercase font-black tracking-widest">
      {label}
    </span>
  </button>
);

export default PersistenceTracker;
