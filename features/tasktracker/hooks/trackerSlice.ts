"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DayEntry, Todo } from "../types/types";

// Твой интерфейс без изменений

interface TrackerState {
  // Структура: { "1-16": { isFinished: true, todos: [...] } }
  yearlyData: Record<string, DayEntry>;
}

const initialState: TrackerState = {
  yearlyData: {},
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
          prayers: {},
          Quran: 0,
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

      state.yearlyData[dayKey]!.Quran = action.payload.minutes;
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
        };
      } else {
        state.yearlyData[dayKey].isFinished = true;
      }
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
} = trackerSlice.actions;
export default trackerSlice.reducer;
