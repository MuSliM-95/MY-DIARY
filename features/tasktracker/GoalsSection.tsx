"use client";

import React, { useState } from "react";
import { Plus, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addTodoAction, deleteTodoAction, toggleTodoAction } from "./hooks/trackerSlice";

interface IProps {
  activeDay: number;
  currentMonth: number;
  dayKey: string
}

const FinalTodoSection: React.FC<IProps> = ({ activeDay, currentMonth, dayKey }) => {
  const dispatch = useAppDispatch();
  const todosState = useAppSelector((state) => state.tracker.yearlyData[dayKey]?.todos || []);

  const [inputValue, setInputValue] = useState<string>("");



  const handleAdd = () => {
	if (inputValue.trim()) {
	  dispatch(addTodoAction({ dayKey, text: inputValue }));
	  setInputValue('');
	}
  };
  
  const handleToggle = (id: string) => {
	dispatch(toggleTodoAction({ dayKey, id }));
  };
  
  const handleDelete = (id: string) => {
	dispatch(deleteTodoAction({ dayKey, id }));
  };

  return (
    <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-[2.5rem] p-6 space-y-4 shadow-2xl w-full max-w-md mx-auto">
      {/* Поле ввода: кнопка внутри общей линии, не выпирает */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center bg-black border border-[#f4a01c]/40 rounded-2xl px-4 py-1 focus-within:border-[#f4a01c] transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Добавить цель..."
            className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-700"
          />
        </div>

        <button
          onClick={handleAdd}
          className="bg-[#f4a01c] text-black p-3.5 rounded-2xl hover:bg-[#ffb43a] transition-all active:scale-90 shrink-0 shadow-lg shadow-[#f4a01c]/10"
        >
          <Plus size={22} strokeWidth={3} />
        </button>
      </div>

      {/* Список задач с многоточием (truncate) */}
      <div className="space-y-2 pt-1">
        <AnimatePresence initial={false}>
          {todosState.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-2xl group min-w-0 transition-colors hover:border-white/10"
            >
              <div
                className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                onClick={() => handleToggle(todo.id)}
              >
                {/* Чекбокс */}
                <div
                  className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                    todo.completed
                      ? "bg-[#f4a01c] border-[#f4a01c]"
                      : "border-gray-700"
                  }`}
                >
                  {todo.completed && (
                    <Check size={12} strokeWidth={4} className="text-black" />
                  )}
                </div>

                {/* Текст с многоточием */}
                <span
                  title={todo.text}
                  className={`text-[13px] font-medium truncate pr-2 transition-all ${
                    todo.completed
                      ? "text-gray-600 line-through"
                      : "text-gray-300"
                  }`}
                >
                  {todo.text}
                </span>
              </div>

              {/* Кнопка удаления */}
              <button
                onClick={() => handleDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 cursor-pointer text-gray-700 hover:text-red-500 transition-all shrink-0 p-1"
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
