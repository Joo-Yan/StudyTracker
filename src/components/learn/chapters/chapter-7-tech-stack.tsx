"use client";

import type { Locale } from "@/lib/learn/i18n";
import { getContent } from "@/lib/learn/i18n";
import { SectionBlock } from "@/components/learn/content/section-block";
import { TipCallout } from "@/components/learn/content/tip-callout";
import { InlineMarkdown } from "@/components/learn/content/inline-markdown";
import { FlipCard } from "@/components/learn/interactive/flip-card";
import { DecisionTree } from "@/components/learn/interactive/decision-tree";
import { Quiz } from "@/components/learn/interactive/quiz";
import { quizData } from "@/lib/learn/quiz-data";
import { Wrench, GitCompare, TreeDeciduous, Heart, HelpCircle } from "lucide-react";

interface Chapter7Props {
  locale: Locale;
}

export function Chapter7TechStack({ locale }: Chapter7Props) {
  const t = getContent(locale);
  const s = t.chapters["tech-stack"].sections;

  return (
    <div className="space-y-8">
      <SectionBlock icon={Wrench} title={s.intro.title}>
        <p><InlineMarkdown text={s.intro.body} /></p>
      </SectionBlock>

      <SectionBlock icon={GitCompare} title={s.comparisons.title}>
        <p className="mb-4"><InlineMarkdown text={s.comparisons.body} /></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {s.comparisons.cards.map((card, i) => (
            <FlipCard
              key={i}
              front={
                <div className="text-center py-4">
                  <h4 className="font-bold text-lg mb-1">{card.front.title}</h4>
                  <p className="text-xs text-muted-foreground">{card.front.subtitle}</p>
                  <p className="text-[10px] text-muted-foreground mt-3">
                    {locale === "zh" ? "点击翻转" : "Click to flip"}
                  </p>
                </div>
              }
              back={
                <div className="text-xs space-y-2 py-2">
                  <div>
                    <span className="font-semibold text-emerald-700">
                      {locale === "zh" ? "优点：" : "Pros: "}
                    </span>
                    <span className="text-muted-foreground">{card.back.pros}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-rose-700">
                      {locale === "zh" ? "缺点：" : "Cons: "}
                    </span>
                    <span className="text-muted-foreground">{card.back.cons}</span>
                  </div>
                </div>
              }
              frontColor="bg-gradient-to-br from-white to-muted/30 border-border/50"
              backColor="bg-white border-border/50"
            />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock icon={TreeDeciduous} title={s.decision.title}>
        <p className="mb-4"><InlineMarkdown text={s.decision.body} /></p>
        <DecisionTree locale={locale} />
      </SectionBlock>

      <SectionBlock icon={Heart} title={s.why.title}>
        <p><InlineMarkdown text={s.why.body} /></p>
      </SectionBlock>

      <TipCallout><InlineMarkdown text={s.tip} /></TipCallout>

      <SectionBlock icon={HelpCircle} title={t.ui.quizTitle}>
        <Quiz questions={quizData["tech-stack"]} locale={locale} />
      </SectionBlock>
    </div>
  );
}
