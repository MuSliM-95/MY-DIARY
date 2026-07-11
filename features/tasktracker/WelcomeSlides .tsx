"use client";

import { useState } from "react";
import { Shield, Target, Activity, ShieldQuestionMark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { View } from "./types/types";
import { welcomeSlidesSlice } from "@/store/hooks/trackerSlice";
import { useAppDispatch } from "@/store/hooks";

const slides = [
  {
    icon: ShieldQuestionMark,
    title: "Зачем ?",
    description:
      "Мы часто недооцениваем собственный прогресс. День за днем кажется, что ничего не меняется, потому что память хранит лишь часть наших усилий. Your Diary помогает сохранить ваши достижения, увидеть, какой путь уже пройден, и постепенно выстроить устойчивые привычки по принципу атомных привычек.",
  },
  {
    icon: ShieldQuestionMark,
    title: "Как это работает ?",
    description: `Your Diary — это моя попытка объединить философию атомных привычек и личного дневника в одном приложении. Надеюсь, оно поможет вам стать более последовательными, замечать свой прогресс и не терять мотивацию.

      Если у вас есть идеи по развитию приложения или предложения по улучшению, обязательно напишите мне в Telegram: @MuhammadNode.`,
  },
  {
    icon: Shield,
    title: "Условия использования",
    description: `
  Your Diary предназначен для отслеживания привычек, ежедневной активности и личного прогресса.
  
  Хранение данных:
  Ваши привычки, записи, статистика и настройки хранятся локально в браузере на вашем устройстве. Эти данные не передаются на сервер и не доступны третьим лицам.
  
  Аналитика:
  Для улучшения качества приложения может использоваться анонимная аналитика. Она позволяет получать обезличенную информацию о работе приложения (например, количество посещений, используемые страницы, тип устройства, ошибки и производительность). Содержимое ваших привычек, записей, целей и других личных данных не собирается и не передается.
  
  Конфиденциальность:
  Личные данные, созданные в приложении, остаются доступны только пользователю данного устройства.
  
  Ответственность пользователя:
  Очистка браузера, удаление данных сайта или переустановка приложения могут привести к потере сохранённого прогресса.
  
  Изменение условий:
  По мере развития Your Diary настоящие условия могут обновляться.
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
