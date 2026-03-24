"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { Plus, Clock, TrendingUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn, calcOkrProgress, calcProgress, daysUntil, formatDate } from "@/lib/utils";
import { CreateOkrDialog } from "@/components/okr/create-okr-dialog";
import { CheckInDialog } from "@/components/okr/checkin-dialog";
import { TagFilter } from "@/components/shared/tag-filter";

interface CheckIn {
  id: string;
  value: number;
  note?: string;
  date: string;
}

interface KeyResult {
  id: string;
  title: string;
  type: string;
  targetValue: number;
  currentValue: number;
  unit?: string;
  weight: number;
  status: string;
  checkIns: CheckIn[];
}

interface OKRTask {
  id: string;
  title: string;
  status: string; // "todo" | "done"
  dueDate?: string | null;
}

interface Objective {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  status: string;
  tags: string[];
  keyResults: KeyResult[];
  tasks: OKRTask[];
}

export default function OkrPage() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [checkInKr, setCheckInKr] = useState<KeyResult | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagKey, setTagKey] = useState(0);
  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({});

  const fetchObjectives = useCallback(async () => {
    const url = selectedTag ? `/api/okr?tag=${encodeURIComponent(selectedTag)}` : "/api/okr";
    const res = await fetch(url);
    const data = await res.json();
    setObjectives(data);
    setLoading(false);
  }, [selectedTag]);

  useEffect(() => {
    fetchObjectives();
  }, [fetchObjectives]);

  async function toggleOKRTask(objectiveId: string, task: OKRTask) {
    const newStatus = task.status === "done" ? "todo" : "done";
    // Optimistic update
    setObjectives((prev) =>
      prev.map((o) =>
        o.id !== objectiveId ? o : {
          ...o,
          tasks: o.tasks.map((t) => t.id === task.id ? { ...t, status: newStatus } : t),
        }
      )
    );
    const res = await fetch(`/api/okr/${objectiveId}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      // Rollback on failure
      setObjectives((prev) =>
        prev.map((o) =>
          o.id !== objectiveId ? o : {
            ...o,
            tasks: o.tasks.map((t) => t.id === task.id ? { ...t, status: task.status } : t),
          }
        )
      );
    }
  }

  async function addOKRTask(objectiveId: string) {
    const title = newTaskInputs[objectiveId]?.trim();
    if (!title) return;
    const res = await fetch(`/api/okr/${objectiveId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const task = await res.json();
      setNewTaskInputs((prev) => ({ ...prev, [objectiveId]: "" }));
      setObjectives((prev) =>
        prev.map((o) =>
          o.id !== objectiveId ? o : { ...o, tasks: [...(o.tasks ?? []), task] }
        )
      );
    }
  }

  function getStatusBadge(obj: Objective) {
    const days = daysUntil(obj.deadline);
    const progress = calcOkrProgress(obj.keyResults);
    if (progress === 100) return { label: "Completed", variant: "default" as const };
    if (days < 0) return { label: "Overdue", variant: "destructive" as const };
    if (days <= 7) return { label: `${days}d left`, variant: "outline" as const };
    return { label: `${days}d left`, variant: "secondary" as const };
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">OKR Goals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {objectives.filter((o) => o.status === "active").length} active objectives
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New objective
        </Button>
      </div>

      <TagFilter entity="okr" selected={selectedTag} onSelect={setSelectedTag} refreshKey={tagKey} />

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-xl border bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : objectives.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-3">No objectives yet</p>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create your first objective
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {objectives.map((obj) => {
            const progress = calcOkrProgress(obj.keyResults);
            const badge = getStatusBadge(obj);
            return (
              <Card key={obj.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">{obj.title}</CardTitle>
                      {obj.description && (
                        <CardDescription className="mt-0.5">
                          {obj.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Overall progress
                      </span>
                      <span className="font-medium text-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Due {formatDate(obj.deadline)}
                    </span>
                    {obj.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">{tag}</Badge>
                    ))}
                  </div>
                  {obj.keyResults.map((kr) => {
                    const krPct = calcProgress(kr.currentValue, kr.targetValue);
                    return (
                      <div
                        key={kr.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                        onClick={() => setCheckInKr(kr)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{kr.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={krPct} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {kr.currentValue}/{kr.targetValue}
                              {kr.unit ? ` ${kr.unit}` : "%"}
                            </span>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            kr.status === "completed"
                              ? "bg-primary/10 text-primary"
                              : kr.status === "in_progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-secondary text-muted-foreground"
                          )}
                        >
                          {krPct}%
                        </span>
                      </div>
                    );
                  })}
                  {/* Tasks */}
                  <div className="mt-4 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tasks</p>
                      {(obj.tasks ?? []).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-secondary/30 cursor-pointer group"
                          onClick={() => toggleOKRTask(obj.id, task)}
                        >
                          <div className={cn(
                            "h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                            task.status === "done"
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border group-hover:border-primary"
                          )}>
                            {task.status === "done" && <Check className="h-2.5 w-2.5" />}
                          </div>
                          <span className={cn(
                            "text-sm flex-1",
                            task.status === "done" && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Add task..."
                          value={newTaskInputs[obj.id] ?? ""}
                          onChange={(e) => setNewTaskInputs((prev) => ({ ...prev, [obj.id]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === "Enter") addOKRTask(obj.id); }}
                          className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/50 py-1"
                        />
                        <button
                          onClick={() => addOKRTask(obj.id)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          + Add
                        </button>
                      </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CreateOkrDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => { fetchObjectives(); setTagKey((k) => k + 1); }}
      />

      {checkInKr && (
        <CheckInDialog
          keyResult={checkInKr}
          onClose={() => setCheckInKr(null)}
          onCreated={fetchObjectives}
        />
      )}
    </div>
  );
}
