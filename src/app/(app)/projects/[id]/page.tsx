"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Check, ChevronDown, ChevronRight, Send, BookOpen, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  notes?: string;
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
  const [notes, setNotes] = useState("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function fetchProject() {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) return;
    const found = await res.json();
    setProject(found);
    setNotes(found.notes ?? "");
    setExpanded(new Set(found.milestones.map((m: Milestone) => m.id)));
  }

  useEffect(() => { fetchProject(); }, [id]);
  useEffect(() => () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); }, []);

  async function saveNotes(value: string) {
    if (!project) return;
    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: value }),
    });
  }

  function handleNotesChange(value: string) {
    setNotes(value);
    // Debounce save: 1s after last keystroke
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveNotes(value), 1000);
  }

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
    // Optimistic update
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        milestones: prev.milestones.map((ms) => ({
          ...ms,
          tasks: ms.tasks.map((t) => t.id === taskId ? { ...t, status: next } : t),
        })),
      };
    });
    await fetch(`/api/projects/${project.id}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
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

      <Tabs defaultValue="notebook">
        <TabsList className="mb-4">
          <TabsTrigger value="notebook" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Notebook
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notebook">
          <Card>
            <CardContent className="pt-4">
              <textarea
                className="w-full min-h-[400px] resize-y bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none font-mono leading-relaxed"
                placeholder="Write your notes here... (Markdown supported)

# Ideas
-

## Next Steps
- "
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-3">
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
                        className="flex items-center gap-3 py-1.5 cursor-pointer"
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
        </TabsContent>
      </Tabs>

      {/* Progress Log */}
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
