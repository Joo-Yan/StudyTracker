"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Plus, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn, calcOkrProgress, calcProgress, daysUntil, formatDate } from "@/lib/utils";
import { CreateOkrDialog } from "@/components/okr/create-okr-dialog";
import { CheckInDialog } from "@/components/okr/checkin-dialog";

interface CheckIn {
  id: string;
  value: number;
  note?: string;
  date: string;
}

interface KeyResult {
  id: string;
  title: string;
  type: string;
  targetValue: number;
  currentValue: number;
  unit?: string;
  weight: number;
  status: string;
  checkIns: CheckIn[];
}

interface Objective {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  status: string;
  keyResults: KeyResult[];
}

export default function OkrPage() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [checkInKr, setCheckInKr] = useState<KeyResult | null>(null);

  async function fetchObjectives() {
    const res = await fetch("/api/okr");
    const data = await res.json();
    setObjectives(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchObjectives();
  }, []);

  function getStatusBadge(obj: Objective) {
    const days = daysUntil(obj.deadline);
    const progress = calcOkrProgress(obj.keyResults);
    if (progress === 100) return { label: "Completed", variant: "default" as const };
    if (days < 0) return { label: "Overdue", variant: "destructive" as const };
    if (days <= 7) return { label: `${days}d left`, variant: "outline" as const };
    return { label: `${days}d left`, variant: "secondary" as const };
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">OKR Goals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {objectives.filter((o) => o.status === "active").length} active objectives
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New objective
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-xl border bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : objectives.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-3">No objectives yet</p>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create your first objective
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {objectives.map((obj) => {
            const progress = calcOkrProgress(obj.keyResults);
            const badge = getStatusBadge(obj);
            return (
              <Card key={obj.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">{obj.title}</CardTitle>
                      {obj.description && (
                        <CardDescription className="mt-0.5">
                          {obj.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Overall progress
                      </span>
                      <span className="font-medium text-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <Clock className="h-3 w-3" />
                    <span>Due {formatDate(obj.deadline)}</span>
                  </div>
                  {obj.keyResults.map((kr) => {
                    const krPct = calcProgress(kr.currentValue, kr.targetValue);
                    return (
                      <div
                        key={kr.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                        onClick={() => setCheckInKr(kr)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{kr.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={krPct} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {kr.currentValue}/{kr.targetValue}
                              {kr.unit ? ` ${kr.unit}` : "%"}
                            </span>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            kr.status === "completed"
                              ? "bg-primary/10 text-primary"
                              : kr.status === "in_progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-secondary text-muted-foreground"
                          )}
                        >
                          {krPct}%
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CreateOkrDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={fetchObjectives}
      />

      {checkInKr && (
        <CheckInDialog
          keyResult={checkInKr}
          onClose={() => setCheckInKr(null)}
          onCreated={fetchObjectives}
        />
      )}
    </div>
  );
}
