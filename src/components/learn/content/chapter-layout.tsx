"use client";

import { useState, useEffect } from "react";
import { useLearnStore } from "@/lib/learn/progress-store";
import { getContent, formatChapterLabel } from "@/lib/learn/i18n";
import { getChapterBySlug } from "@/lib/learn/chapters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChapterNav } from "@/components/learn/layout/chapter-nav";
import { CheckCircle2 } from "lucide-react";

interface ChapterLayoutProps {
  slug: string;
  children: React.ReactNode;
}

export function ChapterLayout({ slug, children }: ChapterLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const { locale, toggleChapterComplete, isChapterComplete } = useLearnStore();
  const t = getContent(locale);
  const chapter = getChapterBySlug(slug);
  const chapterContent = t.chapters[slug as keyof typeof t.chapters];
  const completed = mounted && isChapterComplete(slug);

  useEffect(() => setMounted(true), []);

  if (!chapter || !chapterContent) return null;

  const Icon = chapter.icon;

  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {formatChapterLabel(t, chapter.order)}
          </Badge>
          {completed && (
            <Badge
              variant="outline"
              className="text-xs text-green-600 border-green-200"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {t.ui.completed}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Icon className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            {chapterContent.title}
          </h1>
        </div>
        <p className="text-muted-foreground">{chapterContent.description}</p>
      </div>

      <div className="prose-stone space-y-6">{children}</div>

      <div className="mt-10 flex justify-center">
        <Button
          variant={completed ? "outline" : "default"}
          onClick={() => toggleChapterComplete(slug)}
          className="gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          {completed ? t.ui.completed : t.ui.markComplete}
        </Button>
      </div>

      <ChapterNav currentSlug={slug} />
    </article>
  );
}
