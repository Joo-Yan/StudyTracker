"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { Plus, Circle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn, calcProgress, formatDateShort, daysUntil } from "@/lib/utils";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { TagFilter } from "@/components/shared/tag-filter";
import Link from "next/link";

interface Task { id: string; status: string }
interface Milestone { id: string; tasks: Task[] }
interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  color: string;
  targetDate?: string;
  tags: string[];
  milestones: Milestone[];
}

function projectProgress(project: Project): number {
  const allTasks = project.milestones.flatMap((m) => m.tasks);
  if (allTasks.length === 0) return 0;
  const done = allTasks.filter((t) => t.status === "done").length;
  return calcProgress(done, allTasks.length);
}

const STATUS_GROUPS = [
  { key: "active", label: "Active" },
  { key: "planning", label: "Planning" },
  { key: "paused", label: "Paused" },
  { key: "completed", label: "Completed" },
];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-blue-100 text-blue-700",
  planning: "bg-yellow-100 text-yellow-700",
  paused: "bg-gray-100 text-gray-600",
  completed: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-400",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagKey, setTagKey] = useState(0);

  const fetchProjects = useCallback(async () => {
    const url = selectedTag ? `/api/projects?tag=${encodeURIComponent(selectedTag)}` : "/api/projects";
    const res = await fetch(url);
    setProjects(await res.json());
    setLoading(false);
  }, [selectedTag]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const grouped = STATUS_GROUPS.map((g) => ({
    ...g,
    items: projects.filter((p) => p.status === g.key),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {projects.filter((p) => p.status === "active").length} active
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </div>

      <TagFilter entity="projects" selected={selectedTag} onSelect={setSelectedTag} refreshKey={tagKey} />

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl border bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-3">No projects yet</p>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Start a project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.key}>
              <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                {group.label}
              </h2>
              <div className="space-y-3">
                {group.items.map((project) => {
                  const pct = projectProgress(project);
                  const allTasks = project.milestones.flatMap((m) => m.tasks);
                  const doneTasks = allTasks.filter((t) => t.status === "done").length;
                  const days = project.targetDate ? daysUntil(project.targetDate) : null;

                  return (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <Card className="hover:bg-secondary/20 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                              style={{ backgroundColor: project.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-medium truncate">{project.title}</p>
                                <div className="flex items-center gap-2 shrink-0">
                                  {days !== null && (
                                    <span
                                      className={cn(
                                        "text-xs",
                                        days < 0
                                          ? "text-destructive"
                                          : days <= 7
                                          ? "text-orange-600"
                                          : "text-muted-foreground"
                                      )}
                                    >
                                      {days < 0
                                        ? `${Math.abs(days)}d overdue`
                                        : days === 0
                                        ? "Due today"
                                        : `${days}d left`}
                                    </span>
                                  )}
                                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                              </div>
                              {project.description && (
                                <p className="text-sm text-muted-foreground truncate mt-0.5">
                                  {project.description}
                                </p>
                              )}
                              {project.tags.length > 0 && (
                                <div className="flex gap-1 mt-1.5 flex-wrap">
                                  {project.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">{tag}</Badge>
                                  ))}
                                </div>
                              )}
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>
                                    {doneTasks}/{allTasks.length} tasks
                                  </span>
                                  <span>{pct}%</span>
                                </div>
                                <Progress value={pct} className="h-1.5" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateProjectDialog open={open} onOpenChange={setOpen} onCreated={() => { fetchProjects(); setTagKey((k) => k + 1); }} />
    </div>
  );
}
