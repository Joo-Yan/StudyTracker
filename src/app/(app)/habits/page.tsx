"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { Plus, Flame, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, todayString } from "@/lib/utils";
import { CreateHabitDialog } from "@/components/habits/create-habit-dialog";
import { HabitHeatmap } from "@/components/habits/habit-heatmap";
import { TagFilter } from "@/components/shared/tag-filter";

interface HabitLog {
  id: string;
  date: string;
  completed: boolean;
}

interface Habit {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  frequencyType: string;
  tags: string[];
  logs: HabitLog[];
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagKey, setTagKey] = useState(0);

  const fetchHabits = useCallback(async () => {
    const url = selectedTag ? `/api/habits?tag=${encodeURIComponent(selectedTag)}` : "/api/habits";
    const res = await fetch(url);
    const data = await res.json();
    setHabits(data);
    setLoading(false);
  }, [selectedTag]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  async function handleCheckIn(habitId: string) {
    const habit = habits.find((h) => h.id === habitId);
    const alreadyDone = habit?.logs.some((l) => l.date === todayString() && l.completed);

    await fetch(`/api/habits/${habitId}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !alreadyDone }),
    });

    fetchHabits();
  }

  const today = todayString();
  const completedToday = habits.filter((h) =>
    h.logs.some((l) => l.date === today && l.completed)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Habits</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {completedToday}/{habits.length} completed today
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New habit
        </Button>
      </div>

      <TagFilter entity="habits" selected={selectedTag} onSelect={setSelectedTag} refreshKey={tagKey} />

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl border bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-3">No habits yet</p>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Add your first habit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {habits.map((habit) => {
            const doneToday = habit.logs.some(
              (l) => l.date === today && l.completed
            );
            return (
              <div
                key={habit.id}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors cursor-pointer",
                  doneToday
                    ? "bg-secondary/50 border-border"
                    : "bg-card hover:bg-secondary/30"
                )}
                onClick={() =>
                  setSelected(selected === habit.id ? null : habit.id)
                }
              >
                <button
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors shrink-0",
                    doneToday
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCheckIn(habit.id);
                  }}
                >
                  {doneToday && <Check className="h-4 w-4" />}
                </button>
                <span className="text-lg">{habit.icon}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      doneToday && "line-through text-muted-foreground"
                    )}
                  >
                    {habit.title}
                  </p>
                  {habit.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {habit.description}
                    </p>
                  )}
                  {habit.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {habit.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Flame className="h-3 w-3" />
                  <span>{habit.frequencyType}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {habits.find((h) => h.id === selected)?.title} — History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HabitHeatmap habitId={selected} />
          </CardContent>
        </Card>
      )}

      <CreateHabitDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={() => { fetchHabits(); setTagKey((k) => k + 1); }}
      />
    </div>
  );
}
