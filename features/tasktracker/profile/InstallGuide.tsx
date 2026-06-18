"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

type Tab = "ios" | "android" | "desktop";

interface IProps {
  theme: boolean;
}

export function InstallGuide({ theme }: IProps) {
  const [tab, setTab] = useState<Tab>("ios");

  const tabClass = (active: boolean) =>
    active
      ? `${
		`${
			theme
			  ? "bg-amber-600 hover:bg-amber-500"
			  : "bg-emerald-500 hover:bg-emerald-400"
		  } ${
			theme ? "text-white" : "text-black"
		  } font-black rounded-2xl flex items-center justify-center gap-2 uppercase text-sm tracking-widest active:scale-95 transition-all ${
			theme
			  ? "shadow-[0_10px_30px_rgba(245,158,11,0.25)]"
			  : "shadow-[0_10px_30px_rgba(16,185,129,0.35)]"
		  }`
        }`
      : "bg-white/10 text-white/70 hover:bg-white/15 cursor-pointer";

  return (
    <div
      className={cn(
        "rounded-3xl p-5 bg-[#0b1f17]",
        `${theme ? "bg-[#1a1a1a]" : "bg-[#0b1f17]"} border ${
          theme ? "border-[#2d2d2d]" : "border-[#123d2c]"
        }`
      )}
    >
      <h2 className="text-lg font-semibold mt-2">Установить приложение</h2>

      <p className="text-sm text-white/60 mt-2">Выберите вашу платформу</p>

      {/* TABS */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setTab("ios")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${tabClass(
            tab === "ios"
          )}`}
        >
          iOS
        </button>

        <button
          onClick={() => setTab("android")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${tabClass(
            tab === "android"
          )}`}
        >
          Android
        </button>

        <button
          onClick={() => setTab("desktop")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${tabClass(
            tab === "desktop"
          )}`}
        >
          PC
        </button>
      </div>

      {/* CONTENT */}
      <div className="mt-4 space-y-2 text-sm text-white/70">
        {tab === "ios" && (
          <ol className="space-y-2">
            <li>1. Откройте сайт в Safari</li>
            <li>2. Нажмите «Поделиться»</li>
            <li>3. Выберите «На экран Домой»</li>
            <li>4. Нажмите «Добавить»</li>
          </ol>
        )}

        {tab === "android" && (
          <ol className="space-y-2">
            <li>1. Откройте сайт в Chrome</li>
            <li>2. Нажмите ⋮ вверху справа</li>
            <li>3. Выберите «Добавить на главный экран»</li>
            <li>4. Подтвердите установку</li>
          </ol>
        )}

        {tab === "desktop" && (
          <ol className="space-y-2">
            <li>1. Откройте Chrome или Edge</li>
            <li>2. Нажмите ⋮ вверху справа</li>
            <li>3. Выберите «Установить приложение»</li>
            <li>4. Подтвердите</li>
          </ol>
        )}
      </div>
    </div>
  );
}
