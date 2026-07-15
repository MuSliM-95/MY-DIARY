"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  CheckCircle2,
  Trash2,
  Flame,
  Dumbbell,
  Brain,
  MoonStar,
  PencilLine,
  Wallet,
  LayoutGrid,
  Compass,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addHabit,
  deleteHabit,
  updateHabit,
  updateHabitTaskProgress,
} from "@/store/hooks/trackerSlice";

import { Habit, HabitTask } from "@/features/tasktracker/types/types";

interface Props {
  isDarkTheme: boolean;
  activeDate: string;
}

export default function HabitsSection({ isDarkTheme, activeDate }: Props) {
  const habits = useAppSelector((state) => state.tracker.habits);

  const dispatch = useAppDispatch();

  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState("");

  const [category, setCategory] = useState<Habit["category"]>("health");

  const [timeOfDay, setTimeOfDay] = useState<Habit["timeOfDay"]>("morning");

  const [tasks, setTasks] = useState<HabitTask[]>([]);

  const [taskName, setTaskName] = useState("");

  const [taskType, setTaskType] = useState<HabitTask["type"]>("boolean");

  const [taskTarget, setTaskTarget] = useState("");

  const [taskUnit, setTaskUnit] = useState("");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);

  const [deleteHabitId, setDeleteHabitId] = useState<string | null>(null);

  const card = isDarkTheme
    ? "bg-[#151515] border-[#2d2d2d]"
    : "bg-[#0c2018] border-[#174734]";

  const cardSecondary = isDarkTheme ? "bg-[#1c1c1c]" : "bg-[#112a20]";

  const text = isDarkTheme ? "text-[#fff7ed]" : "text-emerald-50";

  const muted = isDarkTheme ? "text-orange-200/50" : "text-emerald-100/60";

  const borderSoft = isDarkTheme
    ? "border-orange-500/10"
    : "border-emerald-500/10";

  const accentBg = isDarkTheme ? "bg-amber-500" : "bg-emerald-500";

  const accentSoft = isDarkTheme ? "bg-orange-500/10" : "bg-emerald-500/10";

  const glow = isDarkTheme
    ? "shadow-[0_0_30px_rgba(249,115,22,0.15)]"
    : "shadow-[0_0_30px_rgba(16,185,129,0.12)]";

  const input = `
    w-full
    rounded-2xl
    border
    px-4 py-3
    outline-none
    transition-all
    ${borderSoft}
    ${text}
    ${
      isDarkTheme
        ? "bg-[#1a1a1a] focus:border-orange-500/40"
        : "bg-[#10271e] focus:border-emerald-500/40"
    }
  `;

  const select = `
    rounded-2xl
    px-4 py-3
    outline-none
    border
    transition-all
    ${borderSoft}
    ${text}
    ${
      isDarkTheme
        ? "bg-[#1a1a1a] focus:border-orange-500/40"
        : "bg-[#10271e] focus:border-emerald-500/40"
    }
  `;

  const categoryConfig = {
    health: {
      label: "Здоровье",
      icon: Dumbbell,
    },

    learning: {
      label: "Обучение",
      icon: Brain,
    },

    spiritual: {
      label: "Иман",
      icon: MoonStar,
    },

    productivity: {
      label: "Продуктивность",
      icon: Flame,
    },

    finance: {
      label: "Финансы",
      icon: Wallet,
    },

    order: {
      label: "Порядок",
      icon: LayoutGrid,
    },

    personal_development: {
      label: "Личное развитие",
      icon: Compass,
    },
  };

  const updateTaskForm = (task: HabitTask) => {
    setEditingTaskId(task.id);
    setTaskName(task.name);
    setTaskType(task.type);
    setTaskTarget(String(task.target));
    setTaskUnit(task?.unit || "");
  };

  const resetTaskForm = () => {
    setTaskName("");
    setEditingTaskId(null);
    setTaskTarget(String(1));
    setTaskUnit("");
  };

  const resetHabit = () => {
    setName("");
    setCategory("health");
    setTimeOfDay("morning");
    setTasks([]);
    setIsAdding(false);
    // setIsEditingHabit(false);
    setEditingTaskId(null);
    setEditingHabitId(null);
  };

  const addTask = () => {
    if (!taskName.trim()) return;

    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                name: taskName,

                type: taskType,

                target: Number(taskTarget) || 1,

                unit: taskUnit || undefined,
              }
            : task
        )
      );
    } else {
      const newTask: HabitTask = {
        id: crypto.randomUUID(),

        name: taskName,

        type: taskType,

        target: Number(taskTarget) || 1,

        unit: taskUnit || undefined,
      };
      setTasks((prev) => [...prev, newTask]);
    }

    resetTaskForm();
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const createHabit = () => {
    if (!name.trim()) return;

    const habit = {
      id: editingHabitId || crypto.randomUUID(),

      name,

      category,

      timeOfDay,

      createdAt: new Date().toISOString(),

      streak: 0,

      tasks,
    };
    if (editingHabitId) {
      dispatch(updateHabit({ habit }));
    } else {
      dispatch(addHabit({ habit }));
    }

    resetHabit();
    resetTaskForm();
  };

  const updateHabitHandler = (habit: Habit) => {
    setIsAdding(true);
    setName(habit.name);
    setEditingHabitId(habit.id);
    setCategory(habit.category);
    setTimeOfDay(habit.timeOfDay);
    setTasks(habit.tasks);
  };

  const closeForm = () => {
    resetHabit();
    resetTaskForm();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HABITS */}
      {habits.map((habit) => {
        const CategoryIcon = categoryConfig[habit.category].icon;

        return (
          <motion.div
            key={habit.id}
            layout
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className={`
              relative
              overflow-hidden
              rounded-[2rem]
              border
              p-5
              ${card}
              ${glow}
            `}
          >
            {/* TOP */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`
                    w-12 h-12 rounded-2xl
                    flex items-center justify-center
                    ${accentSoft}
                  `}
                >
                  <CategoryIcon
                    size={20}
                    className={
                      isDarkTheme ? "text-orange-300" : "text-emerald-300"
                    }
                  />
                </div>

                <div>
                  <h3 className={`text-lg font-semibold ${text}`}>
                    {habit.name}
                  </h3>

                  <div
                    className={`flex items-center gap-2 mt-1 text-xs ${muted}`}
                  >
                    <span>{categoryConfig[habit.category].label}</span>

                    <span>•</span>

                    <span>
                      {habit.timeOfDay === "morning"
                        ? "🌅 Утро"
                        : habit.timeOfDay === "afternoon"
                        ? "☀️ День"
                        : "🌙 Вечер"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex">
                <button
                  onClick={() => updateHabitHandler(habit)}
                  className={`
                        w-10 h-10 rounded-2xl
                        flex items-center justify-center
                        transition-all
                        ${
                          isDarkTheme
                            ? "hover:bg-red-500/15"
                            : "hover:bg-red-500/10"
                        }
                      `}
                >
                  <PencilLine size={16} className="border-amber-500" />
                </button>

                <button
                  onClick={() => setDeleteHabitId(habit.id)}
                  className={`
                  w-10 h-10 rounded-2xl
                  flex items-center justify-center
                  transition-all
                  ${isDarkTheme ? "hover:bg-red-500/15" : "hover:bg-red-500/10"}
                `}
                >
                  <Trash2 size={16} className="border-amber-500" />
                </button>
              </div>
            </div>

            {/* TASKS */}
            <div className="mt-5 flex flex-col gap-3">
              {habit.tasks.map((task) => {
                const progress = habit.progress?.[activeDate]?.[task.id];

                const value = progress?.value || 0;

                const completed =
                  task.type === "boolean"
                    ? progress?.completed
                    : value >= task.target;

                const progressPercent =
                  task.type === "boolean"
                    ? completed
                      ? 100
                      : 0
                    : Math.min((value / task.target) * 100, 100);

                const updateValue = (newValue: number) => {
                  dispatch(
                    updateHabitTaskProgress({
                      habitId: habit.id,
                      taskId: task.id,
                      day: activeDate,
                      value: Math.max(0, newValue),
                    })
                  );
                };

                return (
                  <motion.div
                    key={task.id}
                    layout
                    className={`
          relative
          overflow-hidden
          rounded-[2rem]
          border
          p-4
          transition-all
          ${
            completed
              ? isDarkTheme
                ? "border-orange-400/30 bg-orange-500/5"
                : "border-emerald-500/30 bg-emerald-500/10"
              : `${cardSecondary} ${borderSoft}`
          }
        `}
                  >
                    {/* glow */}
                    <div
                      className={`
            absolute inset-0 opacity-40 pointer-events-none
            ${
              completed
                ? isDarkTheme
                  ? "bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_60%)]"
                  : "bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_60%)]"
                : ""
            }
          `}
                    />

                    {/* top */}
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className={`font-semibold text-[15px] ${text}`}>
                          {task.name}
                        </div>

                        <div className={`text-xs mt-1 ${muted}`}>
                          {task.type === "boolean"
                            ? "✅ Выполнить"
                            : task.type === "duration"
                            ? `⏱ ${value}/${task.target} ${task.unit || "мин"}`
                            : `🎯 ${value}/${task.target} ${task.unit || ""}`}
                        </div>
                      </div>

                      {/* status */}
                      <div
                        className={`
              w-8 h-8 rounded-2xl
              flex items-center justify-center
              border
              transition-all
              ${
                completed
                  ? isDarkTheme
                    ? "bg-orange-400 text-black border-orange-300"
                    : "bg-emerald-400 text-black border-emerald-300"
                  : "border-white/10 text-zinc-500"
              }
            `}
                      >
                        <CheckCircle2 size={16} />
                      </div>
                    </div>

                    {/* progress */}
                    {task.type !== "boolean" && (
                      <div className="mt-4">
                        <div
                          className={`
                h-2 rounded-full overflow-hidden
                ${isDarkTheme ? "bg-[#262626]" : "bg-black/10"}
              `}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            className={`
                  h-full rounded-full
                  ${
                    isDarkTheme
                      ? "bg-gradient-to-r from-orange-400 to-amber-300"
                      : "bg-gradient-to-r from-emerald-400 to-green-300"
                  }
                `}
                          />
                        </div>
                      </div>
                    )}

                    {/* controls */}
                    <div className="relative z-10 mt-4">
                      {task.type === "boolean" ? (
                        <button
                          onClick={() => updateValue(completed ? 0 : 1)}
                          className={`
                w-full
                py-3
                rounded-2xl
                font-medium
                transition-all
                ${
                  completed
                    ? isDarkTheme
                      ? "bg-orange-400 text-black"
                      : "bg-emerald-400 text-black"
                    : `${cardSecondary} ${text}`
                }
              `}
                        >
                          {completed ? "Выполнено" : "Отметить"}
                        </button>
                      ) : (
                        <div className="relative z-10 mt-4">
                          <input
                            type="range"
                            min={0}
                            max={task.target}
                            value={value}
                            onChange={(e) =>
                              updateValue(Number(e.target.value))
                            }
                            className={`
                            w-full h-2 rounded-full appearance-none cursor-pointer
                            ${isDarkTheme ? "bg-[#262626]" : "bg-black/10"}
                          `}
                            style={{
                              accentColor: isDarkTheme ? "#fb923c" : "#10b981",
                            }}
                          />

                          <div className={`mt-2 text-center text-sm ${text}`}>
                            {value} / {task.target} {task.unit || ""}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* ADD BUTTON */}
      {!isAdding && (
        <motion.button
          whileTap={{
            scale: 0.98,
          }}
          onClick={() => setIsAdding(true)}
          className={`
            rounded-[2rem]
            border border-dashed
            p-5
            flex items-center justify-center gap-3
            transition-all
            ${card}
            ${text}
            ${borderSoft}
          `}
        >
          <div
            className={`
              w-10 h-10 rounded-2xl
              flex items-center justify-center
              ${accentSoft}
            `}
          >
            <Plus
              size={18}
              className={isDarkTheme ? "text-orange-300" : "text-emerald-300"}
            />
          </div>

          <span className="font-medium">Добавить привычку</span>
        </motion.button>
      )}

      {/* FORM */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 10,
            }}
            className={`
              rounded-[2rem]
              border
              p-5
              flex flex-col gap-4
              ${card}
            `}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название привычки"
              className={input}
            />

            {/* SETTINGS */}
            <div className="grid grid-cols-2 gap-3">
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as Habit["category"])
                }
                className={select}
              >
                <option value="health">Здоровье</option>

                <option value="learning">Обучение</option>

                <option value="spiritual">Иман</option>

                <option value="productivity">Продуктивность</option>

                <option value="finance">Финансы</option>

                <option value="order">Порядок</option>

                <option value="personal_development">Личное развитие</option>
              </select>

              <select
                value={timeOfDay}
                onChange={(e) =>
                  setTimeOfDay(e.target.value as Habit["timeOfDay"])
                }
                className={select}
              >
                <option value="morning">🌅 Утро</option>

                <option value="afternoon">☀️ День</option>

                <option value="evening">🌙 Вечер</option>
              </select>
            </div>

            {/* TASK */}
            <div
              className={`
                rounded-[1.5rem]
                border
                p-4
                flex flex-col gap-3
                ${cardSecondary}
                ${borderSoft}
              `}
            >
              <input
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Название задачи"
                className={input}
              />

              <div className="grid grid-cols-3 gap-2">
                <select
                  value={taskType}
                  onChange={(e) =>
                    setTaskType(e.target.value as HabitTask["type"])
                  }
                  className={select}
                >
                  <option value="boolean">Выполнить</option>

                  <option value="duration">Время</option>

                  <option value="count">Количество</option>
                </select>

                <input
                  type="number"
                  value={taskTarget}
                  min={0}
                  onChange={(e) => setTaskTarget(e.target.value)}
                  className={input}
                  placeholder="Цель"
                />

                <input
                  value={taskUnit}
                  onChange={(e) => setTaskUnit(e.target.value)}
                  className={input}
                  placeholder="мин"
                />
              </div>

              <button
                onClick={() => addTask()}
                className={`
                  py-3 rounded-2xl
                  font-medium
                  transition-all
                  ${accentBg}
                  text-black
                `}
              >
                {editingTaskId ? "Изменить задачу" : "Добавить задачу"}
              </button>
            </div>

            {/* TASK PREVIEW */}
            {tasks.length > 0 && (
              <div className="flex flex-col gap-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`
                      rounded-2xl
                      px-4 py-3
                      border
                      flex items-center justify-between
                      ${cardSecondary}
                      ${borderSoft}
                    `}
                  >
                    <div>
                      <div className={`text-sm font-medium ${text}`}>
                        {task.name}
                      </div>

                      <div className={`text-xs mt-1 ${muted}`}>
                        {task.type === "duration"
                          ? `${task.target} ${task.unit || "мин"}`
                          : task.type === "count"
                          ? `${task.target}`
                          : "Выполнить"}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button onClick={() => updateTaskForm(task)}>
                        <PencilLine size={12} />
                      </button>
                      <button
                        onClick={() => removeTask(task.id)}
                        className="text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                onClick={createHabit}
                className={`
                  flex-1
                  py-3 rounded-2xl
                  font-semibold
                  text-black
                  ${accentBg}
                `}
              >
                {editingHabitId ? "Изменить привычку" : "Создать привычку"}
              </button>

              <button
                onClick={closeForm}
                className={`
                  w-14 rounded-2xl border
                  flex items-center justify-center
                  ${borderSoft}
                  ${text}
                `}
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteHabitId && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              className={`
                w-full max-w-sm
                rounded-[2rem]
                border
                p-5
                ${card}
              `}
            >
              <h3 className={`text-lg font-semibold ${text}`}>
                Удалить привычку?
              </h3>

              <p className={`text-sm mt-2 ${muted}`}>
                Это действие нельзя отменить.
              </p>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => {
                    dispatch(
                      deleteHabit({
                        id: deleteHabitId,
                      })
                    );

                    setDeleteHabitId(null);
                  }}
                  className="flex-1 py-3 rounded-2xl border-amber-500 text-white font-medium"
                >
                  Удалить
                </button>

                <button
                  onClick={() => setDeleteHabitId(null)}
                  className={`
                    flex-1
                    py-3 rounded-2xl
                    border
                    ${borderSoft}
                    ${text}
                  `}
                >
                  Отмена
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
