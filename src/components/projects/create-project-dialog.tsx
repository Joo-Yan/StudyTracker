"use client";

import { useEffect, useState } from "react";
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
import { requestJson } from "@/lib/api-client";

export interface ProjectFormData {
  id: string;
  title: string;
  description?: string | null;
  color?: string | null;
  targetDate?: string | null;
  tags: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (saved: ProjectFormData) => void;
  linkedIdeaId?: string;
  defaultTitle?: string;
  /** When set, the dialog edits this project instead of creating a new one. */
  project?: ProjectFormData | null;
}

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
];

export function CreateProjectDialog({ open, onOpenChange, onSaved, linkedIdeaId, defaultTitle, project }: Props) {
  const formId = "create-project-form";
  const isEdit = !!project;
  const [title, setTitle] = useState(defaultTitle ?? "");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [targetDate, setTargetDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setTitle(defaultTitle ?? "");
    setDescription("");
    setColor("#6366f1");
    setTargetDate("");
    setTags([]);
  }

  useEffect(() => {
    if (!open) return;
    setTitle(project?.title ?? defaultTitle ?? "");
    setDescription(project?.description ?? "");
    setColor(project?.color ?? "#6366f1");
    setTargetDate(project?.targetDate ? project.targetDate.slice(0, 10) : "");
    setTags(project?.tags ?? []);
    setError("");
  }, [open, project, defaultTitle]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title,
      description,
      color,
      targetDate: targetDate || null,
      tags,
    };
    const { data: saved, error: submitError } = isEdit
      ? await requestJson<ProjectFormData>("PATCH", `/api/projects/${project!.id}`, payload)
      : await requestJson<ProjectFormData>("POST", "/api/projects", { ...payload, linkedIdeaId });

    if (submitError || !saved) {
      setError(submitError ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    if (!isEdit && linkedIdeaId) {
      await requestJson("PATCH", `/api/ideas/${linkedIdeaId}`, { linkedProjectId: saved.id });
    }

    setLoading(false);
    reset();
    onOpenChange(false);
    onSaved(saved);
  }

  if (!open) return null;

  return (
    <ModalShell maxWidth="md">
      <ModalShellHeader>
        <h2 className="font-semibold">{isEdit ? "Edit project" : "New project"}</h2>
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
          {error && (
            <p className="mb-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
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
              {loading
                ? isEdit ? "Saving..." : "Creating..."
                : isEdit ? "Save changes" : "Create project"}
            </Button>
          </div>
        </ModalShellFooter>
      </form>
    </ModalShell>
  );
}
