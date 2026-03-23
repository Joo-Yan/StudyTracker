"use client";

import type { Locale } from "@/lib/learn/i18n";
import { getContent } from "@/lib/learn/i18n";
import { codeSamples, getAnnotations } from "@/lib/learn/code-samples";
import { SectionBlock } from "@/components/learn/content/section-block";
import { AnalogyCard } from "@/components/learn/content/analogy-card";
import { KeyConcept } from "@/components/learn/content/key-concept";
import { TipCallout } from "@/components/learn/content/tip-callout";
import { InlineMarkdown } from "@/components/learn/content/inline-markdown";
import { CodeViewer } from "@/components/learn/interactive/code-viewer";
import { Quiz } from "@/components/learn/interactive/quiz";
import { quizData } from "@/lib/learn/quiz-data";
import { Globe, Utensils, Layers, Workflow, Code, HelpCircle } from "lucide-react";

interface Chapter1Props {
  locale: Locale;
}

export function Chapter1WhatIsWebApp({ locale }: Chapter1Props) {
  const t = getContent(locale);
  const s = t.chapters["what-is-a-web-app"].sections;
  const apiSample = codeSamples.apiRouteExample;

  return (
    <div className="space-y-8">
      <SectionBlock icon={Globe} title={s.intro.title}>
        <p><InlineMarkdown text={s.intro.body} /></p>
      </SectionBlock>

      <SectionBlock icon={Utensils} title={s.analogy.title}>
        <AnalogyCard title={s.analogy.analogyTitle}>
          <p><InlineMarkdown text={s.analogy.analogyBody} /></p>
        </AnalogyCard>
      </SectionBlock>

      <SectionBlock icon={Layers} title={s.threeparts.title}>
        <div className="space-y-3">
          <KeyConcept term={s.threeparts.frontend.term}>
            <p><InlineMarkdown text={s.threeparts.frontend.definition} /></p>
          </KeyConcept>
          <KeyConcept term={s.threeparts.backend.term}>
            <p><InlineMarkdown text={s.threeparts.backend.definition} /></p>
          </KeyConcept>
          <KeyConcept term={s.threeparts.api.term}>
            <p><InlineMarkdown text={s.threeparts.api.definition} /></p>
          </KeyConcept>
        </div>
      </SectionBlock>

      <SectionBlock icon={Workflow} title={s.howItWorks.title}>
        <ol className="space-y-2">
          {s.howItWorks.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="pt-0.5"><InlineMarkdown text={step} /></span>
            </li>
          ))}
        </ol>
      </SectionBlock>

      <SectionBlock icon={Code} title={s.realExample.title}>
        <p className="mb-4"><InlineMarkdown text={s.realExample.body} /></p>
        <CodeViewer
          code={apiSample.code}
          language={apiSample.language}
          filename={apiSample.filename}
          annotations={getAnnotations(apiSample, locale)}
          highlightLines={apiSample.highlightLines}
        />
      </SectionBlock>

      <TipCallout><InlineMarkdown text={s.tip} /></TipCallout>

      <SectionBlock icon={HelpCircle} title={t.ui.quizTitle}>
        <Quiz questions={quizData["what-is-a-web-app"]} locale={locale} />
      </SectionBlock>
    </div>
  );
}
