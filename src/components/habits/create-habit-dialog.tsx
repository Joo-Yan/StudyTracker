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

export interface HabitFormData {
  id: string;
  title: string;
  description?: string | null;
  icon: string;
  color: string;
  frequencyType: string;
  frequencyDays?: number[];
  tags: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  /** When set, the dialog edits this habit instead of creating a new one. */
  habit?: HabitFormData | null;
}

const ICONS = ["✓", "📚", "🏃", "💻", "🧘", "✍️", "💪", "🎵", "🌱", "💧"];
const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
];

export function CreateHabitDialog({ open, onOpenChange, onSaved, habit }: Props) {
  const formId = "create-habit-form";
  const isEdit = !!habit;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("✓");
  const [color, setColor] = useState("#6366f1");
  const [frequencyType, setFrequencyType] = useState("daily");
  const [frequencyDays, setFrequencyDays] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(habit?.title ?? "");
    setDescription(habit?.description ?? "");
    setIcon(habit?.icon ?? "✓");
    setColor(habit?.color ?? "#6366f1");
    setFrequencyType(habit?.frequencyType ?? "daily");
    setFrequencyDays(habit?.frequencyDays ?? []);
    setTags(habit?.tags ?? []);
    setError("");
  }, [open, habit]);

  function toggleDay(day: number) {
    setFrequencyDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title,
      description,
      icon,
      color,
      frequencyType,
      frequencyDays: frequencyType === "weekly" ? frequencyDays : [],
      tags,
    };
    const { error: submitError } = isEdit
      ? await requestJson("PATCH", `/api/habits/${habit!.id}`, payload)
      : await requestJson("POST", "/api/habits", payload);

    setLoading(false);
    if (submitError) {
      setError(submitError);
      return;
    }

    onOpenChange(false);
    onSaved();
  }

  if (!open) return null;

  return (
    <ModalShell maxWidth="md">
      <ModalShellHeader>
        <h2 className="font-semibold">{isEdit ? "Edit habit" : "New habit"}</h2>
      </ModalShellHeader>
      <form id={formId} onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <ModalShellBody className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="e.g. Morning reading"
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
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 text-lg transition-colors ${
                    icon === ic ? "border-primary" : "border-border"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
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
            <Label>Frequency</Label>
            <div className="flex flex-wrap gap-2">
              {["daily", "weekly", "monthly"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setFrequencyType(f);
                    setFrequencyDays([]);
                  }}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    frequencyType === f
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {frequencyType === "weekly" && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`h-8 w-8 rounded-full border text-xs font-medium transition-colors ${
                      frequencyDays.includes(i)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <TagInput entity="habits" value={tags} onChange={setTags} />
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
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form={formId} className="flex-1" disabled={loading}>
              {loading
                ? isEdit ? "Saving..." : "Creating..."
                : isEdit ? "Save changes" : "Create habit"}
            </Button>
          </div>
        </ModalShellFooter>
      </form>
    </ModalShell>
  );
}
