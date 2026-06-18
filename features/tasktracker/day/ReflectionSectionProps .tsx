"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenSquare,
  CheckCircle2,
  Sparkles,
  CheckCheck,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  finishDay,
  updateDayEntry,
  updateReflection,
} from "@/store/hooks/trackerSlice";

interface ReflectionSectionProps {
  activeDay: number;
  currentMonth: number;
  year: number;
  isDarkTheme: boolean;
}

const ReflectionSectionFinish: React.FC<ReflectionSectionProps> = ({
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

  const [reflection, setReflection] = useState(
    yearlyData?.reflection || ""
  );
  const [isSaved, setIsSaved] = useState(false);
  const [dayFinished, setDayFinished] = useState(
    yearlyData?.isFinished || false
  );

  const [showModal, setShowModal] = useState(false);
  const [donateModal, setDonateModal] = useState(false);

  useEffect(() => {
    setReflection(yearlyData?.reflection || "");
    setDayFinished(yearlyData?.isFinished || false);
  }, [yearlyData]);

  const hasText = reflection.trim().length > 0;

  const handleSave = () => {
    if (!reflection.trim()) return;

    dispatch(
      updateReflection({
        dayKey,
        reflection: reflection.trim(),
      })
    );

    dispatch(finishDay({ dayKey }));

    setIsSaved(true);
    setDayFinished(true);

    // 🔥 открываем модалку вместо мгновенного финала
    setShowModal(true);

    setTimeout(() => setIsSaved(false), 1500);
  };

  const handleEditDay = () => {
    dispatch(updateDayEntry({ date: dayKey }));
  };

  const closeAll = () => {
    setShowModal(false);
    setDonateModal(false);
  };

  return (
    <>
      {/* ================= MODAL 1 ================= */}
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
                  className="text-white/70 text-sm hover:text-white"
                >
                  ❤️ Поддержать проект
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
                ❤️ Поддержать Atomic Flow
              </h2>

              <p className="text-zinc-400 text-sm mb-6">
                Проект развивается бесплатно.
                <br />
                Любая поддержка помогает развитию.
              </p>

              <div className="flex flex-col gap-3">
                <button className="bg-green-500 text-black py-3 rounded-2xl font-bold">
                  Telegram
                </button>

                <button className="bg-amber-500 text-black py-3 rounded-2xl font-bold">
                  Донат
                </button>

                <button
                  onClick={closeAll}
                  className="text-zinc-400 text-sm"
                >
                  Позже
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= YOUR ORIGINAL UI ================= */}
      <motion.div className="relative">
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="w-full h-32 p-4 rounded-2xl bg-[#0f0f0f] text-white"
          disabled={dayFinished}
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={!hasText}
            className="bg-amber-500 text-black px-6 py-3 rounded-2xl font-bold disabled:opacity-50"
          >
            Завершить день
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default ReflectionSectionFinish;