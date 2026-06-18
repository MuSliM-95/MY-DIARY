"use client";

import { useState } from "react";
import { Shield, Target, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { View } from "./types/types";
import { welcomeSlidesSlice } from "@/store/hooks/trackerSlice";
import { useAppDispatch } from "@/store/hooks";

const slides = [
  {
    icon: Target,
    title: "Система важнее мотивации",
    description:
      "Atomic System помогает создавать устойчивые привычки через ежедневные действия. Маленькие шаги каждый день приводят к большим результатам.",
  },
  {
    icon: Activity,
    title: "Отслеживайте прогресс",
    description:
      "Следите за привычками, сериями и статистикой. Последовательность формирует дисциплину.",
  },
  {
    icon: Shield,
    title: "Ваши данные принадлежат вам",
    description: `
Условия использования:
Atomic System предназначен для отслеживания привычек, ежедневной активности и личного прогресса.

Хранение данных:
Все данные хранятся локально в браузере на вашем устройстве. На данный момент приложение не отправляет данные на сервер.

Конфиденциальность:
Созданные привычки, статистика и настройки доступны только пользователю данного устройства.

Ответственность пользователя:
Очистка браузера, удаление данных сайта или переустановка приложения могут привести к потере сохранённого прогресса.

Изменение условий:
По мере развития Atomic System данные условия могут обновляться.
    `.trim(),
  },
];

interface Props {
  onFinish: () => void;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

export const WelcomeSlides = ({ onFinish }: Props) => {
  const dispatch = useAppDispatch();

  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const current = slides[step];
  const Icon = current.icon;

  const isLast = step === slides.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setStep((prev) => prev + 1);
      return;
    }

    if (!accepted) return;

    dispatch(welcomeSlidesSlice());
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#0f0f0f] flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 max-h-[90vh] flex flex-col"
          >
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 shrink-0">
              <Icon className="w-8 h-8 text-orange-400" />
            </div>

            <h1 className="text-3xl font-black text-white mb-4 shrink-0">
              {current.title}
            </h1>

            <div className="text-zinc-400 leading-relaxed text-base whitespace-pre-line overflow-y-auto pr-2 flex-1">
              {current.description}
            </div>

            {isLast && (
              <div className="mt-6 shrink-0">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-zinc-300">Я согласен</span>
                </label>
              </div>
            )}

            <div className="flex gap-2 mt-6 justify-center shrink-0">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setStep(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === step
                      ? "w-8 bg-orange-500"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={isLast && !accepted}
              className="
                mt-6
                w-full
                rounded-2xl
                py-3
                font-bold
                bg-orange-500
                text-black
                disabled:opacity-40
                disabled:cursor-not-allowed
                transition-all
                shrink-0
              "
            >
              {isLast ? "Начать использовать" : "Продолжить"}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
