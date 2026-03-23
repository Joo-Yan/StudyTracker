"use client";

import type { Locale } from "@/lib/learn/i18n";
import { getContent } from "@/lib/learn/i18n";
import { SectionBlock } from "@/components/learn/content/section-block";
import { AnalogyCard } from "@/components/learn/content/analogy-card";
import { KeyConcept } from "@/components/learn/content/key-concept";
import { TipCallout } from "@/components/learn/content/tip-callout";
import { InlineMarkdown } from "@/components/learn/content/inline-markdown";
import { AuthFlowDiagram } from "@/components/learn/interactive/auth-flow-diagram";
import { Quiz } from "@/components/learn/interactive/quiz";
import { quizData } from "@/lib/learn/quiz-data";
import { Shield, Hotel, Key, Workflow, Layers, HelpCircle } from "lucide-react";

interface Chapter6Props {
  locale: Locale;
}

export function Chapter6Authentication({ locale }: Chapter6Props) {
  const t = getContent(locale);
  const s = t.chapters["authentication"].sections;

  return (
    <div className="space-y-8">
      <SectionBlock icon={Shield} title={s.intro.title}>
        <p><InlineMarkdown text={s.intro.body} /></p>
      </SectionBlock>

      <SectionBlock icon={Hotel} title={s.analogy.title}>
        <AnalogyCard title={s.analogy.analogyTitle}>
          <p><InlineMarkdown text={s.analogy.analogyBody} /></p>
        </AnalogyCard>
      </SectionBlock>

      <SectionBlock icon={Key} title={s.concepts.title}>
        <div className="space-y-3">
          <KeyConcept term={s.concepts.jwt.term}>
            <p><InlineMarkdown text={s.concepts.jwt.definition} /></p>
          </KeyConcept>
          <KeyConcept term={s.concepts.middleware.term}>
            <p><InlineMarkdown text={s.concepts.middleware.definition} /></p>
          </KeyConcept>
          <KeyConcept term={s.concepts.oauth.term}>
            <p><InlineMarkdown text={s.concepts.oauth.definition} /></p>
          </KeyConcept>
        </div>
      </SectionBlock>

      <SectionBlock icon={Workflow} title={s.flow.title}>
        <p className="mb-4"><InlineMarkdown text={s.flow.body} /></p>
        <AuthFlowDiagram locale={locale} />
      </SectionBlock>

      <SectionBlock icon={Layers} title={s.protection.title}>
        <p><InlineMarkdown text={s.protection.body} /></p>
      </SectionBlock>

      <TipCallout variant="warning"><InlineMarkdown text={s.tip} /></TipCallout>

      <SectionBlock icon={HelpCircle} title={t.ui.quizTitle}>
        <Quiz questions={quizData["authentication"]} locale={locale} />
      </SectionBlock>
    </div>
  );
}
