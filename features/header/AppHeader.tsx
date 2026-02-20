"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Leaf } from "lucide-react";

const AppHeader = () => {
  const { theme, setTheme } = useTheme();
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) return null;

  const isGreen = theme === "green" ? "dark" : "";

  return (
    <header className="w-full max-w-md green:bg-background  mx-auto flex items-center justify-between px-5 py-6">
      {/* Логотип */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#f4a01c] flex items-center justify-center font-black text-black text-sm">
          PT
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-tight">
            Persistence Tracker
          </h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            Discipline System
          </p>
        </div>
      </div>

      {/* Кнопка темы */}
      <button
        onClick={() => setTheme(theme === "green" ? "dark" : "green")}
        className="w-10 h-10 rounded-xl cursor-pointer bg-black/40 border border-white/10 flex items-center justify-center hover:scale-95 transition"
      >
        {isGreen ? (
          <Moon size={16} className="text-white" />
        ) : (
          <Leaf size={16} className="text-emerald-400" />
        )}
      </button>
    </header>
  );
};

export default AppHeader;
