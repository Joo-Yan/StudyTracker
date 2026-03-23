"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { chapters } from "@/lib/learn/chapters";
import { useLearnStore } from "@/lib/learn/progress-store";
import { getContent } from "@/lib/learn/i18n";
import { CheckCircle2 } from "lucide-react";

export function LearnSidebar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { locale, completedChapters } = useLearnStore();
  const t = getContent(locale);

  useEffect(() => setMounted(true), []);

  return (
    <aside className="w-72 shrink-0 flex flex-col h-screen sticky top-0 px-4 py-6 border-r border-border/50">
      <Link
        href="/learn"
        className="mb-6 px-4 flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="h-6 w-6 bg-primary rounded-full" />
        <span className="font-bold text-lg tracking-tight">Learn</span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {chapters.map((chapter) => {
          const chapterContent =
            t.chapters[chapter.slug as keyof typeof t.chapters];
          const isActive = pathname === `/learn/${chapter.slug}`;
          const isComplete = mounted && completedChapters.includes(chapter.slug);
          const Icon = chapter.icon;

          return (
            <Link
              key={chapter.slug}
              href={`/learn/${chapter.slug}`}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-white shadow-sm text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
              )}
            >
              <span className="relative shrink-0">
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {isComplete && (
                  <CheckCircle2 className="h-3 w-3 text-green-500 absolute -top-1 -right-1" />
                )}
              </span>
              <span className="truncate">
                <span className="text-xs text-muted-foreground mr-1">
                  {chapter.order}.
                </span>
                {chapterContent?.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {mounted && (
        <div className="px-4 py-4 text-xs text-muted-foreground">
          <p>
            {completedChapters.length}/{chapters.length}{" "}
            {t.ui.chaptersCompleted}
          </p>
        </div>
      )}
    </aside>
  );
}
