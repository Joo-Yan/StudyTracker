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
}

const TYPES = ["project", "feature", "experiment", "thought", "other"];

export function CreateIdeaDialog({ open, onOpenChange, onCreated }: Props) {
  const formId = "create-idea-form";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("project");
  const [priority, setPriority] = useState(2);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function reset() {
    setTitle("");
    setDescription("");
    setType("project");
    setPriority(2);
    setTags([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, type, priority, tags }),
    });

    setLoading(false);
    reset();
    onOpenChange(false);
    onCreated();
  }

  if (!open) return null;

  return (
    <ModalShell maxWidth="md">
      <ModalShellHeader>
        <h2 className="font-semibold">Capture idea</h2>
      </ModalShellHeader>
      <form id={formId} onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <ModalShellBody className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="What's the idea?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label>Details (optional)</Label>
            <Textarea
              placeholder="Describe the idea, motivation, or next steps..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`rounded-md border px-2.5 py-1 text-xs capitalize transition-colors ${
                    type === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex flex-wrap gap-2">
              {[["1", "High"], ["2", "Medium"], ["3", "Low"]].map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPriority(Number(val))}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    priority === Number(val)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <TagInput entity="ideas" value={tags} onChange={setTags} />
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
              {loading ? "Saving..." : "Save idea"}
            </Button>
          </div>
        </ModalShellFooter>
      </form>
    </ModalShell>
  );
}
