"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenSquare,
  CheckCircle2,
  Sparkles,
  CheckCheck,
  Wallet,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  finishDay,
  updateDayEntry,
  updateReflection,
} from "@/store/hooks/trackerSlice";
import Link from "next/link";

interface ReflectionSectionProps {
  activeDay: number;
  currentMonth: number;
  year: number;
  isDarkTheme: boolean;
}

const ReflectionSection: React.FC<ReflectionSectionProps> = ({
  activeDay,
  currentMonth,
  year,
  isDarkTheme,
}) => {
  const dispatch = useAppDispatch();

  const month = String(currentMonth + 1).padStart(2, "0");
  const day = String(activeDay).padStart(2, "0");
  const dayKey = `${year}-${month}-${day}`;

  const yearlyData = useAppSelector(
    (state) => state.tracker.yearlyData[dayKey]
  );
  const [reflection, setReflection] = useState<string>(
    yearlyData?.reflection || ""
  );
  const [isSaved, setIsSaved] = useState(false);
  const [dayFinished, setDayFinished] = useState(
    yearlyData?.isFinished || false
  );
  const [showModal, setShowModal] = useState(false);
  const [donateModal, setDonateModal] = useState(false);

  const closeAll = () => {
    setShowModal(false);
    setDonateModal(false);
  };

  // Синхронизация с Redux состоянием
  useEffect(() => {
    setReflection(yearlyData?.reflection || "");
    setDayFinished(yearlyData?.isFinished || false);
  }, [yearlyData]);

  const bgColor = isDarkTheme ? "bg-[#1a1a1a]" : "bg-[#0b1f17]";
  const borderColor = isDarkTheme ? "border-[#2d2d2d]" : "border-[#123d2c]";
  const textColor = isDarkTheme ? "text-[#f5f5f5]" : "text-[#d7ffe8]";
  const accentColor = isDarkTheme ? "text-amber-400" : "text-emerald-400";
  const mutedTextColor = isDarkTheme
    ? "text-amber-300/60"
    : "text-emerald-200/60";

  const handleSave = () => {
    if (reflection.trim()) {
      // Сначала сохраняем рефлексию
      dispatch(
        updateReflection({
          dayKey,
          reflection: reflection.trim(),
        })
      );

      // Затем отмечаем день как завершенный
      dispatch(finishDay({ dayKey }));

      setIsSaved(true);
      setDayFinished(true);
      setShowModal(true);

      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }
  };

  const handleEditDay = () => {
    dispatch(updateDayEntry({ date: dayKey }));
  };

  const hasText = reflection.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} rounded-[2.5rem] p-6 border ${borderColor} space-y-4 relative overflow-hidden`}
    >
      {/* Галочка завершения */}
      <AnimatePresence>
        {dayFinished && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-6 right-6"
          >
            <div
              className={`p-2 rounded-full ${
                isDarkTheme ? "bg-green-600" : "bg-green-500"
              } shadow-lg`}
            >
              <CheckCheck size={20} className="text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Заголовок */}
      <motion.div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={dayFinished ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={{ duration: 2 }}
          >
            {dayFinished ? (
              <CheckCheck className={accentColor} size={20} />
            ) : (
              <PenSquare className={accentColor} size={20} />
            )}
          </motion.div>
          <div>
            <h3 className={`text-lg font-bold ${accentColor}`}>
              Рефлексия дня
            </h3>
            <p className={`text-xs ${mutedTextColor}`}>
              {dayFinished ? "День завершён! 🎉" : "Заполните рефлексию"}
            </p>
          </div>
        </div>
        <span className={`text-xs ${mutedTextColor}`}>
          {activeDay}.{currentMonth + 1}.{year}
        </span>
      </motion.div>
      {/* Текстовое поле */}
      <motion.div className="relative">
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Что хорошего произошло сегодня? Какие уроки извлекли? Что планируете на завтра?"
          className={`w-full h-32 p-4 rounded-2xl ${
            isDarkTheme ? "bg-[#0f0f0f]" : "bg-[#06140e]"
          } ${textColor} border ${borderColor} resize-none focus:outline-none focus:ring-2 ${
            isDarkTheme ? "focus:ring-amber-400" : "focus:ring-emerald-400"
          } focus:ring-opacity-50 transition-all ${
            dayFinished ? "opacity-80 cursor-not-allowed" : ""
          }`}
          disabled={dayFinished}
        />

        {/* Индикатор количества символов */}
        {hasText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute top-2 right-2 text-xs ${mutedTextColor} bg-black/20 px-2 py-1 rounded-full`}
          >
            {reflection.length} симв.
          </motion.div>
        )}

        {/* Затемнение при завершении */}
        {dayFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center"
          >
            <div
              className={`text-center ${accentColor} bg-black/30 px-3 py-1 rounded-full`}
            >
              <CheckCheck size={16} className="inline mr-2" />
              <span className="text-sm">День завершён</span>
            </div>
          </motion.div>
        )}
      </motion.div>
      {/* Кнопка сохранения */}
      <motion.div className="flex justify-end">
        <AnimatePresence mode="wait">
          {dayFinished ? (
            <motion.div className="flex justify-end">
              <AnimatePresence mode="wait">
                {dayFinished ? (
                  <motion.div
                    className="
        flex flex-col sm:flex-row
        sm:items-center
        justify-between
        gap-3
        w-full
      "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* LEFT ACTIONS */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        key="edit"
                        onClick={handleEditDay}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        transition={{ delay: 0.05 }}
                        className={`
            flex items-center justify-center gap-2
            w-full sm:w-auto
            px-5 py-3 rounded-2xl
            border transition-all cursor-pointer
            ${
              isDarkTheme
                ? "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
            }
          `}
                      >
                        <span className="text-sm">✎</span>
                        <span className="font-semibold text-sm">Изменить</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.button
              key="save"
              whileHover={{
                scale: hasText ? 1.05 : 1,
                boxShadow: hasText
                  ? isDarkTheme
                    ? "0 0 20px rgba(245, 158, 11, 0.3)"
                    : "0 0 20px rgba(16, 185, 129, 0.3)"
                  : "none",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={!hasText}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl ${
                isDarkTheme
                  ? "bg-amber-600 hover:bg-amber-500"
                  : "bg-emerald-500 hover:bg-emerald-400"
              } ${
                isDarkTheme ? "text-white" : "text-black"
              } font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <AnimatePresence mode="wait">
                {isSaved ? (
                  <motion.div
                    key="saved"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles size={16} />
                    <span>Сохранено!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>Завершить день</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Подсказки */}
      <AnimatePresence>
        {!dayFinished && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`text-xs ${mutedTextColor} space-y-1 overflow-hidden`}
          >
            {!hasText ? (
              <p>✍️ Напишите несколько слов о сегодняшнем дне</p>
            ) : (
              <p>✅ Нажмите "Завершить день" чтобы сохранить рефлексию</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Сообщение о завершении */}
      <AnimatePresence>
        {dayFinished && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center text-sm ${
              isDarkTheme ? "text-green-400" : "text-green-600"
            } font-medium`}
          >
            🎉 День успешно завершён! Рефлексия сохранена в историю.
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showModal && !donateModal && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-6 max-w-md w-full text-center"
            >
              <h2 className="text-xl font-bold text-white mb-3">
                🎉 Отличная работа!
              </h2>

              <p className="text-zinc-400 text-sm mb-6">
                Сегодня вы стали лучше на 1%.
                <br />
                Продолжайте двигаться вперёд.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={closeAll}
                  className="bg-amber-500 text-black font-bold py-3 rounded-2xl"
                >
                  Продолжить
                </button>

                <button
                  onClick={() => setDonateModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/80 text-sm font-medium transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="text-base">❤️</span>
                  <span>Поддержать проект</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ================= MODAL 2 ================= */}
      <AnimatePresence>
        {donateModal && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-6 max-w-md w-full text-center"
            >
              <h2 className="text-white text-lg font-bold mb-3">
                ❤️ Поддержать Your Diary
              </h2>

              <p className="text-zinc-400 text-sm mb-6">
                Проект развивается бесплатно.
                <br />
                Любая поддержка помогает развитию.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href={"https://t.me/AsIntended_ru"}
                  target="_blank"
                  className="bg-green-500 text-black py-3 rounded-2xl font-bold"
                >
                  Telegram
                </Link>

                <Link
                  href={"https://pay.cloudtips.ru/p/4b2ee0a7"}
                  className="bg-amber-500 text-black py-3 flex items-center justify-center rounded-2xl font-bold"
                  target="_blank"
                >
                  <Wallet />
                </Link>

                <button onClick={closeAll} className="text-zinc-400 text-sm">
                  Позже
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>{" "}
    </motion.div>
  );
};

export default ReflectionSection;
