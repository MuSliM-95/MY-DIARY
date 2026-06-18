import { HabitProgress } from "./dashboard.type";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface DayEntry {
  isFinished: boolean;
  todos: Todo[];
  prayers: { [key: string]: boolean };
  Quran: number;
  reflection: string;
}

export type View =
  | "BOARD"
  | "DAY_DETAILS"
  | "PROGRESS"
  | "THOUGHTS"
  | "PROFILE"
  | "LEGAL";

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface DayState {
  isFinished: boolean;
  Quran: number;
  prayers: {
    [key: string]: boolean;
  };
  reflection: string;
  tasks: Task[];
}

export interface TrackerState {
  yearlyData: Record<string, DayEntry>;
  habits: Habit[];
}

export interface HabitTask {
  id: string;
  name: string;
  type: "boolean" | "duration" | "count";
  target: number;
  unit?: string;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  createdAt: string;
  category: "spiritual" | "health" | "learning" | "productivity";
  timeOfDay: "morning" | "afternoon" | "evening";

  tasks: HabitTask[];

  progress?: Record<string, Record<string, HabitProgress>>;
}

export interface IStats {
  totalTasks: number;
  completedTasks: number;
  totalPrayers: number;
  completedPrayers: number;
  totalQuran: number;
  finishedDays: number;
  habitsCompleted: number;
  longestStreak: number;
  taskCompletionRate: number;
  prayerCompletionRate: number;
}

export type SettingsView = "main" | "about" | "legal";
