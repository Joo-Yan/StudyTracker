"use client";

import type { ComponentType } from "react";
import { useLearnStore } from "@/lib/learn/progress-store";
import type { Locale } from "@/lib/learn/i18n";
import { ChapterLayout } from "@/components/learn/content/chapter-layout";
import { Chapter1WhatIsWebApp } from "@/components/learn/chapters/chapter-1-what-is-webapp";
import { Chapter2ProjectStructure } from "@/components/learn/chapters/chapter-2-project-structure";
import { Chapter3Frontend } from "@/components/learn/chapters/chapter-3-frontend";
import { Chapter4BackendApi } from "@/components/learn/chapters/chapter-4-backend-api";
import { Chapter5Database } from "@/components/learn/chapters/chapter-5-database";
import { Chapter6Authentication } from "@/components/learn/chapters/chapter-6-authentication";
import { Chapter7TechStack } from "@/components/learn/chapters/chapter-7-tech-stack";
import { Chapter8Deployment } from "@/components/learn/chapters/chapter-8-deployment";
import { getContent } from "@/lib/learn/i18n";

interface ChapterPageClientProps {
  slug: string;
}

const chapterComponents: Record<
  string,
  ComponentType<{ locale: Locale }>
> = {
  "what-is-a-web-app": Chapter1WhatIsWebApp,
  "project-structure": Chapter2ProjectStructure,
  "frontend": Chapter3Frontend,
  "backend-and-api": Chapter4BackendApi,
  "database": Chapter5Database,
  "authentication": Chapter6Authentication,
  "tech-stack": Chapter7TechStack,
  "deployment": Chapter8Deployment,
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
