"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Check, Target, Flame, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, todayString, calcOkrProgress, daysUntil, formatDateShort } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";

interface HabitLog { id: string; date: string; completed: boolean }
interface Habit { id: string; title: string; icon: string; logs: HabitLog[] }
interface KeyResult { currentValue: number; targetValue: number; weight: number }
interface Objective { id: string; title: string; deadline: string; keyResults: KeyResult[] }

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const [habitsRes, okrRes] = await Promise.all([
      fetch("/api/habits?today=true"),
      fetch("/api/okr"),
    ]);
    setHabits(await habitsRes.json());
    setObjectives(await okrRes.json());
    setLoading(false);
  }

  async function handleCheckIn(habitId: string, doneToday: boolean) {
    await fetch(`/api/habits/${habitId}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !doneToday }),
    });
    fetchData();
  }

  useEffect(() => { fetchData(); }, []);

  const today = todayString();
  const completedToday = habits.filter((h) =>
    h.logs.some((l) => l.date === today && l.completed)
  );
  const habitRate = habits.length > 0
    ? Math.round((completedToday.length / habits.length) * 100)
    : 0;

  const urgentOkrs = objectives
    .filter((o) => daysUntil(o.deadline) >= 0 && daysUntil(o.deadline) <= 30)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Check className="h-4 w-4" />
              Today&apos;s habits
            </div>
            <p className="text-2xl font-bold">
              {completedToday.length}
              <span className="text-base font-normal text-muted-foreground">
                /{habits.length}
              </span>
            </p>
            <Progress value={habitRate} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Target className="h-4 w-4" />
              Active OKRs
            </div>
            <p className="text-2xl font-bold">{objectives.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Flame className="h-4 w-4" />
              Completion rate
            </div>
            <p className="text-2xl font-bold">{habitRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's habits quick check-in */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Today&apos;s Habits</CardTitle>
          <Link href="/habits">
            <Button variant="ghost" size="sm" className="text-xs">View all →</Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-10 rounded-lg bg-muted/30 animate-pulse" />
              ))}
            </div>
          ) : habits.length === 0 ? (
            <p className="text-sm text-muted-foreground py-3 text-center">
              No habits yet.{" "}
              <Link href="/habits" className="text-foreground underline">Add one →</Link>
            </p>
          ) : (
            habits.map((habit) => {
              const doneToday = habit.logs.some(
                (l) => l.date === today && l.completed
              );
              return (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/30"
                >
                  <button
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center border-2 transition-colors shrink-0",
                      doneToday
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    )}
                    onClick={() => handleCheckIn(habit.id, doneToday)}
                  >
                    {doneToday && <Check className="h-3 w-3" />}
                  </button>
                  <span>{habit.icon}</span>
                  <span
                    className={cn(
                      "text-sm flex-1",
                      doneToday && "line-through text-muted-foreground"
                    )}
                  >
                    {habit.title}
                  </span>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Upcoming OKRs */}
      {urgentOkrs.length > 0 && (
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
            <Link href="/okr">
              <Button variant="ghost" size="sm" className="text-xs">View all →</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentOkrs.map((obj) => {
              const progress = calcOkrProgress(obj.keyResults);
              const days = daysUntil(obj.deadline);
              return (
                <div key={obj.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <TrendingUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium truncate">{obj.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={days <= 7 ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {formatDateShort(obj.deadline)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{progress}%</span>
                    </div>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
