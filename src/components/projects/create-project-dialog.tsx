"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ModalShell,
  ModalShellBody,
  ModalShellFooter,
  ModalShellHeader,
} from "@/components/ui/modal-shell";
import { TagInput } from "@/components/shared/tag-input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  linkedIdeaId?: string;
  defaultTitle?: string;
}

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
];

export function CreateProjectDialog({ open, onOpenChange, onCreated, linkedIdeaId, defaultTitle }: Props) {
  const formId = "create-project-form";
  const [title, setTitle] = useState(defaultTitle ?? "");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [targetDate, setTargetDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function reset() {
    setTitle(defaultTitle ?? "");
    setDescription("");
    setColor("#6366f1");
    setTargetDate("");
    setTags([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, color, targetDate: targetDate || undefined, linkedIdeaId, tags }),
    });
    const project = await res.json();

    if (linkedIdeaId) {
      await fetch(`/api/ideas/${linkedIdeaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedProjectId: project.id }),
      });
    }

    setLoading(false);
    setTitle("");
    setDescription("");
    setColor("#6366f1");
    setTargetDate("");
    setTags([]);
    onOpenChange(false);
    onCreated();
  }

  if (!open) return null;

  return (
    <ModalShell maxWidth="md">
      <ModalShellHeader>
        <h2 className="font-semibold">New project</h2>
      </ModalShellHeader>
      <form id={formId} onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <ModalShellBody className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="e.g. Build personal website"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Target date (optional)</Label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full border-2 transition-all ${
                    color === c ? "scale-110 border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <TagInput entity="projects" value={tags} onChange={setTags} />
          </div>
        </ModalShellBody>
        <ModalShellFooter>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form={formId} className="flex-1" disabled={loading}>
              {loading ? "Creating..." : "Create project"}
            </Button>
          </div>
        </ModalShellFooter>
      </form>
    </ModalShell>
  );
}
