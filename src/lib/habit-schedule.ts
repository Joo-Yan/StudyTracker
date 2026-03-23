type HabitSchedule = {
  frequencyType?: string | null;
  frequencyDays?: number[] | null;
};

export function isHabitScheduledToday(habit: HabitSchedule, todayDow: number): boolean {
  if (habit.frequencyType === "daily") return true;

  if (habit.frequencyType === "weekly") {
    const frequencyDays = Array.isArray(habit.frequencyDays) ? habit.frequencyDays : [];
    return frequencyDays.length === 0 || frequencyDays.includes(todayDow);
  }

  // Monthly habits are always shown until day-of-month scheduling exists.
  return true;
}
