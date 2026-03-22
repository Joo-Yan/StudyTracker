"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { StatsResponse } from "@/lib/stats";

interface Props {
  data: StatsResponse["okr"];
}

const STATUS_COLORS: Record<string, string> = {
  active: "#6366f1",
  completed: "#22c55e",
  overdue: "#ef4444",
  archived: "#a1a1aa",
};

export function OkrStats({ data }: Props) {
  if (data.objectives.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        No objectives yet. Create an OKR to see analytics!
      </div>
    );
  }

  const pieData = data.statusBreakdown.map((s) => ({
    ...s,
    fill: STATUS_COLORS[s.status] ?? "#a1a1aa",
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Objective Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[300px] space-y-3 overflow-y-auto">
            {data.objectives
              .sort((a, b) => {
                if (a.status === "active" && b.status !== "active") return -1;
                if (a.status !== "active" && b.status === "active") return 1;
                return b.progress - a.progress;
              })
              .map((obj) => (
                <div key={obj.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate pr-2">{obj.title}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          obj.status === "completed"
                            ? "default"
                            : obj.status === "overdue"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {obj.status}
                      </Badge>
                      <span className="font-mono text-xs">
                        {obj.progress}%
                      </span>
                    </div>
                  </div>
                  <Progress value={obj.progress} className="h-1.5" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="count"
                nameKey="status"
                label={({ status, count }) => `${status} (${count})`}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
