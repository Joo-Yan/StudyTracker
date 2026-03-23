"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { chapters } from "@/lib/learn/chapters";
import { useLearnStore } from "@/lib/learn/progress-store";
import { getContent, formatChapterLabel } from "@/lib/learn/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressTracker } from "@/components/learn/layout/progress-tracker";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function LearnPage() {
  const [mounted, setMounted] = useState(false);
  const { locale, completedChapters } = useLearnStore();

  useEffect(() => setMounted(true), []);
  const t = getContent(locale);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.ui.title}</h1>
        <p className="text-muted-foreground text-lg">{t.ui.subtitle}</p>
      </div>

      <ProgressTracker />

      <div className="grid gap-4">
        {chapters.map((chapter) => {
          const chapterContent =
            t.chapters[chapter.slug as keyof typeof t.chapters];
          const isComplete = mounted && completedChapters.includes(chapter.slug);
          const Icon = chapter.icon;

          return (
            <Link key={chapter.slug} href={`/learn/${chapter.slug}`}>
              <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge variant="secondary" className="text-xs">
                        {formatChapterLabel(t, chapter.order)}
                      </Badge>
                      {isComplete && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm truncate">
                      {chapterContent?.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {chapterContent?.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {(!mounted || completedChapters.length === 0) && chapters.length > 0 && (
        <div className="flex justify-center">
          <Button asChild>
            <Link href={`/learn/${chapters[0].slug}`} className="gap-2">
              {t.ui.startLearning}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
