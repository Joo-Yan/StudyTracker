"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Languages } from "lucide-react";
import { useLearnStore } from "@/lib/learn/progress-store";
import { getContent } from "@/lib/learn/i18n";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { chapters } from "@/lib/learn/chapters";

export function LearnHeader() {
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale, completedChapters } = useLearnStore();
  const t = getContent(locale);
  const progressPct = Math.round(
    (completedChapters.length / chapters.length) * 100
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [locale]);

  if (!mounted) {
    return (
      <header className="h-14 shrink-0 border-b border-border/50" />
    );
  }

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-border/50">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.ui.backToApp}
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{t.ui.progress}</span>
          <Progress value={progressPct} className="w-24 h-1.5" />
          <span>{progressPct}%</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocale(locale === "en" ? "zh" : "en")}
        className="gap-1.5 text-xs"
      >
        <Languages className="h-3.5 w-3.5" />
        {locale === "en" ? "中文" : "English"}
      </Button>
    </header>
  );
}
