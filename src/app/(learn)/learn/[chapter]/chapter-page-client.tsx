"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useLearnStore } from "@/lib/learn/progress-store";
import type { Locale } from "@/lib/learn/i18n";
import { ChapterLayout } from "@/components/learn/content/chapter-layout";
import { getContent } from "@/lib/learn/i18n";

interface ChapterPageClientProps {
  slug: string;
}

const chapterComponents: Record<string, ComponentType<{ locale: Locale }>> = {
  "what-is-a-web-app": dynamic(() =>
    import("@/components/learn/chapters/chapter-1-what-is-webapp").then((m) => ({ default: m.Chapter1WhatIsWebApp }))
  ),
  "project-structure": dynamic(() =>
    import("@/components/learn/chapters/chapter-2-project-structure").then((m) => ({ default: m.Chapter2ProjectStructure }))
  ),
  "frontend": dynamic(() =>
    import("@/components/learn/chapters/chapter-3-frontend").then((m) => ({ default: m.Chapter3Frontend }))
  ),
  "backend-and-api": dynamic(() =>
    import("@/components/learn/chapters/chapter-4-backend-api").then((m) => ({ default: m.Chapter4BackendApi }))
  ),
  "database": dynamic(() =>
    import("@/components/learn/chapters/chapter-5-database").then((m) => ({ default: m.Chapter5Database }))
  ),
  "authentication": dynamic(() =>
    import("@/components/learn/chapters/chapter-6-authentication").then((m) => ({ default: m.Chapter6Authentication }))
  ),
  "tech-stack": dynamic(() =>
    import("@/components/learn/chapters/chapter-7-tech-stack").then((m) => ({ default: m.Chapter7TechStack }))
  ),
  "deployment": dynamic(() =>
    import("@/components/learn/chapters/chapter-8-deployment").then((m) => ({ default: m.Chapter8Deployment }))
  ),
};

export function ChapterPageClient({ slug }: ChapterPageClientProps) {
  const { locale } = useLearnStore();
  const ChapterContent = chapterComponents[slug];

  if (ChapterContent) {
    return (
      <ChapterLayout slug={slug}>
        <ChapterContent locale={locale} />
      </ChapterLayout>
    );
  }

  // Fallback for chapters not yet implemented
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
