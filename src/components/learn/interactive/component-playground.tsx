"use client";

import { useState } from "react";
import type { Locale } from "@/lib/learn/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DemoComponent = "button" | "badge" | "progress" | "card";

interface Props {
  locale: Locale;
}

const labels = {
  en: {
    title: "Component Playground",
    desc: "Tweak props and see how components change in real time",
    variant: "Variant",
    size: "Size",
    text: "Text",
    value: "Value",
    preview: "Preview",
    code: "Code",
  },
  zh: {
    title: "组件实验室",
    desc: "调整属性，实时查看组件变化",
    variant: "样式变体",
    size: "尺寸",
    text: "文本",
    value: "值",
    preview: "预览",
    code: "代码",
  },
};

export function ComponentPlayground({ locale }: Props) {
  const t = labels[locale];
  const [activeComponent, setActiveComponent] = useState<DemoComponent>("button");
  const [buttonVariant, setButtonVariant] = useState<"default" | "secondary" | "outline" | "destructive" | "ghost">("default");
  const [buttonSize, setButtonSize] = useState<"default" | "sm" | "lg">("default");
  const [buttonText, setButtonText] = useState("Click me");
  const [badgeVariant, setBadgeVariant] = useState<"default" | "secondary" | "destructive" | "outline">("default");
  const [badgeText, setBadgeText] = useState("New");
  const [progressValue, setProgressValue] = useState(60);
  const [cardTitle, setCardTitle] = useState("My Card");

  const componentTabs: { id: DemoComponent; label: string }[] = [
    { id: "button", label: "Button" },
    { id: "badge", label: "Badge" },
    { id: "progress", label: "Progress" },
    { id: "card", label: "Card" },
  ];

  const renderPreview = () => {
    switch (activeComponent) {
      case "button":
        return <Button variant={buttonVariant} size={buttonSize}>{buttonText}</Button>;
      case "badge":
        return <Badge variant={badgeVariant}>{badgeText}</Badge>;
      case "progress":
        return <Progress value={progressValue} className="w-48" />;
      case "card":
        return (
          <Card className="w-64">
            <CardHeader><CardTitle className="text-base">{cardTitle}</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Card content goes here</p></CardContent>
          </Card>
        );
    }
  };

  const renderCode = () => {
    switch (activeComponent) {
      case "button":
        return `<Button variant="${buttonVariant}" size="${buttonSize}">\n  ${buttonText}\n</Button>`;
      case "badge":
        return `<Badge variant="${badgeVariant}">\n  ${badgeText}\n</Badge>`;
      case "progress":
        return `<Progress value={${progressValue}} />`;
      case "card":
        return `<Card>\n  <CardHeader>\n    <CardTitle>${cardTitle}</CardTitle>\n  </CardHeader>\n  <CardContent>...</CardContent>\n</Card>`;
    }
  };

  const renderControls = () => {
    switch (activeComponent) {
      case "button":
        return (
          <div className="space-y-3">
            <ControlRow label={t.variant}>
              <select
                value={buttonVariant}
                onChange={(e) => setButtonVariant(e.target.value as typeof buttonVariant)}
                className="text-xs border rounded-md px-2 py-1 bg-background"
              >
                {(["default", "secondary", "outline", "destructive", "ghost"] as const).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </ControlRow>
            <ControlRow label={t.size}>
              <select
                value={buttonSize}
                onChange={(e) => setButtonSize(e.target.value as typeof buttonSize)}
                className="text-xs border rounded-md px-2 py-1 bg-background"
              >
                {(["sm", "default", "lg"] as const).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </ControlRow>
            <ControlRow label={t.text}>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                className="text-xs border rounded-md px-2 py-1 w-32 bg-background"
              />
            </ControlRow>
          </div>
        );
      case "badge":
        return (
          <div className="space-y-3">
            <ControlRow label={t.variant}>
              <select
                value={badgeVariant}
                onChange={(e) => setBadgeVariant(e.target.value as typeof badgeVariant)}
                className="text-xs border rounded-md px-2 py-1 bg-background"
              >
                {(["default", "secondary", "destructive", "outline"] as const).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </ControlRow>
            <ControlRow label={t.text}>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="text-xs border rounded-md px-2 py-1 w-32 bg-background"
              />
            </ControlRow>
          </div>
        );
      case "progress":
        return (
          <div className="space-y-3">
            <ControlRow label={t.value}>
              <input
                type="range"
                min={0}
                max={100}
                value={progressValue}
                onChange={(e) => setProgressValue(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-xs text-muted-foreground ml-2">{progressValue}%</span>
            </ControlRow>
          </div>
        );
      case "card":
        return (
          <div className="space-y-3">
            <ControlRow label={t.text}>
              <input
                type="text"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                className="text-xs border rounded-md px-2 py-1 w-32 bg-background"
              />
            </ControlRow>
          </div>
        );
    }
  };

  return (
    <div className="rounded-xl border border-border/50 bg-white overflow-hidden">
      {/* Component tabs */}
      <div className="flex border-b border-border/50 bg-muted/30">
        {componentTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveComponent(tab.id)}
            className={cn(
              "px-4 py-2 text-xs font-medium transition-colors",
              activeComponent === tab.id
                ? "bg-background border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
        {/* Controls panel */}
        <div className="p-4 space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Props
          </h4>
          {renderControls()}
        </div>

        {/* Preview + Code panel */}
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {t.preview}
            </h4>
            <div className="flex items-center justify-center min-h-[60px] rounded-lg bg-muted/20 p-4">
              {renderPreview()}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {t.code}
            </h4>
            <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 text-xs overflow-x-auto font-mono">
              <code>{renderCode()}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-muted-foreground shrink-0">
        {label}
      </span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}
