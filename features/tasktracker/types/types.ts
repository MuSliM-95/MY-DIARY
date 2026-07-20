export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface HabitProgress {
  completed: boolean;
  value: number;
}

export interface DayEntry {
  isFinished: boolean;
  todos: Todo[];
  Quran: number;
  reflection: string;
}

export type View =
  | "BOARD"
  | "DAY_DETAILS"
  | "PROGRESS"
  | "THOUGHTS"
  | "PROFILE"
  | "LEGAL"
  | "PARTNERS";

export interface Task {
  id: number;
  text: string;
  completed: boolean;
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

export type Period = "day" | "month" | "halfyear" | "year" | "all";
export type ExportBlockKey = "cards" | "habits" | "summary";
