export type Period = "day" | "month" | "halfyear" | "year" | "all";
export type ExportBlockKey = "cards" | "habits" | "summary";

export interface HabitProgress {
  completed: boolean;
  value: number;
}

export interface DayEntry {
  isFinished: boolean;
  todos: any[];
  prayers: { [key: string]: boolean };
  Quran: number;
  reflection: string;
  habitsCompleted: boolean;
}
