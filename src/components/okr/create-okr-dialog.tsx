"use client";

import { useEffect, useState } from "react";
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
import { requestJson } from "@/lib/api-client";

interface KrDraft {
  id?: string;
  title: string;
  type: string;
  targetValue: number;
  unit: string;
  weight: number;
}

export interface ObjectiveFormData {
  id: string;
  title: string;
  description?: string | null;
  deadline: string;
  tags: string[];
  keyResults: {
    id: string;
    title: string;
    type: string;
    targetValue: number;
    unit?: string | null;
    weight: number;
  }[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (saved: ObjectiveFormData) => void;
  /** When set, the dialog edits this objective instead of creating a new one. */
  objective?: ObjectiveFormData | null;
}

const EMPTY_KR: KrDraft = { title: "", type: "percentage", targetValue: 100, unit: "", weight: 3 };

export function CreateOkrDialog({ open, onOpenChange, onSaved, objective }: Props) {
  const formId = "create-okr-form";
  const isEdit = !!objective;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [keyResults, setKeyResults] = useState<KrDraft[]>([{ ...EMPTY_KR }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(objective?.title ?? "");
    setDescription(objective?.description ?? "");
    setDeadline(objective ? objective.deadline.slice(0, 10) : "");
    setTags(objective?.tags ?? []);
    setKeyResults(
      objective && objective.keyResults.length > 0
        ? objective.keyResults.map((kr) => ({
            id: kr.id,
            title: kr.title,
            type: kr.type,
            targetValue: kr.targetValue,
            unit: kr.unit ?? "",
            weight: kr.weight,
          }))
        : [{ ...EMPTY_KR }]
    );
    setError("");
  }, [open, objective]);

  function addKr() {
    setKeyResults([...keyResults, { ...EMPTY_KR }]);
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
    setError("");

    const payload = {
      title,
      description,
      deadline,
      tags,
      keyResults: keyResults.filter((kr) => kr.title.trim()),
    };
    const { data, error: submitError } = isEdit
      ? await requestJson<ObjectiveFormData>("PATCH", `/api/okr/${objective!.id}`, payload)
      : await requestJson<ObjectiveFormData>("POST", "/api/okr", payload);

    setLoading(false);
    if (submitError || !data) {
      setError(submitError ?? "Something went wrong. Please try again.");
      return;
    }

    onOpenChange(false);
    onSaved(data);
  }

  if (!open) return null;

  return (
    <ModalShell maxWidth="lg">
      <ModalShellHeader>
        <h2 className="font-semibold">{isEdit ? "Edit objective" : "New objective"}</h2>
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
            {isEdit && (
              <p className="text-xs text-muted-foreground">
                Removing a key result also deletes its check-in history.
              </p>
            )}
            {keyResults.map((kr, i) => (
              <div key={kr.id ?? `new-${i}`} className="space-y-2 rounded-lg border p-3">
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
                : isEdit ? "Save changes" : "Create objective"}
            </Button>
          </div>
        </ModalShellFooter>
      </form>
    </ModalShell>
  );
}
