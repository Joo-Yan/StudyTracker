"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Target,
  BookOpen,
  ListChecks,
  Lightbulb,
} from "lucide-react";
import type { StatsResponse } from "@/lib/stats";

interface Props {
  summary: StatsResponse["summary"];
}

export function StatsSummaryCards({ summary }: Props) {
  const cards = [
    {
      label: "Habit Rate",
      value: `${summary.habitCompletionRate}%`,
      sub: `${summary.totalHabits} habits tracked`,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      label: "OKR Progress",
      value: `${summary.avgOkrProgress}%`,
      sub: `${summary.activeObjectives} active objectives`,
      icon: Target,
      color: "text-indigo-500",
    },
    {
      label: "Content Done",
      value: `${summary.contentCompleted}/${summary.contentTotal}`,
      sub: "items completed",
      icon: BookOpen,
      color: "text-violet-500",
    },
    {
      label: "Tasks Done",
      value: `${summary.tasksCompleted}/${summary.tasksTotal}`,
      sub: "tasks completed",
      icon: ListChecks,
      color: "text-amber-500",
    },
    {
      label: "Ideas",
      value: `${summary.totalIdeas}`,
      sub: "total ideas captured",
      icon: Lightbulb,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <card.icon className={`h-4 w-4 ${card.color}`} />
              <span className="text-sm text-muted-foreground">
                {card.label}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
