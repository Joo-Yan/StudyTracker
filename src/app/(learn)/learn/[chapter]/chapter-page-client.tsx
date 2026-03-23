"use client";

import { useLearnStore } from "@/lib/learn/progress-store";
import { getContent } from "@/lib/learn/i18n";
import { ChapterLayout } from "@/components/learn/content/chapter-layout";

interface ChapterPageClientProps {
  slug: string;
}

export function ChapterPageClient({ slug }: ChapterPageClientProps) {
  const { locale } = useLearnStore();
  const t = getContent(locale);
  const chapterContent = t.chapters[slug as keyof typeof t.chapters];

  return (
    <ChapterLayout slug={slug}>
      <div className="rounded-xl bg-muted/50 p-8 text-center text-muted-foreground">
        <p className="text-sm">{chapterContent?.content}</p>
      </div>
    </ChapterLayout>
  );
}
