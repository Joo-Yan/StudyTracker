"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { Plus, ExternalLink, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CreateContentDialog } from "@/components/content/create-content-dialog";
import { TagFilter } from "@/components/shared/tag-filter";

interface ContentItem {
  id: string;
  title: string;
  url?: string;
  description?: string;
  type: string;
  status: string;
  priority: number;
  rating?: number;
  source?: string;
  tags: string[];
}

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "want_to_learn", label: "Want to Learn" },
  { key: "learning", label: "Learning" },
  { key: "completed", label: "Completed" },
];

const STATUS_NEXT: Record<string, string> = {
  want_to_learn: "learning",
  learning: "completed",
};

const TYPE_ICONS: Record<string, string> = {
  article: "📄",
  video: "🎥",
  book: "📚",
  course: "🎓",
  podcast: "🎙️",
  other: "📎",
};

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagKey, setTagKey] = useState(0);

  const fetchItems = useCallback(async () => {
    const url = selectedTag ? `/api/content?tag=${encodeURIComponent(selectedTag)}` : "/api/content";
    const res = await fetch(url);
    setItems(await res.json());
    setLoading(false);
  }, [selectedTag]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  async function advanceStatus(item: ContentItem) {
    const next = STATUS_NEXT[item.status];
    if (!next) return;
    await fetch(`/api/content/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    fetchItems();
  }

  async function deleteItem(id: string) {
    await fetch(`/api/content/${id}`, { method: "DELETE" });
    fetchItems();
  }

  const filtered =
    tab === "all" ? items : items.filter((i) => i.status === tab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {items.filter((i) => i.status === "completed").length} completed · {items.length} total
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add content
        </Button>
      </div>

      <TagFilter entity="content" selected={selectedTag} onSelect={setSelectedTag} refreshKey={tagKey} />

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-3 py-2 text-sm transition-colors border-b-2 -mb-px",
              tab === t.key
                ? "border-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            <span className="ml-1.5 text-xs text-muted-foreground">
              {t.key === "all"
                ? items.length
                : items.filter((i) => i.status === t.key).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl border bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-muted-foreground mb-3">Nothing here yet</p>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Add content
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-card hover:bg-secondary/20 transition-colors"
            >
              <span className="text-lg shrink-0">{TYPE_ICONS[item.type] ?? "📎"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                )}
                {item.tags.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.status === "completed" && item.rating && (
                  <div className="flex items-center gap-0.5 text-xs text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    {item.rating}
                  </div>
                )}
                {STATUS_NEXT[item.status] && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => advanceStatus(item)}
                  >
                    {item.status === "want_to_learn" ? "Start" : "Complete"}
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteItem(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateContentDialog open={open} onOpenChange={setOpen} onCreated={() => { fetchItems(); setTagKey((k) => k + 1); }} />
    </div>
  );
}
