"use client";

import { useMemo, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { BookOpen, Calendar } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { JournalLeftPage, JournalRightPage } from "./JournalPages";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

export const ReflectionsPage = ({ theme }: { theme: boolean }) => {
  const { yearlyData, habits } = useAppSelector((state) => state.tracker);
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const muted = theme ? "text-stone-400" : "text-emerald-300/50";
  const accent = !theme ? "emerald" : "amber";
  const isClosed = currentPage === 0;

  const reflections = useMemo(() => {
    return Object.entries(yearlyData || {})
      .filter(([_, day]: any) => day?.reflection?.trim())
      .map(([date, day]: any) => ({ date, reflection: day.reflection, day }))
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [yearlyData]);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  const coverClass =
    accent === "amber"
      ? "bg-[#1c1916] border-[#26211c]"
      : "bg-[#04120e] border-[#0c2720]";

  return (
    <div
      className={cn(
        "text-stone-100  antialiased select-none flex flex-col items-center justify-center min-h-[520px] w-full overflow-hidden",
        theme ? "bg-[#11100e]" : ""
      )}
    >
      {/* КОМПАКТНЫЙ НАВИГАТОР ПО ДАТАМ */}
      {reflections.length > 0 && currentPage > 0 && (
        <div className="w-full max-w-[380px] xs:max-w-[420px] mb-3 px-1 flex items-center justify-end font-sans">
          <div className="relative flex items-center gap-1.5">
            <Calendar
              size={13}
              className={theme ? "text-amber-500/70" : "text-emerald-500/70"}
            />
            <select
              value={Math.max(0, Math.floor((currentPage - 1) / 2))}
              onChange={(e) =>
                bookRef.current
                  ?.pageFlip()
                  ?.turnToPage(Number(e.target.value) * 2 + 1)
              }
              className={cn(
                "text-xs rounded-lg border px-2.5 py-1.5 font-medium outline-none cursor-pointer bg-transparent max-w-[160px] truncate",
                theme
                  ? "border-stone-800 text-stone-300 bg-[#171614]"
                  : "border-emerald-950 text-emerald-200 bg-[#06110e]"
              )}
            >
              {reflections.map((item, idx) => (
                <option
                  key={item.date}
                  value={idx}
                  className={
                    theme
                      ? "bg-[#171614] text-stone-300"
                      : "bg-[#06110e] text-emerald-200"
                  }
                >
                  {formatDate(item.date)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Контейнер книги */}
      <div className="w-full flex flex-col items-center justify-center overflow-hidden">
          <div
            className={cn(
              "relative border w-full max-w-[408px] xs:max-w-[420px] aspect-[3/4] min-h-[480px] p-0 rounded-[14px_24px_24px_14px] transition-all duration-500 ease-in-out overflow-hidden isolation-isolate",
              coverClass
            )}
          >
            {/* Исторический корешок */}
            <div className="absolute top-0 bottom-0 left-0 w-[20px] bg-gradient-to-r from-black/60 via-black/30 to-transparent border-r border-black/40 rounded-l-[12px] z-50 pointer-events-none" />
            <div className="absolute top-[20%] left-0 w-[18px] h-[2px] bg-black/40 border-b border-white/[0.02] z-50 pointer-events-none" />
            <div className="absolute top-[50%] left-0 w-[18px] h-[2px] bg-black/40 border-b border-white/[0.02] z-50 pointer-events-none" />
            <div className="absolute top-[80%] left-0 w-[18px] h-[2px] bg-black/40 border-b border-white/[0.02] z-50 pointer-events-none" />

            {/* СТАРИННЫЙ КОВАheaderНЫЙ ЗАМОК */}
            <div
              onClick={() =>
                isClosed && bookRef.current?.pageFlip()?.flipNext()
              }
              className={cn(
                "absolute top-[44%] right-[-14px] w-[50px] h-[45px] z-50 transition-all duration-500 ease-in-out origin-right",
                isClosed
                  ? "translate-x-[--35px] opacity-100 scale-100 cursor-pointer pointer-events-auto"
                  : "translate-x-[40px] opacity-0 scale-75 pointer-events-none"
              )}
            >
              <div
                className={cn(
                  "w-full h-full rounded-md border flex items-center justify-center p-1 shadow-2xl relative",
                  theme
                    ? "bg-gradient-to-br from-[#4a3b2c] to-[#261d15] border-[#5e4b38]"
                    : "bg-gradient-to-br from-[#1c2d25] to-[#070f0b] border-[#294236]"
                )}
              >
                <div className="w-1.5 h-3 bg-black/80 rounded-full relative shadow-inner">
                  <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-3 h-1 bg-black/80 rounded-sm" />
                </div>
                <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-black/40" />
                <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-black/40" />
                <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-black/40" />
                <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-black/40" />
              </div>
              <div className="absolute inset-0 bg-black/50 blur-[2px] translate-y-[3px] z-[-1] rounded-md" />
            </div>

            {/* @ts-ignore */}
            <HTMLFlipBook
              width={420}
              height={560}
              size="stretch"
              minWidth={280}
              maxWidth={450}
              minHeight={400}
              maxHeight={600}
              maxShadowOpacity={0.3}
              showCover={true}
              usePortrait={true}
              mobileScrollSupport={true}
              onFlip={(e: any) => setCurrentPage(e.data)}
              ref={bookRef}
              className="w-full h-full overflow-hidden [&>div]:overflow-hidden" /* Подавляет любые внутренние скроллы библиотеки */
            >
              {/* СТРАНИЦА 1: ЛИЦЕВАЯ ОБЛОЖКА (ВОСТОЧНЫЙ МИНИМАЛИЗМ) */}
              <div className="w-full h-full flex flex-col items-center justify-between text-center p-8 bg-transparent relative shadow-[inset_-12px_0_25px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Геометрическая вязь-узор "Гирих" на бэкграунде */}
                <div
                  className={cn(
                    "absolute inset-4 border-2 rounded-[16px] pointer-events-none opacity-[0.07]",
                    theme ? "border-amber-500" : "border-emerald-500"
                  )}
                />
                <div
                  className={cn(
                    "absolute w-[180px] h-[180px] rounded-full border-dashed border opacity-[0.04] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none",
                    theme ? "border-amber-400" : "border-emerald-400"
                  )}
                />

                <div className="w-full" />

                {/* Центр: Иконка + Название + Восточные Руб-аль-хизб символы */}
                <div className="space-y-5 relative z-10 flex flex-col items-center w-full">
                  <div className="flex items-center justify-center mt-[30px] gap-2">
                    <BookOpen
                      size={24}
                      className={cn(
                        "stroke-[1.2] mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-1",
                        theme ? "text-amber-500/80" : "text-emerald-400/80"
                      )}
                    />
                    <h2
                      className={cn(
                        "text-lg tracking-[0.2em] font-light uppercase font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]",
                        theme ? "text-stone-200" : "text-emerald-50"
                      )}
                    >
                      Твой Дневник
                    </h2>
                  </div>
                  {/* ЦЕНТРАЛЬНЫЙ БЛОК: КАРТИНКА ПЕРА И ТРОЕТОЧИЕ */}
                  <div className="w-full mt-[40px] flex flex-col items-center justify-center space-y-4 relative z-10">
                    <div
                      className={cn(
                        "p-4 rounded-full  shadow-inner transition-transform duration-500 hover:-rotate-12 flex items-center justify-center",
                        theme ? "opacity-60" : "opacity-40"
                      )}
                    >
                      <img
                        src="/feather.png"
                        alt="Feather"
                        className="w-[200px] h-[200px] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ВНУТРЕННИЕ СТРАНИЦЫ */}
              {reflections.flatMap((item: any) => [
                <JournalLeftPage
                  key={`${item.date}-l`}
                  item={item}
                  theme={theme}
                  muted={muted}
                  accent={accent}
                  currentPage={currentPage}
                  reflections={reflections}
                />,
                <JournalRightPage
                  key={`${item.date}-r`}
                  item={item}
                  habits={habits}
                  theme={theme}
                  muted={muted}
                  accent={accent}
                  currentPage={currentPage}
                  reflections={reflections}
                />,
              ])}

              {/* ЗАДНЯЯ ОБЛОЖКА */}
              <div className="w-full h-full flex flex-col items-center justify-center text-center bg-transparent opacity-15 shadow-[inset_12px_0_25px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-6 border rounded-[8px] pointer-events-none opacity-10",
                    theme ? "border-amber-600/40" : "border-emerald-600/30"
                  )}
                />
                <span className="text-[10px] uppercase tracking-widest font-sans opacity-40">
                  Конец хроник
                </span>
              </div>
            </HTMLFlipBook>
          </div>
      </div>
    </div>
  );
};
