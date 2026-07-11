// import { Habit } from "../types/types";

// export function calculateStreak(progress: Habit["progress"]) {
// 	const dates = Object.keys(progress || {})
// 	  .filter((date) =>
// 		Object.values(progress[date] || {}).some((t) => t.completed)
// 	  )
// 	  .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
// 	let streak = 0;
// 	let current = new Date();
  
// 	for (const date of dates) {
// 	  const d = new Date(date);
  
// 	  const diffDays = Math.floor(
// 		(current.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
// 	  );
  
// 	  if (diffDays <= 1) {
// 		streak++;
// 		current = d;
// 	  } else {
// 		break;
// 	  }
// 	}
  
// 	return streak;
//   }
  
//   export function getTotalValueForDay(
// 	progress: Habit["progress"],
// 	date: string
//   ) {
// 	const day = progress?.[date] || {};
  
// 	return Object.values(day).reduce((sum, task) => {
// 	  return sum + (task.value || 0);
// 	}, 0);
//   }