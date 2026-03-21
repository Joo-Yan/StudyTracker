"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
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
        keyResults: keyResults.filter((kr) => kr.title.trim()),
      }),
    });

    setLoading(false);
    setTitle("");
    setDescription("");
    setDeadline("");
    setKeyResults([
      { title: "", type: "percentage", targetValue: 100, unit: "", weight: 3 },
    ]);
    onOpenChange(false);
    onCreated();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-xl border shadow-lg w-full max-w-lg my-8">
        <div className="p-5 border-b">
          <h2 className="font-semibold">New objective</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
              <div key={i} className="p-3 rounded-lg border space-y-2">
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
                <div className="flex gap-2">
                  <div className="flex-1">
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
                        className={`w-6 h-6 rounded text-xs transition-colors ${
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

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Creating..." : "Create objective"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
