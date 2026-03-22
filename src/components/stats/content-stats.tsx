"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatsResponse } from "@/lib/stats";

interface Props {
  data: StatsResponse["content"];
}

const STATUS_COLORS: Record<string, string> = {
  want_to_learn: "#f59e0b",
  learning: "#6366f1",
  completed: "#22c55e",
  dropped: "#a1a1aa",
};

const TYPE_COLORS: Record<string, string> = {
  article: "#6366f1",
  video: "#ef4444",
  book: "#8b5cf6",
  course: "#22c55e",
  podcast: "#f59e0b",
  other: "#a1a1aa",
};

export function ContentStats({ data }: Props) {
  if (data.byStatus.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        No content items yet. Start collecting learning resources!
      </div>
    );
  }

  const statusData = data.byStatus.map((s) => ({
    ...s,
    label: s.status.replace(/_/g, " "),
    fill: STATUS_COLORS[s.status] ?? "#a1a1aa",
  }));

  const typeData = data.byType.map((t) => ({
    ...t,
    fill: TYPE_COLORS[t.type] ?? "#a1a1aa",
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">By Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="count"
                nameKey="label"
                label={({ label, count }) => `${label} (${count})`}
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">By Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="type" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {typeData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.completedOverTime.length === 0 ? (
            <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
              No completions yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.completedOverTime}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
