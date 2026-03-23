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

const PRIORITIES = [
  { value: 1, label: "High" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Low" },
];

export function CreateTodoDialog({ open, onOpenChange, onCreated }: Props) {
  const formId = "create-todo-form";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(2);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function reset() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority(2);
    setTags([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || null,
        dueDate: dueDate || null,
        priority,
        tags,
      }),
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
        <h2 className="font-semibold">New todo</h2>
      </ModalShellHeader>
      <form id={formId} onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <ModalShellBody className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="e.g. Read chapter 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              placeholder="Add details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Due date (optional)</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPriority(value)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    priority === value
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
            <TagInput entity="todos" value={tags} onChange={setTags} />
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
              {loading ? "Creating..." : "Create todo"}
            </Button>
          </div>
        </ModalShellFooter>
      </form>
    </ModalShell>
  );
}
