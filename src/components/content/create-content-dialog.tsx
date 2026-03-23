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

const TYPES = ["article", "video", "book", "course", "podcast", "other"];

export function CreateContentDialog({ open, onOpenChange, onCreated }: Props) {
  const formId = "create-content-form";
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("article");
  const [priority, setPriority] = useState(2);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function reset() {
    setTitle("");
    setUrl("");
    setDescription("");
    setType("article");
    setPriority(2);
    setTags([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url: url || undefined, description, type, priority, tags }),
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
        <h2 className="font-semibold">Add to library</h2>
      </ModalShellHeader>
      <form id={formId} onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <ModalShellBody className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="e.g. Clean Code by Robert Martin"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>URL (optional)</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Why do you want to learn this?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
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
            <TagInput entity="content" value={tags} onChange={setTags} />
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
              {loading ? "Adding..." : "Add to library"}
            </Button>
          </div>
        </ModalShellFooter>
      </form>
    </ModalShell>
  );
}
