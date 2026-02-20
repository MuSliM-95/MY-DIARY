export type View = "BOARD" | "DAY_DETAILS" | "HOME" | "PROGRESS";

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
}
