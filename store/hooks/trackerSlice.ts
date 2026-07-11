"use client";

import { DayEntry, Habit, Todo } from "@/features/tasktracker/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TrackerState {
  yearlyData: Record<string, DayEntry>;
  habits: Habit[];
  onboarding_completed: boolean;
}

const initialState: TrackerState = {
  yearlyData: {},
  habits: [],
  onboarding_completed: false,
};

export const trackerSlice = createSlice({
  name: "tracker",
  initialState,
  reducers: {
    // 1. Добавление задачи
    addTodoAction: (
      state,
      action: PayloadAction<{ dayKey: string; text: string }>
    ) => {
      const { dayKey, text } = action.payload;

      // Инициализируем день, если его еще нет в стейте
      if (!state.yearlyData[dayKey]) {
        state.yearlyData[dayKey] = {
          isFinished: false,
          todos: [],
          prayers: {},
          Quran: 0,
          reflection: "",
        };
      }

      const newTodo: Todo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
      };

      state.yearlyData[dayKey]?.todos?.push(newTodo);
    },

    createDate: (state, action: PayloadAction<{ dayKey: string }>) => {
      if (!state.yearlyData[action.payload.dayKey]) {
        state.yearlyData[action.payload.dayKey] = {
          isFinished: false,
          todos: [],
          prayers: {
            Фаджр: false,
            Зухр: false,
            Аср: false,
            Магриб: false,
            Иша: false,
          },
          Quran: 0,
          reflection: "",
        };
      }
    },

    addPrayer: (
      state,
      action: PayloadAction<{
        dayKey: string;
        prayers: { [key: string]: boolean };
      }>
    ) => {
      const { dayKey, prayers } = action.payload;

      if (!state.yearlyData[dayKey]) {
        state.yearlyData[dayKey] = {
          isFinished: false,
          todos: [],
          prayers: {},
          Quran: 0,
          reflection: "",
        };
      }

      state.yearlyData[dayKey].prayers = prayers;
    },

    // 2. Переключение статуса задачи (чекбокс)
    toggleTodoAction: (
      state,
      action: PayloadAction<{ dayKey: string; id: string }>
    ) => {
      const { dayKey, id } = action.payload;
      const todo = state.yearlyData[dayKey]?.todos.find((t) => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },

    // 3. Удаление задачи
    deleteTodoAction: (
      state,
      action: PayloadAction<{ dayKey: string; id: string }>
    ) => {
      const { dayKey, id } = action.payload;
      if (state.yearlyData[dayKey]) {
        state.yearlyData[dayKey].todos = state.yearlyData[dayKey].todos.filter(
          (t) => t.id !== id
        );
      }
    },

    updateQuranTime: (
      state,
      action: PayloadAction<{ dayKey: string; minutes: number }>
    ) => {
      const { dayKey, minutes } = action.payload;

      state.yearlyData[dayKey].Quran = minutes;
    },

    // Твой экшен завершения дня
    finishDay: (state, action: PayloadAction<{ dayKey: string }>) => {
      const { dayKey } = action.payload;

      if (!state.yearlyData[dayKey]) {
        state.yearlyData[dayKey] = {
          isFinished: true,
          todos: [],
          prayers: {},
          Quran: 0,
          reflection: "",
        };
      } else {
        state.yearlyData[dayKey].isFinished = true;
      }
    },

    addHabit(state, action: PayloadAction<{ habit: Habit }>) {
      state.habits.push(action.payload.habit);
    },

    updateHabit(state, action: PayloadAction<{ habit: Habit }>) {
      state.habits = state.habits.map((habit) =>
        habit.id === action.payload.habit.id
          ? {
              ...action.payload.habit,
              progress: habit.progress,
              streak: habit.streak,
              createdAt: habit.createdAt,
            }
          : habit
      );
    },

    deleteHabit(state, action: PayloadAction<{ id: string }>) {
      state.habits = state.habits.filter(
        (habit) => habit.id !== action.payload.id
      );
    },

    updateHabitTaskProgress(
      state,
      action: PayloadAction<{
        habitId: string;
        taskId: string;
        day: string;
        value: number;
      }>
    ) {
      const { habitId, taskId, day, value } = action.payload;

      const habit = state.habits.find((h) => h.id === habitId);

      if (!habit) return;

      if (!habit.progress) {
        habit.progress = {};
      }

      if (!habit.progress[day]) {
        habit.progress[day] = {};
      }

      const task = habit.tasks.find((t) => t.id === taskId);

      if (!task) return;

      const completed =
        task.type === "boolean" ? value >= 1 : value >= task.target;

      habit.progress[day][taskId] = {
        value,
        completed,
      };

      // ✅ recompute streak from progress
      const sortedDays = Object.keys(habit.progress).sort();

      let currentStreak = 0;

      for (let i = sortedDays.length - 1; i >= 0; i--) {
        const currentDay = sortedDays[i];

        const allCompleted = habit.tasks.every((taskItem) => {
          return habit.progress?.[currentDay]?.[taskItem.id]?.completed;
        });

        if (!allCompleted) {
          break;
        }

        if (i === sortedDays.length - 1) {
          currentStreak = 1;

          continue;
        }

        const prevDate = new Date(sortedDays[i + 1]);

        const currentDate = new Date(currentDay);

        const diff =
          (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
          currentStreak += 1;
        } else {
          break;
        }
      }

      habit.streak = currentStreak;
    },

    updateReflection: (
      state,
      action: PayloadAction<{ dayKey: string; reflection: string }>
    ) => {
      const { dayKey, reflection } = action.payload;
      if (state.yearlyData[dayKey]) {
        state.yearlyData[dayKey].reflection = reflection;
      }
    },

    resetTracker: () => initialState,
    importTracker: (_state, action: PayloadAction<TrackerState>) => {
      return action.payload;
    },
    importMerge: (state, action: PayloadAction<TrackerState>) => {
      const incoming = action.payload;      
      const yearlyData = { ...state.yearlyData };

      Object.entries(incoming.yearlyData || {}).forEach(([date, newDay]) => {
        const oldDay = yearlyData[date];

        yearlyData[date] = {
          ...oldDay,
          ...newDay,
          todos: [...(oldDay?.todos || []), ...(newDay?.todos || [])],
          prayers: {
            ...(oldDay?.prayers || {}),
            ...(newDay?.prayers || {}),
          },
          Quran: newDay?.Quran ?? oldDay?.Quran ?? 0,
          reflection: newDay?.reflection ?? oldDay?.reflection ?? "",
        };
      });

      const habitsMap = new Map<string, Habit>();

      state.habits.forEach((habit) => {
        habitsMap.set(habit.id, habit);
      });

      (incoming.habits || []).forEach((habit) => {
        const existing = habitsMap.get(habit.id);

        if (!existing) {
          habitsMap.set(habit.id, habit);
        } else {
          habitsMap.set(habit.id, {
            ...existing,
            ...habit,

            tasks: habit.tasks?.length ? habit.tasks : existing.tasks,

            progress: {
              ...(existing.progress || {}),
              ...(habit.progress || {}),
            },
          });
        }
      });

      return {
        ...state,
        yearlyData,
        habits: Array.from(habitsMap.values()),
      };
    },

    // importMerge: (state, action: PayloadAction<TrackerState>) => {
    //   const incoming = action.payload;

    //   const yearlyData = { ...state.yearlyData };

    //   Object.entries(incoming.yearlyData || {}).forEach(([date, newDay]) => {
    //     const oldDay = yearlyData[date];

    //     yearlyData[date] = {
    //       ...oldDay,
    //       ...newDay,
    //       todos: [...(oldDay?.todos || []), ...(newDay?.todos || [])],
    //       prayers: {
    //         ...(oldDay?.prayers || {}),
    //         ...(newDay?.prayers || {}),
    //       },
    //       Quran: newDay?.Quran ?? oldDay?.Quran ?? 0,
    //       reflection: newDay?.reflection ?? oldDay?.reflection ?? "",
    //     };
    //   });

    //   const habitsMap = new Map();

    //   state.habits.forEach((h) => habitsMap.set(h.id, h));

    //   (incoming.habits || []).forEach((h) => {
    //     const existing = habitsMap.get(h.id);

    //     if (!existing) {
    //       habitsMap.set(h.id, h);
    //     } else {
    //       habitsMap.set(h.id, {
    //         ...existing,
    //         ...h,
    //         completed: {
    //           ...existing.completed,
    //           ...h.completed,
    //         },
    //       });
    //     }
    //   });

    //   return {
    //     ...state,
    //     yearlyData,
    //     habits: Array.from(habitsMap.values()),
    //   };
    // },

    updateDayEntry: (state, action: PayloadAction<{ date: string }>) => {
      state.yearlyData[action.payload.date].isFinished = false;
    },

    welcomeSlidesSlice: (state, action: PayloadAction) => {
      state.onboarding_completed = true;
    },
  },
});

export const {
  addTodoAction,
  toggleTodoAction,
  deleteTodoAction,
  updateQuranTime,
  createDate,
  finishDay,
  addPrayer,
  updateReflection,
  addHabit,
  updateHabitTaskProgress,
  updateHabit,
  deleteHabit,
  resetTracker,
  importTracker,
  updateDayEntry,
  importMerge,
  welcomeSlidesSlice,
} = trackerSlice.actions;
export default trackerSlice.reducer;
