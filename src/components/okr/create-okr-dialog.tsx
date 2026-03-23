"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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

interface KrDraft {
  title: string;
  type: string;
  targetValue: number;
  unit: string;
  weight: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function CreateOkrDialog({ open, onOpenChange, onCreated }: Props) {
  const formId = "create-okr-form";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [keyResults, setKeyResults] = useState<KrDraft[]>([
    { title: "", type: "percentage", targetValue: 100, unit: "", weight: 3 },
  ]);
  const [loading, setLoading] = useState(false);

  function addKr() {
    setKeyResults([
      ...keyResults,
      { title: "", type: "percentage", targetValue: 100, unit: "", weight: 3 },
    ]);
  }

  function removeKr(i: number) {
    setKeyResults(keyResults.filter((_, idx) => idx !== i));
  }

  function updateKr(i: number, field: keyof KrDraft, value: string | number) {
    const updated = [...keyResults];
    updated[i] = { ...updated[i], [field]: value };
    setKeyResults(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/okr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        deadline,
        tags,
        keyResults: keyResults.filter((kr) => kr.title.trim()),
      }),
    });

    setLoading(false);
    setTitle("");
    setDescription("");
    setDeadline("");
    setTags([]);
    setKeyResults([
      { title: "", type: "percentage", targetValue: 100, unit: "", weight: 3 },
    ]);
    onOpenChange(false);
    onCreated();
  }

  if (!open) return null;

  return (
    <ModalShell maxWidth="lg">
      <ModalShellHeader>
        <h2 className="font-semibold">New objective</h2>
      </ModalShellHeader>
      <form id={formId} onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <ModalShellBody className="space-y-4">
          <div className="space-y-2">
            <Label>Objective</Label>
            <Input
              placeholder="e.g. Launch side project v1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              placeholder="Why is this important?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Key Results</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addKr}>
                <Plus className="h-3 w-3" />
                Add KR
              </Button>
            </div>
            {keyResults.map((kr, i) => (
              <div key={i} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={`KR ${i + 1}: e.g. Ship 3 features`}
                    value={kr.title}
                    onChange={(e) => updateKr(i, "title", e.target.value)}
                    className="flex-1"
                  />
                  {keyResults.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeKr(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="min-w-[10rem] flex-1">
                    <Input
                      type="number"
                      placeholder="Target"
                      value={kr.targetValue}
                      min={1}
                      onChange={(e) =>
                        updateKr(i, "targetValue", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      placeholder="Unit"
                      value={kr.unit}
                      onChange={(e) => updateKr(i, "unit", e.target.value)}
                    />
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => updateKr(i, "weight", w)}
                        className={`h-6 w-6 rounded text-xs transition-colors ${
                          kr.weight >= w
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <TagInput entity="okr" value={tags} onChange={setTags} />
          </div>
        </ModalShellBody>
        <ModalShellFooter>
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
              {loading ? "Creating..." : "Create objective"}
            </Button>
          </div>
        </ModalShellFooter>
      </form>
    </ModalShell>
  );
}
