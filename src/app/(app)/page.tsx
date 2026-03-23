"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Check, Target, Flame, TrendingUp, ListTodo, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, todayString, calcOkrProgress, daysUntil, formatDateShort } from "@/lib/utils";
import { isDateOverdue } from "@/lib/todo-utils";
import Link from "next/link";
import { format } from "date-fns";

interface HabitLog { id: string; date: string; completed: boolean }
interface Habit { id: string; title: string; icon: string; logs: HabitLog[] }
interface KeyResult { currentValue: number; targetValue: number; weight: number }
interface Objective { id: string; title: string; deadline: string; keyResults: KeyResult[] }
interface Todo { id: string; title: string; dueDate: string | null; priority: number; completed: boolean }

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [todayTodos, setTodayTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const today = todayString();
    const [habitsRes, okrRes, todosRes] = await Promise.all([
      fetch(`/api/habits?today=true&date=${encodeURIComponent(today)}`),
      fetch("/api/okr"),
      fetch(`/api/todos?due=today&date=${encodeURIComponent(today)}`),
    ]);
    if (habitsRes.ok) setHabits(await habitsRes.json());
    if (okrRes.ok) setObjectives(await okrRes.json());
    if (todosRes.ok) setTodayTodos(await todosRes.json());
    setLoading(false);
  }

  async function toggleTodo(todo: Todo) {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTodayTodos((prev) => prev.filter((t) => t.id !== updated.id));
    }
  }

  async function handleCheckIn(habitId: string, doneToday: boolean) {
    const today = todayString();
    // Optimistic update
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        return {
          ...h,
          logs: doneToday
            ? h.logs.filter((l) => !(l.date === today && l.completed))
            : [...h.logs.filter((l) => l.date !== today), { id: "optimistic", date: today, completed: true }],
        };
      })
    );
    await fetch(`/api/habits/${habitId}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !doneToday, date: today }),
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
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-800 dark:text-stone-100 italic font-serif">Dashboard</h1>
          <p className="text-stone-400 font-medium mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-4 py-1.5 text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50 shadow-sm rounded-full">
            ✨ {habits.length > 0 ? `${Math.round(habitRate / 10)} day streak` : "Begin gently"}
          </Badge>
        </div>
      </div>

      {/* Stats row with light, airy cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Today's Habits", value: `${completedToday.length}/${habits.length}`, icon: Check, color: "text-emerald-500", bg: "bg-emerald-50/50" },
          { label: "Active OKRs", value: objectives.length, icon: Target, color: "text-sky-500", bg: "bg-sky-50/50" },
          { label: "Completion Rate", value: `${habitRate}%`, icon: Flame, color: "text-rose-400", bg: "bg-rose-50/50" },
        ].map((stat, i) => (
          <Card key={i} className="hover-lift border-stone-100/50 dark:border-stone-800 shadow-soft bg-white/40 dark:bg-stone-900/40 backdrop-blur-sm overflow-hidden border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{stat.label}</span>
              </div>
              <p className="text-3xl font-light text-stone-800 dark:text-stone-100 tracking-tighter">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Today's habits */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold text-stone-700 dark:text-stone-200 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Daily Rituals
              </h2>
              <Link href="/habits" className="text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-widest">
                Edit Habits
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-2xl bg-stone-100/50 animate-pulse" />)
              ) : habits.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-stone-50/50 rounded-3xl border border-dashed border-stone-200">
                  <p className="text-stone-400 text-sm italic">"The secret of your future is hidden in your daily routine."</p>
                </div>
              ) : (
                habits.map((habit) => {
                  const doneToday = habit.logs.some((l) => l.date === today && l.completed);
                  return (
                    <button
                      key={habit.id}
                      onClick={() => handleCheckIn(habit.id, doneToday)}
                      className={cn(
                        "flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group",
                        doneToday
                          ? "bg-emerald-50/40 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30"
                          : "bg-white dark:bg-stone-900/40 border-stone-100 dark:border-stone-800 hover:border-stone-200 shadow-sm"
                      )}
                    >
                      <div className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center border-2 transition-all shrink-0",
                        doneToday 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : "border-stone-200 dark:border-stone-700 group-hover:border-stone-300"
                      )}>
                        {doneToday && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xl leading-none">{habit.icon}</span>
                      <span className={cn(
                        "text-sm font-medium flex-1 transition-colors",
                        doneToday ? "text-emerald-700 dark:text-emerald-400" : "text-stone-600 dark:text-stone-300"
                      )}>
                        {habit.title}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* Today's Todos */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold text-stone-700 dark:text-stone-200 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                Focus of the Day
              </h2>
              <Link href="/todos" className="text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-widest">
                View List
              </Link>
            </div>
            {loading ? (
              <div className="h-16 rounded-3xl bg-stone-100/50 animate-pulse" />
            ) : todayTodos.length === 0 ? (
              <div className="bg-white/40 dark:bg-stone-900/40 rounded-3xl border border-dashed border-stone-200 dark:border-stone-700 p-6 text-center">
                <p className="text-stone-400 text-sm italic">No tasks due today.</p>
              </div>
            ) : (
              <div className="bg-white/40 dark:bg-stone-900/40 rounded-3xl border border-stone-100 dark:border-stone-800 p-2 shadow-soft">
                {todayTodos.map((todo) => {
                  const isOverdue = todo.dueDate ? !todo.completed && isDateOverdue(todo.dueDate) : false;
                  return (
                    <div
                      key={todo.id}
                      className={cn(
                        "group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200",
                        todo.completed ? "opacity-40" : "hover:bg-stone-50/50 dark:hover:bg-stone-800/30"
                      )}
                    >
                      <button
                        className={cn(
                          "h-5 w-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0",
                          todo.completed
                            ? "bg-stone-400 border-stone-400 text-white"
                            : "border-stone-200 dark:border-stone-700 group-hover:border-sky-300"
                        )}
                        onClick={() => toggleTodo(todo)}
                      >
                        {todo.completed && <Check className="h-3 w-3 stroke-[3]" />}
                      </button>
                      <span className={cn(
                        "text-sm font-medium flex-1 text-stone-600 dark:text-stone-300",
                        todo.completed && "line-through text-stone-400"
                      )}>
                        {todo.title}
                      </span>
                      {todo.dueDate && isOverdue && (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Overdue</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Side Column */}
        <div className="space-y-10">
          {/* Milestone targets */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-stone-700 dark:text-stone-200 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              North Star
            </h2>
            <Card className="border-stone-100/50 dark:border-stone-800 shadow-soft bg-white/40 dark:bg-stone-900/40 backdrop-blur-sm border-none">
              <CardContent className="pt-6 space-y-6">
                {urgentOkrs.length > 0 ? urgentOkrs.map((obj) => {
                  const progress = calcOkrProgress(obj.keyResults);
                  return (
                    <div key={obj.id} className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{daysUntil(obj.deadline)} days to go</span>
                          <span className="text-xs font-bold text-stone-600 dark:text-stone-300">{progress}%</span>
                        </div>
                        <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-200 line-clamp-1">{obj.title}</h4>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-stone-100 dark:bg-stone-800" />
                    </div>
                  );
                }) : (
                  <p className="text-sm text-stone-400 italic py-4">No active milestones.</p>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Elegant Motivation Card */}
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-emerald-900/10 dark:to-sky-900/10 border border-white dark:border-stone-800/50 shadow-soft relative overflow-hidden group">
            <div className="relative z-10">
              <div className="h-8 w-8 rounded-full bg-white/80 dark:bg-stone-800/50 flex items-center justify-center mb-4 shadow-sm">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <h3 className="text-lg font-serif italic text-stone-800 dark:text-stone-200 mb-2">Inner Peace</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed italic">
                "One step at a time, one breath at a time."
              </p>
            </div>
            {/* Soft decorative circles */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-100/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </div>
  );
}
