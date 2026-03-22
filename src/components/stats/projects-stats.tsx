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
  data: StatsResponse["projects"];
}

const TASK_COLORS: Record<string, string> = {
  todo: "#f59e0b",
  doing: "#6366f1",
  done: "#22c55e",
};

const PROJECT_COLORS: Record<string, string> = {
  planning: "#a1a1aa",
  active: "#6366f1",
  paused: "#f59e0b",
  completed: "#22c55e",
  archived: "#71717a",
};

export function ProjectsStats({ data }: Props) {
  const hasTasks = data.tasksByStatus.length > 0;
  const hasProjects = data.projectsByStatus.length > 0;

  if (!hasTasks && !hasProjects) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        No projects yet. Create a project to see analytics!
      </div>
    );
  }

  const taskPieData = data.tasksByStatus.map((t) => ({
    ...t,
    fill: TASK_COLORS[t.status] ?? "#a1a1aa",
  }));

  const projectBarData = data.projectsByStatus.map((p) => ({
    ...p,
    fill: PROJECT_COLORS[p.status] ?? "#a1a1aa",
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Task Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasTasks ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={taskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="status"
                  label={({ status, count }) => `${status} (${count})`}
                >
                  {taskPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
              No tasks yet
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Projects by Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={projectBarData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="status" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {projectBarData.map((entry, i) => (
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
            Task Velocity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.taskVelocity.length === 0 ? (
            <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
              No completed tasks in this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.taskVelocity}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: number) => [value, "Tasks completed"]}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#6366f1"
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
