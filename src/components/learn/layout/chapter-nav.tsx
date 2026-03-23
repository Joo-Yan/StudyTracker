"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAdjacentChapters } from "@/lib/learn/chapters";
import { useLearnStore } from "@/lib/learn/progress-store";
import { getContent } from "@/lib/learn/i18n";
import { Button } from "@/components/ui/button";

interface ChapterNavProps {
  currentSlug: string;
}

export function ChapterNav({ currentSlug }: ChapterNavProps) {
  const { locale } = useLearnStore();
  const t = getContent(locale);
  const { prev, next } = getAdjacentChapters(currentSlug);

  return (
    <div className="flex items-center justify-between pt-8 mt-8 border-t border-border/50">
      {prev ? (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/learn/${prev.slug}`} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t.ui.prevChapter}
          </Link>
        </Button>
      ) : (
        <div />
      )}
      {next ? (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/learn/${next.slug}`} className="gap-2">
            {t.ui.nextChapter}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
}
