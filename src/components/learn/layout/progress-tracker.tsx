"use client";

import { Progress } from "@/components/ui/progress";
import { chapters } from "@/lib/learn/chapters";
import { useLearnStore } from "@/lib/learn/progress-store";
import { getContent } from "@/lib/learn/i18n";

export function ProgressTracker() {
  const { locale, completedChapters } = useLearnStore();
  const t = getContent(locale);
  const pct = Math.round((completedChapters.length / chapters.length) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t.ui.progress}</span>
        <span className="font-medium">
          {completedChapters.length}/{chapters.length} {t.ui.chaptersCompleted}
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}
