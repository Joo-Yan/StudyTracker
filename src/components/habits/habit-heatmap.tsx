"use client";

import { useEffect, useState } from "react";
import { format, eachDayOfInterval, subDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface HabitLog {
  id: string;
  date: string;
  completed: boolean;
}

export function HabitHeatmap({ habitId }: { habitId: string }) {
  const [logs, setLogs] = useState<HabitLog[]>([]);

  useEffect(() => {
    fetch(`/api/habits/${habitId}/logs`)
      .then((r) => r.json())
      .then(setLogs);
  }, [habitId]);

  const today = new Date();
  const startDate = subDays(today, 90);
  const days = eachDayOfInterval({ start: startDate, end: today });
  const completedSet = new Set(logs.map((l) => l.date));

  // Group days by week (columns)
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  days.forEach((day, i) => {
    currentWeek.push(day);
    if (day.getDay() === 6 || i === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const completedCount = logs.length;
  const totalDays = days.length;
  const rate = Math.round((completedCount / totalDays) * 100);

  return (
    <div className="space-y-3">
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{completedCount} completions</span>
        <span>{rate}% rate (90d)</span>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const done = completedSet.has(dateStr);
              const isToday = dateStr === format(today, "yyyy-MM-dd");
              return (
                <div
                  key={dateStr}
                  title={`${format(day, "MMM d")}${done ? " ✓" : ""}`}
                  className={cn(
                    "w-3 h-3 rounded-sm",
                    done
                      ? "bg-primary"
                      : "bg-secondary",
                    isToday && "ring-1 ring-primary ring-offset-1"
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-secondary" />
        <div className="w-3 h-3 rounded-sm bg-primary/40" />
        <div className="w-3 h-3 rounded-sm bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
}
