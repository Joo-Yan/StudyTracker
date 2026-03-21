"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Plus, ArrowRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CreateIdeaDialog } from "@/components/ideas/create-idea-dialog";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";

interface Idea {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  priority: number;
  tags: string[];
  linkedProjectId?: string;
}

const PRIORITY_LABELS = ["", "High", "Medium", "Low"];
const PRIORITY_COLORS = ["", "text-red-600", "text-yellow-600", "text-muted-foreground"];

const STATUS_COLORS: Record<string, string> = {
  raw: "bg-secondary text-secondary-foreground",
  evaluating: "bg-blue-100 text-blue-700",
  planned: "bg-purple-100 text-purple-700",
  in_progress: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-500",
  dropped: "bg-red-100 text-red-500",
};

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [convertIdea, setConvertIdea] = useState<Idea | null>(null);
  const router = useRouter();

  async function fetchIdeas() {
    const res = await fetch("/api/ideas");
    setIdeas(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchIdeas(); }, []);

  async function deleteIdea(id: string) {
    await fetch(`/api/ideas/${id}`, { method: "DELETE" });
    fetchIdeas();
  }

  async function handleProjectCreated() {
    fetchIdeas();
    router.push("/projects");
  }

  const active = ideas.filter((i) => !["archived", "dropped"].includes(i.status));
  const inactive = ideas.filter((i) => ["archived", "dropped"].includes(i.status));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ideas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {active.length} active ideas
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Capture idea
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl border bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-3">No ideas yet — capture them before they vanish!</p>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Capture idea
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {active.map((idea) => (
              <Card key={idea.id} className="hover:bg-secondary/20 transition-colors">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm leading-snug flex-1">{idea.title}</p>
                    <button
                      onClick={() => deleteIdea(idea.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {idea.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{idea.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          STATUS_COLORS[idea.status] ?? "bg-secondary"
                        )}
                      >
                        {idea.status.replace("_", " ")}
                      </span>
                      <span className={cn("text-xs", PRIORITY_COLORS[idea.priority])}>
                        {PRIORITY_LABELS[idea.priority]}
                      </span>
                    </div>
                    {!idea.linkedProjectId && (
                      <button
                        onClick={() => setConvertIdea(idea)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Project
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {inactive.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Archived / Dropped</h2>
              <div className="space-y-1">
                {inactive.map((idea) => (
                  <div key={idea.id} className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground text-sm">
                    <span className="flex-1 line-through">{idea.title}</span>
                    <button onClick={() => deleteIdea(idea.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <CreateIdeaDialog open={open} onOpenChange={setOpen} onCreated={fetchIdeas} />

      {convertIdea && (
        <CreateProjectDialog
          open={true}
          onOpenChange={(o) => { if (!o) setConvertIdea(null); }}
          onCreated={handleProjectCreated}
          linkedIdeaId={convertIdea.id}
          defaultTitle={convertIdea.title}
        />
      )}
    </div>
  );
}
