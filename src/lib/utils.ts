import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, isToday, isPast } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateShort(date: Date | string) {
  return format(new Date(date), "MMM d");
}

export function todayString() {
  return format(new Date(), "yyyy-MM-dd");
}

export function daysUntil(date: Date | string): number {
  return differenceInDays(new Date(date), new Date());
}

export function isDateToday(date: Date | string): boolean {
  return isToday(new Date(date));
}

export function isDatePast(date: Date | string): boolean {
  return isPast(new Date(date));
}

export function calcProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

export function calcOkrProgress(
  keyResults: { currentValue: number; targetValue: number; weight: number }[]
): number {
  if (keyResults.length === 0) return 0;
  const totalWeight = keyResults.reduce((sum, kr) => sum + kr.weight, 0);
  const weightedProgress = keyResults.reduce((sum, kr) => {
    const pct = calcProgress(kr.currentValue, kr.targetValue);
    return sum + pct * kr.weight;
  }, 0);
  return Math.round(weightedProgress / totalWeight);
}
