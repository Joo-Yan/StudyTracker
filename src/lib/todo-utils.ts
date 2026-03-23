import { format } from "date-fns";

export function dateOnlyString(date: Date | string) {
  if (typeof date === "string") return date.slice(0, 10);
  return format(date, "yyyy-MM-dd");
}

export function isDateOverdue(date: Date | string) {
  return dateOnlyString(date) < dateOnlyString(new Date());
}
