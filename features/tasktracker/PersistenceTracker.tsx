"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Trophy,
  BookOpen,
  Calendar,
  Zap,
  BarChart3,
  CircleUserRound,
  TrendingUp,
  Sun,
  Moon,
  Brain,
} from "lucide-react";

import CalendarBoard from "./CalendarBoard";

import { Prayers } from "./day/Prayers";
import ReflectionSection from "./day/ReflectionSection";

import StatCard from "./StatCard";
import NavItem from "./NavItem";

import { View } from "./types/types";
import { useTrackerData } from "./useTrackerData";
import HabitsSection from "./day/HabitsSection";
import { cn } from "@/lib/utils";
import { ProfileSection } from "./profile/ProfileSection";
import TrackerDashboard from "./dashboard/TrackerDashboard";
import FinalTodoSection from "./day/FinalTodoSection";
import { ReflectionsPage } from "./thoughts/ReflectionsPage";
import { WelcomeSlides } from "./WelcomeSlides ";
import { LegalSection } from "./LegalSection ";
import { useAppSelector } from "@/store/hooks";

const PersistenceTracker: React.FC = () => {
  const onboarding_completed = useAppSelector(
    (state) => state.tracker.onboarding_completed
  );

  const [view, setView] = useState<View>("BOARD");
  const [activeDay, setActiveDay] = useState<number>(1);
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );

  const { theme, setTheme } = useTheme();
  const isDarkTheme = theme === "dark";

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    setShowOnboarding(!onboarding_completed);
  }, [onboarding_completed]);

  const {
    dataState,
    habits,
    today,
    deyDate,
    year,
    count,
    createDay,
    activeDate,
  } = useTrackerData({
    activeDay,
    currentMonth,
    setActiveDay,
    setView,
  });

  return (
    <div
      className={`min-h-screen ${
        isDarkTheme ? "bg-[#0f0f0f]" : "bg-[#06140e]"
      } ${
        isDarkTheme ? "text-[#f5f5f5]" : "text-[#d7ffe8]"
      } font-sans flex flex-col items-center select-none overflow-x-hidden`}
    >
      {/* Кастомный заголовок с кнопкой переключения темы */}
      <div className="w-full max-w-md p-5 flex justify-between items-center">
        <div className="text-xl font-bold">Мои привычки</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(isDarkTheme ? "green" : "dark")}
            className={`p-2.5 rounded-full ${
              isDarkTheme ? "bg-[#1a1a1a]" : "bg-[#0b1f17]"
            } ${
              !isDarkTheme ? "text-amber-400" : "text-emerald-400"
            } transition-all hover:scale-110`}
          >
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setView("PROFILE")}
            className={cn(
              `p-2.5 rounded-full ${
                isDarkTheme ? "bg-[#1a1a1a]" : "bg-[#0b1f17]"
              } ${
                isDarkTheme ? "text-amber-400" : "text-emerald-400"
              }  transition-all hover:scale-110`
            )}
          >
            <CircleUserRound />
          </button>
        </div>
      </div>

      <main className="w-full max-w-md p-5 pb-36 min-h-screen relative">
        {showOnboarding && (
          <WelcomeSlides
            onFinish={() => setShowOnboarding(false)}
            setView={setView}
          />
        )}
        <AnimatePresence mode="wait">
          {view === "BOARD" ? (
            <motion.div
              key="board"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-6"
            >
              {/* Header */}
              <div
                className={`${
                  isDarkTheme ? "bg-[#1a1a1a]" : "bg-[#0b1f17]"
                } rounded-[2.5rem] p-8 text-center border ${
                  isDarkTheme ? "border-[#2d2d2d]" : "border-[#123d2c]"
                } relative overflow-hidden`}
              >
                <div
                  className={`absolute top-[-20px] right-[-20px] opacity-5 ${
                    isDarkTheme ? "text-amber-500/10" : "text-emerald-500/10"
                  } -rotate-12`}
                >
                  <TrendingUp size={140} />
                </div>

                <p
                  className={`${
                    isDarkTheme ? "text-amber-300/60" : "text-emerald-200/60"
                  } text-[11px] mb-1`}
                >
                  Мир вам, Пользователь!
                </p>

                <h1 className="text-2xl font-bold mb-6 tracking-tight">
                  Сегодня{" "}
                  <span
                    className={`${
                      isDarkTheme ? "text-amber-400" : "text-emerald-400"
                    } font-black`}
                  >
                    {deyDate} день
                  </span>
                </h1>

                <button
                  onClick={() => createDay(deyDate)}
                  className={`w-full cursor-pointer ${
                    isDarkTheme
                      ? "bg-amber-600 hover:bg-amber-500"
                      : "bg-emerald-500 hover:bg-emerald-400"
                  } ${
                    isDarkTheme ? "text-white" : "text-black"
                  } font-black py-4.5 rounded-2xl flex items-center justify-center gap-2 uppercase text-sm tracking-widest active:scale-95 transition-all ${
                    isDarkTheme
                      ? "shadow-[0_10px_30px_rgba(245,158,11,0.25)]"
                      : "shadow-[0_10px_30px_rgba(16,185,129,0.35)]"
                  }`}
                >
                  Открыть трекер <Zap size={18} fill="currentColor" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={
                    <Trophy
                      className={
                        isDarkTheme ? "text-amber-400" : "text-emerald-500"
                      }
                    />
                  }
                  val={count.max.toString()}
                  label="Серия дней"
                  isDarkTheme={isDarkTheme}
                />

                <StatCard
                  icon={
                    <BookOpen
                      className={
                        isDarkTheme ? "text-amber-400" : "text-emerald-500"
                      }
                    />
                  }
                  val={count.QuranCount?.toString()}
                  label="Мин. Корана"
                  isDarkTheme={isDarkTheme}
                />
              </div>

              {/* Calendar */}
              <CalendarBoard
                currentMonth={currentMonth}
                dataState={dataState}
                habits={habits}
                today={today}
                onDaySelect={(day) => createDay(day)}
                onMonthChange={(month) => setCurrentMonth(month)}
                isDarkTheme={isDarkTheme}
              />
            </motion.div>
          ) : view === "PROGRESS" ? (
            <TrackerDashboard theme={isDarkTheme} todayKey={today} />
          ) : view === "THOUGHTS" ? (
            <ReflectionsPage theme={isDarkTheme} />
          ) : view === "PROFILE" ? (
            <ProfileSection theme={isDarkTheme} />
          ) : view === "LEGAL" ? (
            <LegalSection />
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Prayers
                setView={setView}
                year={year}
                currentMonth={currentMonth}
                activeDay={activeDay}
                isDarkTheme={isDarkTheme}
              />

              <HabitsSection
                activeDate={activeDate}
                isDarkTheme={isDarkTheme}
              />
              <FinalTodoSection
                activeDay={activeDay}
                currentMonth={currentMonth}
                year={year}
                theme={isDarkTheme}
              />

              <ReflectionSection
                activeDay={activeDay}
                currentMonth={currentMonth}
                year={year}
                isDarkTheme={isDarkTheme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav
        className={`fixed bottom-0 left-0 right-0 ${
          isDarkTheme ? "bg-[#1a1a1a]/95" : "bg-[#071a13]/90"
        } backdrop-blur-2xl border-t ${
          isDarkTheme ? "border-[#2d2d2d]" : "border-[#123d2c]"
        } py-6 px-10 z-50`}
      >
        <div className="max-w-md mx-auto flex justify-between items-center">
          <NavItem
            icon={<Calendar size={20} />}
            label="Доска"
            active={view === "BOARD"}
            onClick={() => setView("BOARD")}
            isDarkTheme={isDarkTheme}
          />

          <NavItem
            icon={<Zap size={20} />}
            label="Сегодня"
            active={view === "DAY_DETAILS"}
            onClick={() => {
              setView("DAY_DETAILS");
              createDay(deyDate);
            }}
            isDarkTheme={isDarkTheme}
          />
          {/* <NavItem
            icon={<Zap size={20} />}
            label="Сегодня"
            active={view === "DAY_DETAILS"}
            onClick={() => {
              setView("DAY_DETAILS");
              createDay(deyDate);
            }}
            isDarkTheme={isDarkTheme}
          /> */}

          <NavItem
            onClick={() => setView("THOUGHTS")}
            active={view === "THOUGHTS"}
            icon={<Brain size={20} />}
            label="Мысли"
            isDarkTheme={isDarkTheme}
          />

          <NavItem
            onClick={() => setView("PROGRESS")}
            active={view === "PROGRESS"}
            icon={<BarChart3 size={20} />}
            label="Прогресс"
            isDarkTheme={isDarkTheme}
          />
        </div>
      </nav>
    </div>
  );
};

export default PersistenceTracker;
