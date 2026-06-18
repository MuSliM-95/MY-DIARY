"use client";

import React, { useState } from "react";
import { Plus, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  addTodoAction,
  deleteTodoAction,
  toggleTodoAction,
} from "@/store/hooks/trackerSlice";

interface IProps {
  activeDay: number;
  currentMonth: number;
  year: number;
  theme: boolean;
}

const FinalTodoSection: React.FC<IProps> = ({
  activeDay,
  currentMonth,
  year,
  theme,
}) => {
  const dispatch = useAppDispatch();

  const month = String(currentMonth + 1).padStart(2, "0");

  const day = String(activeDay).padStart(2, "0");

  const dayKey = `${year}-${month}-${day}`;

  const todosState = useAppSelector(
    (state) => state.tracker.yearlyData[dayKey]?.todos || []
  );

  const [inputValue, setInputValue] = useState<string>("");

  const card = theme
    ? "bg-[#171717] border-[#2a2a2a]"
    : "bg-[#071a14] border-[#15392c]";

  const surface = theme
    ? "bg-[#101010] border-white/10"
    : "bg-[#0b241b] border-emerald-900/40";

  const inputBg = theme
    ? "bg-black/30 border-amber-500/20 focus-within:border-amber-500"
    : "bg-black/20 border-emerald-500/20 focus-within:border-emerald-500";

  const accentButton = theme
    ? "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20"
    : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20";

  const muted = theme
    ? "text-amber-100/40"
    : "text-emerald-100/40";

  const text = theme ? "text-white" : "text-emerald-50";

  const completedText = theme
    ? "text-white/25"
    : "text-emerald-100/25";

  const handleAdd = () => {
    if (inputValue.trim()) {
      dispatch(addTodoAction({ dayKey, text: inputValue }));

      setInputValue("");
    }
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTodoAction({ dayKey, id }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTodoAction({ dayKey, id }));
  };

  return (
    <div
      className={`rounded-[2.5rem] border p-6 space-y-4 shadow-2xl w-full max-w-md mx-auto ${card}`}
    >
      {/* INPUT */}
      <div className="flex items-center gap-2">
        <div
          className={`flex-1 flex items-center rounded-2xl px-4 py-1 border transition-all ${inputBg}`}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Добавить цель..."
            className={`w-full bg-transparent py-3 text-sm outline-none placeholder:${muted} ${text}`}
          />
        </div>

        <button
          onClick={handleAdd}
          className={`p-3.5 rounded-2xl transition-all active:scale-90 shrink-0 shadow-lg ${accentButton}`}
        >
          <Plus size={22} strokeWidth={3} />
        </button>
      </div>

      {/* TODOS */}
      <div className="space-y-2 pt-1">
        <AnimatePresence initial={false}>
          {todosState.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex items-center justify-between border p-4 rounded-2xl group min-w-0 transition-all ${
                theme
                  ? "bg-black/20 border-white/5 hover:border-white/10"
                  : "bg-black/10 border-emerald-900/20 hover:border-emerald-700/40"
              }`}
            >
              <div
                className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                onClick={() => handleToggle(todo.id)}
              >
                {/* CHECKBOX */}
                <div
                  className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                    todo.completed
                      ? theme
                        ? "bg-amber-500 border-amber-500"
                        : "bg-emerald-500 border-emerald-500"
                      : theme
                      ? "border-white/20"
                      : "border-emerald-800"
                  }`}
                >
                  {todo.completed && (
                    <Check size={12} strokeWidth={4} className="text-black" />
                  )}
                </div>

                {/* TEXT */}
                <span
                  title={todo.text}
                  className={`text-[13px] font-medium truncate pr-2 transition-all ${
                    todo.completed
                      ? `line-through ${completedText}`
                      : text
                  }`}
                >
                  {todo.text}
                </span>
              </div>

              {/* DELETE */}
              <button
                onClick={() => handleDelete(todo.id)}
                className={`opacity-0 group-hover:opacity-100 transition-all shrink-0 p-1 ${
                  theme
                    ? "text-white/20 hover:text-red-400"
                    : "text-emerald-100/20 hover:text-red-400"
                }`}
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FinalTodoSection;