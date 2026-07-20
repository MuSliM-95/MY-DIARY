"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { View } from "./types/types";
import { createDate } from "@/store/hooks/trackerSlice";

interface UseTrackerDataProps {
  activeDay: number;
  currentMonth: number;
  setActiveDay: (day: number) => void;
  setView: (view: View) => void;
}

export const useTrackerData = ({
  activeDay,
  currentMonth,
  setActiveDay,
  setView,
}: UseTrackerDataProps) => {
  const dispatch = useAppDispatch();
  const dataState = useAppSelector((state) => state.tracker);

  const date = new Date();
  const year = date.getFullYear();
  const deyDate = date.getDate();

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(deyDate).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  const activeDate = `${year}-${String(currentMonth + 1).padStart(2, "0")}-${String(
    activeDay
  ).padStart(2, "0")}`;

  const count = Object.entries(dataState.yearlyData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .reduce(
      (acc, [key, isFinished], index, arr) => {
        if (!isFinished.isFinished) {
          acc.curr = 0;
          return acc;
        }

        if (index === 0) {
          acc.curr = 1;
        } else {
          const prevDate = new Date(arr[index - 1][0]);
          const currDate = new Date(key);
          const diffDays =
            (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

          acc.curr = diffDays === 1 ? acc.curr + 1 : 1;
        }

        acc.max = Math.max(acc.max, acc.curr);
        acc.QuranCount += isFinished.Quran;

        return acc;
      },
      { max: 0, curr: 0, QuranCount: 0 }
    );

  const createDay = useCallback(
    (d: number) => {
      const day = String(d).padStart(2, "0");
      const month = String(currentMonth + 1).padStart(2, "0");
      const dayKey = `${year}-${month}-${day}`;

      console.log(day);
      

      if (dayKey <= today) {
        dispatch(createDate({ dayKey }));
        setActiveDay(d);
        setView("DAY_DETAILS");
      }
    },
    [currentMonth, year, today, dispatch, setActiveDay, setView]
  );

  return {
    dataState: dataState.yearlyData,
    habits: dataState.habits,
    today,
    deyDate,
    year,
    count,
    createDay,
    activeDate,
  };
};
