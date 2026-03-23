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
import { ArchitectureDiagram } from "@/components/learn/interactive/architecture-diagram";
import { DataFlowAnimation } from "@/components/learn/interactive/data-flow-animation";
import { ApiExplorer } from "@/components/learn/interactive/api-explorer";
import { Quiz } from "@/components/learn/interactive/quiz";
import { quizData } from "@/lib/learn/quiz-data";
import { Server, Utensils, Plug, RefreshCw, Network, FlaskConical, HelpCircle } from "lucide-react";

interface Chapter4Props {
  locale: Locale;
}

export function Chapter4BackendApi({ locale }: Chapter4Props) {
  const t = getContent(locale);
  const s = t.chapters["backend-and-api"].sections;
  const apiSample = codeSamples.apiRouteExample;

  return (
    <div className="space-y-8">
      <SectionBlock icon={Server} title={s.intro.title}>
        <p><InlineMarkdown text={s.intro.body} /></p>
      </SectionBlock>

      <SectionBlock icon={Utensils} title={s.analogy.title}>
        <AnalogyCard title={s.analogy.analogyTitle}>
          <p><InlineMarkdown text={s.analogy.analogyBody} /></p>
        </AnalogyCard>
      </SectionBlock>

      <SectionBlock icon={Plug} title={s.api.title}>
        <p className="mb-3"><InlineMarkdown text={s.api.body} /></p>
        <KeyConcept term={s.api.term}>
          <p><InlineMarkdown text={s.api.definition} /></p>
        </KeyConcept>
      </SectionBlock>

      <SectionBlock icon={RefreshCw} title={s.requestCycle.title}>
        <p className="mb-4"><InlineMarkdown text={s.requestCycle.body} /></p>
        <DataFlowAnimation locale={locale} />
      </SectionBlock>

      <SectionBlock icon={Network} title={s.architecture.title}>
        <p className="mb-4"><InlineMarkdown text={s.architecture.body} /></p>
        <ArchitectureDiagram locale={locale} />
      </SectionBlock>

      <SectionBlock icon={FlaskConical} title={s.explorer.title}>
        <p className="mb-4"><InlineMarkdown text={s.explorer.body} /></p>
        <ApiExplorer locale={locale} />
      </SectionBlock>

      <TipCallout><InlineMarkdown text={s.tip} /></TipCallout>

      <SectionBlock icon={HelpCircle} title={t.ui.quizTitle}>
        <Quiz questions={quizData["backend-and-api"]} locale={locale} />
      </SectionBlock>
    </div>
  );
}
