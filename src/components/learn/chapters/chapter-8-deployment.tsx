"use client";

import type { Locale } from "@/lib/learn/i18n";
import { getContent } from "@/lib/learn/i18n";
import { SectionBlock } from "@/components/learn/content/section-block";
import { AnalogyCard } from "@/components/learn/content/analogy-card";
import { KeyConcept } from "@/components/learn/content/key-concept";
import { TipCallout } from "@/components/learn/content/tip-callout";
import { InlineMarkdown } from "@/components/learn/content/inline-markdown";
import { DeploymentSimulator } from "@/components/learn/interactive/deployment-simulator";
import { Quiz } from "@/components/learn/interactive/quiz";
import { quizData } from "@/lib/learn/quiz-data";
import { Rocket, BookOpen, Cloud, KeyRound, Play, RefreshCw, HelpCircle } from "lucide-react";

interface Chapter8Props {
  locale: Locale;
}

export function Chapter8Deployment({ locale }: Chapter8Props) {
  const t = getContent(locale);
  const s = t.chapters["deployment"].sections;

  return (
    <div className="space-y-8">
      <SectionBlock icon={Rocket} title={s.intro.title}>
        <p><InlineMarkdown text={s.intro.body} /></p>
      </SectionBlock>

      <SectionBlock icon={BookOpen} title={s.analogy.title}>
        <AnalogyCard title={s.analogy.analogyTitle}>
          <p><InlineMarkdown text={s.analogy.analogyBody} /></p>
        </AnalogyCard>
      </SectionBlock>

      <SectionBlock icon={Cloud} title={s.vercel.title}>
        <p><InlineMarkdown text={s.vercel.body} /></p>
      </SectionBlock>

      <SectionBlock icon={KeyRound} title={s.envVars.title}>
        <p className="mb-3"><InlineMarkdown text={s.envVars.body} /></p>
        <KeyConcept term={s.envVars.term}>
          <p><InlineMarkdown text={s.envVars.definition} /></p>
        </KeyConcept>
      </SectionBlock>

      <SectionBlock icon={Play} title={s.simulator.title}>
        <p className="mb-4"><InlineMarkdown text={s.simulator.body} /></p>
        <DeploymentSimulator locale={locale} />
      </SectionBlock>

      <SectionBlock icon={RefreshCw} title={s.cicd.title}>
        <p><InlineMarkdown text={s.cicd.body} /></p>
      </SectionBlock>

      <TipCallout><InlineMarkdown text={s.tip} /></TipCallout>

      <SectionBlock icon={HelpCircle} title={t.ui.quizTitle}>
        <Quiz questions={quizData["deployment"]} locale={locale} />
      </SectionBlock>
    </div>
  );
}
