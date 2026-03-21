"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Check, ChevronDown, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, calcProgress, formatDate } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  status: string;
}
interface Milestone {
  id: string;
  title: string;
  status: string;
  tasks: Task[];
}
interface ProjectLog {
  id: string;
  content: string;
  createdAt: string;
}
interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  color: string;
  targetDate?: string;
  milestones: Milestone[];
  logs: ProjectLog[];
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [newMilestone, setNewMilestone] = useState("");
  const [newTasks, setNewTasks] = useState<Record<string, string>>({});
  const [logContent, setLogContent] = useState("");

  async function fetchProject() {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) return;
    const found = await res.json();
    setProject(found);
    setExpanded(new Set(found.milestones.map((m: Milestone) => m.id)));
  }

  useEffect(() => { fetchProject(); }, [id]);

  async function addMilestone() {
    if (!newMilestone.trim() || !project) return;
    await fetch(`/api/projects/${project.id}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newMilestone }),
    });
    setNewMilestone("");
    fetchProject();
  }

  async function addTask(milestoneId: string) {
    const title = newTasks[milestoneId]?.trim();
    if (!title || !project) return;
    await fetch(`/api/projects/${project.id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestoneId, title }),
    });
    setNewTasks((prev) => ({ ...prev, [milestoneId]: "" }));
    fetchProject();
  }

  async function toggleTask(taskId: string, currentStatus: string) {
    if (!project) return;
    const next = currentStatus === "done" ? "todo" : "done";
    await fetch(`/api/projects/${project.id}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    fetchProject();
  }

  async function addLog() {
    if (!logContent.trim() || !project) return;
    await fetch(`/api/projects/${project.id}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: logContent }),
    });
    setLogContent("");
    fetchProject();
  }

  if (!project) return <div className="animate-pulse h-8 w-48 bg-muted rounded" />;

  const allTasks = project.milestones.flatMap((m) => m.tasks);
  const doneTasks = allTasks.filter((t) => t.status === "done").length;
  const pct = calcProgress(doneTasks, allTasks.length);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
          <h1 className="text-2xl font-bold">{project.title}</h1>
        </div>
        {project.description && (
          <p className="text-sm text-muted-foreground">{project.description}</p>
        )}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{doneTasks}/{allTasks.length} tasks done</span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} />
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Milestones</h2>
        </div>

        {project.milestones.map((ms) => {
          const msDone = ms.tasks.filter((t) => t.status === "done").length;
          const msPct = calcProgress(msDone, ms.tasks.length);
          const isOpen = expanded.has(ms.id);

          return (
            <Card key={ms.id}>
              <CardHeader
                className="py-3 cursor-pointer"
                onClick={() =>
                  setExpanded((prev) => {
                    const s = new Set(prev);
                    s.has(ms.id) ? s.delete(ms.id) : s.add(ms.id);
                    return s;
                  })
                }
              >
                <div className="flex items-center gap-2">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <CardTitle className="text-sm font-medium flex-1">{ms.title}</CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {msDone}/{ms.tasks.length} · {msPct}%
                  </span>
                </div>
                <Progress value={msPct} className="h-1 mt-1" />
              </CardHeader>

              {isOpen && (
                <CardContent className="pt-0 space-y-1">
                  {ms.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 py-1.5"
                      onClick={() => toggleTask(task.id, task.status)}
                    >
                      <button
                        className={cn(
                          "h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                          task.status === "done"
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border hover:border-primary"
                        )}
                      >
                        {task.status === "done" && <Check className="h-3 w-3" />}
                      </button>
                      <span
                        className={cn(
                          "text-sm flex-1",
                          task.status === "done" && "line-through text-muted-foreground"
                        )}
                      >
                        {task.title}
                      </span>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-1">
                    <Input
                      placeholder="Add task..."
                      value={newTasks[ms.id] ?? ""}
                      onChange={(e) =>
                        setNewTasks((prev) => ({ ...prev, [ms.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && addTask(ms.id)}
                      className="h-7 text-xs"
                    />
                    <Button size="sm" variant="ghost" className="h-7" onClick={() => addTask(ms.id)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

        <div className="flex gap-2">
          <Input
            placeholder="New milestone..."
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMilestone()}
          />
          <Button variant="outline" onClick={addMilestone}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Log */}
      <div className="space-y-3">
        <h2 className="font-semibold">Progress Log</h2>
        <div className="flex gap-2">
          <Input
            placeholder="What did you work on?"
            value={logContent}
            onChange={(e) => setLogContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addLog()}
          />
          <Button variant="outline" onClick={addLog}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {project.logs.length > 0 && (
          <div className="space-y-2">
            {project.logs.map((log) => (
              <div key={log.id} className="flex gap-3 text-sm">
                <span className="text-xs text-muted-foreground whitespace-nowrap pt-0.5">
                  {formatDate(log.createdAt)}
                </span>
                <p className="text-foreground">{log.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
