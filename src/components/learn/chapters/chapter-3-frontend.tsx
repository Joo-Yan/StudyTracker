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
import { ComponentPlayground } from "@/components/learn/interactive/component-playground";
import { Quiz } from "@/components/learn/interactive/quiz";
import { quizData } from "@/lib/learn/quiz-data";
import { Monitor, Layers, Puzzle, Paintbrush, Box, Gamepad2, Code, HelpCircle } from "lucide-react";

interface Chapter3Props {
  locale: Locale;
}

export function Chapter3Frontend({ locale }: Chapter3Props) {
  const t = getContent(locale);
  const s = t.chapters["frontend"].sections;
  const reactSample = codeSamples.reactComponentExample;

  return (
    <div className="space-y-8">
      <SectionBlock icon={Monitor} title={s.intro.title}>
        <p><InlineMarkdown text={s.intro.body} /></p>
      </SectionBlock>

      <SectionBlock icon={Layers} title={s.analogy.title}>
        <AnalogyCard title={s.analogy.analogyTitle}>
          <p><InlineMarkdown text={s.analogy.analogyBody} /></p>
        </AnalogyCard>
      </SectionBlock>

      <SectionBlock icon={Puzzle} title={s.react.title}>
        <p className="mb-3"><InlineMarkdown text={s.react.body} /></p>
        <KeyConcept term={s.react.term}>
          <p><InlineMarkdown text={s.react.definition} /></p>
        </KeyConcept>
      </SectionBlock>

      <SectionBlock icon={Paintbrush} title={s.tailwind.title}>
        <p className="mb-3"><InlineMarkdown text={s.tailwind.body} /></p>
        <div className="rounded-lg bg-muted/30 p-3 text-sm">
          <InlineMarkdown text={s.tailwind.example} />
        </div>
      </SectionBlock>

      <SectionBlock icon={Box} title={s.nextjs.title}>
        <p><InlineMarkdown text={s.nextjs.body} /></p>
      </SectionBlock>

      <SectionBlock icon={Gamepad2} title={s.playground.title}>
        <p className="mb-4"><InlineMarkdown text={s.playground.body} /></p>
        <ComponentPlayground locale={locale} />
      </SectionBlock>

      <SectionBlock icon={Code} title={s.codeExample.title}>
        <p className="mb-4"><InlineMarkdown text={s.codeExample.body} /></p>
        <CodeViewer
          code={reactSample.code}
          language={reactSample.language}
          filename={reactSample.filename}
          annotations={getAnnotations(reactSample, locale)}
          highlightLines={reactSample.highlightLines}
        />
      </SectionBlock>

      <TipCallout><InlineMarkdown text={s.tip} /></TipCallout>

      <SectionBlock icon={HelpCircle} title={t.ui.quizTitle}>
        <Quiz questions={quizData["frontend"]} locale={locale} />
      </SectionBlock>
    </div>
  );
}
