"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  ModalShell,
  ModalShellBody,
  ModalShellFooter,
  ModalShellHeader,
} from "@/components/ui/modal-shell";
import { calcProgress } from "@/lib/utils";

interface KeyResult {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit?: string;
}

interface Props {
  keyResult: KeyResult;
  onClose: () => void;
  onCreated: () => void;
}

export function CheckInDialog({ keyResult, onClose, onCreated }: Props) {
  const formId = "okr-checkin-form";
  const [value, setValue] = useState(keyResult.currentValue.toString());
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const numValue = Number(value) || 0;
  const pct = calcProgress(numValue, keyResult.targetValue);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch(`/api/okr/${keyResult.id}/checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: numValue, note }),
    });

    setLoading(false);
    onClose();
    onCreated();
  }

  return (
    <ModalShell maxWidth="sm">
      <ModalShellHeader>
        <h2 className="font-semibold">Update progress</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{keyResult.title}</p>
      </ModalShellHeader>
      <form id={formId} onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <ModalShellBody className="space-y-4">
          <div className="space-y-2">
            <Label>
              Current value{keyResult.unit ? ` (${keyResult.unit})` : ""}
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                min={0}
                max={keyResult.targetValue}
                step="any"
                required
                className="flex-1"
              />
              <span className="whitespace-nowrap text-sm text-muted-foreground">
                / {keyResult.targetValue}
                {keyResult.unit ? ` ${keyResult.unit}` : ""}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium text-foreground">{pct}%</span>
            </div>
            <Progress value={pct} />
          </div>
          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Textarea
              placeholder="What did you accomplish?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>
        </ModalShellBody>
        <ModalShellFooter>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" form={formId} className="flex-1" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </ModalShellFooter>
      </form>
    </ModalShell>
  );
}
