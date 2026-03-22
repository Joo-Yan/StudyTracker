"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatsResponse } from "@/lib/stats";

interface Props {
  data: StatsResponse["habits"];
}

export function HabitsStats({ data }: Props) {
  if (data.streaks.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        No habits tracked yet. Start by creating a habit!
      </div>
    );
  }

  const completionData = data.completionOverTime.map((d) => ({
    ...d,
    date: d.date.slice(5), // MM-DD
  }));

  const weeklyData = data.weeklyPattern;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Completion Rate Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Completion"]}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Streaks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[220px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-2 text-left font-medium">Habit</th>
                  <th className="pb-2 text-right font-medium">Current</th>
                  <th className="pb-2 text-right font-medium">Longest</th>
                </tr>
              </thead>
              <tbody>
                {data.streaks
                  .sort((a, b) => b.current - a.current)
                  .map((s) => (
                    <tr key={s.habitId} className="border-b last:border-0">
                      <td className="py-2">
                        <span className="mr-1">{s.icon}</span>
                        {s.title}
                      </td>
                      <td className="py-2 text-right font-mono">
                        {s.current}d
                      </td>
                      <td className="py-2 text-right font-mono text-muted-foreground">
                        {s.longest}d
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Habit Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data.habitPerformance.slice(0, 8)}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="title"
                width={100}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Rate"]}
              />
              <Bar dataKey="rate" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Weekly Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: number) => [value, "Avg completions"]}
              />
              <Bar
                dataKey="avgCompletions"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
