"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatsResponse } from "@/lib/stats";

interface Props {
  data: StatsResponse["activity"];
}

export function OverviewStats({ data }: Props) {
  const maxCount = Math.max(...data.dailyActivity.map((d) => d.count), 1);

  function getColor(count: number) {
    if (count === 0) return "bg-muted";
    const intensity = count / maxCount;
    if (intensity <= 0.25) return "bg-green-200 dark:bg-green-900";
    if (intensity <= 0.5) return "bg-green-400 dark:bg-green-700";
    if (intensity <= 0.75) return "bg-green-500 dark:bg-green-500";
    return "bg-green-600 dark:bg-green-400";
  }

  // Arrange into columns of 7 (weeks)
  const weeks: (typeof data.dailyActivity)[] = [];
  for (let i = 0; i < data.dailyActivity.length; i += 7) {
    weeks.push(data.dailyActivity.slice(i, i + 7));
  }

  const totalActivity = data.dailyActivity.reduce((s, d) => s + d.count, 0);
  const activeDays = data.dailyActivity.filter((d) => d.count > 0).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Activity Heatmap
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {totalActivity} total actions across {activeDays} active days
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} action${day.count !== 1 ? "s" : ""}`}
                  className={`h-3 w-3 rounded-sm ${getColor(day.count)} cursor-default`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="h-3 w-3 rounded-sm bg-muted" />
          <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900" />
          <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
          <div className="h-3 w-3 rounded-sm bg-green-500 dark:bg-green-500" />
          <div className="h-3 w-3 rounded-sm bg-green-600 dark:bg-green-400" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
