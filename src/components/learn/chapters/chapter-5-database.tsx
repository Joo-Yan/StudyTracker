"use client";

import type { Locale } from "@/lib/learn/i18n";
import { getContent } from "@/lib/learn/i18n";
import { SectionBlock } from "@/components/learn/content/section-block";
import { AnalogyCard } from "@/components/learn/content/analogy-card";
import { KeyConcept } from "@/components/learn/content/key-concept";
import { TipCallout } from "@/components/learn/content/tip-callout";
import { InlineMarkdown } from "@/components/learn/content/inline-markdown";
import { ERDiagram } from "@/components/learn/interactive/er-diagram";
import { Quiz } from "@/components/learn/interactive/quiz";
import { quizData } from "@/lib/learn/quiz-data";
import { Database, Table2, Code, FileCode, Link2, HelpCircle } from "lucide-react";

interface Chapter5Props {
  locale: Locale;
}

export function Chapter5Database({ locale }: Chapter5Props) {
  const t = getContent(locale);
  const s = t.chapters["database"].sections;

  return (
    <div className="space-y-8">
      <SectionBlock icon={Database} title={s.intro.title}>
        <p><InlineMarkdown text={s.intro.body} /></p>
      </SectionBlock>

      <SectionBlock icon={Table2} title={s.analogy.title}>
        <AnalogyCard title={s.analogy.analogyTitle}>
          <p><InlineMarkdown text={s.analogy.analogyBody} /></p>
        </AnalogyCard>
      </SectionBlock>

      <SectionBlock icon={Code} title={s.prisma.title}>
        <p className="mb-3"><InlineMarkdown text={s.prisma.body} /></p>
        <KeyConcept term={s.prisma.term}>
          <p><InlineMarkdown text={s.prisma.definition} /></p>
        </KeyConcept>
      </SectionBlock>

      <SectionBlock icon={FileCode} title={s.schema.title}>
        <p><InlineMarkdown text={s.schema.body} /></p>
      </SectionBlock>

      <SectionBlock icon={Link2} title={s.relationships.title}>
        <p className="mb-4"><InlineMarkdown text={s.relationships.body} /></p>
        <ERDiagram locale={locale} />
      </SectionBlock>

      <TipCallout><InlineMarkdown text={s.tip} /></TipCallout>

      <SectionBlock icon={HelpCircle} title={t.ui.quizTitle}>
        <Quiz questions={quizData["database"]} locale={locale} />
      </SectionBlock>
    </div>
  );
}
