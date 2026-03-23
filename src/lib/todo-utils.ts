import { format } from "date-fns";
import { todayString } from "@/lib/utils";

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateOnly(value: string) {
  if (!DATE_ONLY_RE.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const normalized = new Date(Date.UTC(year, month - 1, day));

  return (
    normalized.getUTCFullYear() === year &&
    normalized.getUTCMonth() === month - 1 &&
    normalized.getUTCDate() === day
  );
}

export function parseDateOnlyToUtcDate(value: string) {
  if (!isValidDateOnly(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function dateOnlyString(date: Date | string) {
  if (typeof date === "string" && DATE_ONLY_RE.test(date)) return date;

  const normalized = typeof date === "string" ? new Date(date) : date;
  const year = normalized.getUTCFullYear();
  const month = String(normalized.getUTCMonth() + 1).padStart(2, "0");
  const day = String(normalized.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatTodoDueDate(date: Date | string) {
  const [year, month, day] = dateOnlyString(date).split("-").map(Number);
  return format(new Date(year, month - 1, day), "MMM d, yyyy");
}

export function isDateOverdue(date: Date | string, today = todayString()) {
  return dateOnlyString(date) < today;
}

export function getUtcDayBounds(value: string) {
  const start = parseDateOnlyToUtcDate(value);
  if (!start) return null;

  const end = new Date(start);
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
}
