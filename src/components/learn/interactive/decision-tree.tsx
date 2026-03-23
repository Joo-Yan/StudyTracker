"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/learn/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface DecisionNode {
  id: string;
  question: { en: string; zh: string };
  options: {
    label: { en: string; zh: string };
    nextId: string | null; // null = leaf node
    result?: { en: string; zh: string };
    recommendation?: string; // tech name
  }[];
}

const tree: DecisionNode[] = [
  {
    id: "start",
    question: {
      en: "What kind of project are you building?",
      zh: "你要构建什么类型的项目？",
    },
    options: [
      { label: { en: "Full-stack web app", zh: "全栈 Web 应用" }, nextId: "fullstack" },
      { label: { en: "Static website / blog", zh: "静态网站 / 博客" }, nextId: "static" },
      { label: { en: "Mobile app", zh: "移动应用" }, nextId: "mobile" },
    ],
  },
  {
    id: "fullstack",
    question: {
      en: "Do you need server-side rendering (SEO, fast first load)?",
      zh: "你需要服务端渲染吗（SEO、快速首次加载）？",
    },
    options: [
      { label: { en: "Yes, SEO matters", zh: "是的，SEO 很重要" }, nextId: "ssr-db" },
      { label: { en: "No, it's a dashboard/internal tool", zh: "不，这是仪表盘/内部工具" }, nextId: "spa" },
    ],
  },
  {
    id: "ssr-db",
    question: {
      en: "What database complexity do you expect?",
      zh: "你预期的数据库复杂度？",
    },
    options: [
      {
        label: { en: "Complex relations, many tables", zh: "复杂关系，多表" },
        nextId: null,
        result: {
          en: "Next.js + Prisma + PostgreSQL — like StudyTracker! Great for complex data with type-safe queries.",
          zh: "Next.js + Prisma + PostgreSQL——就像 StudyTracker！适合需要类型安全查询的复杂数据。",
        },
        recommendation: "Next.js + Prisma + PostgreSQL",
      },
      {
        label: { en: "Simple data, fast iteration", zh: "简单数据，快速迭代" },
        nextId: null,
        result: {
          en: "Next.js + Supabase (with its built-in Postgres). Quick setup with auth, storage, and real-time features included.",
          zh: "Next.js + Supabase（自带 Postgres）。快速设置，内置认证、存储和实时功能。",
        },
        recommendation: "Next.js + Supabase",
      },
    ],
  },
  {
    id: "spa",
    question: {
      en: "Team size and experience?",
      zh: "团队规模和经验？",
    },
    options: [
      {
        label: { en: "Solo or small team, want speed", zh: "单人或小团队，追求速度" },
        nextId: null,
        result: {
          en: "Vite + React + tRPC or Hono — lightweight, fast builds, great developer experience.",
          zh: "Vite + React + tRPC 或 Hono——轻量、快速构建、优秀的开发体验。",
        },
        recommendation: "Vite + React",
      },
      {
        label: { en: "Large team, need conventions", zh: "大团队，需要规范" },
        nextId: null,
        result: {
          en: "Next.js (with App Router) or Remix — opinionated structure helps teams stay consistent.",
          zh: "Next.js（App Router）或 Remix——约定式结构帮助团队保持一致。",
        },
        recommendation: "Next.js or Remix",
      },
    ],
  },
  {
    id: "static",
    question: {
      en: "Do you need dynamic content (CMS)?",
      zh: "你需要动态内容（CMS）吗？",
    },
    options: [
      {
        label: { en: "Yes, I'll update content frequently", zh: "是的，我会经常更新内容" },
        nextId: null,
        result: {
          en: "Astro + a headless CMS (Contentful, Sanity, or Notion API). Astro renders static pages with optional interactive islands.",
          zh: "Astro + 无头 CMS（Contentful、Sanity 或 Notion API）。Astro 渲染静态页面并支持可选的交互岛屿。",
        },
        recommendation: "Astro + Headless CMS",
      },
      {
        label: { en: "No, content is mostly fixed", zh: "不，内容基本固定" },
        nextId: null,
        result: {
          en: "Astro or plain HTML + Tailwind CSS. Deploy to Vercel/Netlify for free. Simplest possible setup.",
          zh: "Astro 或纯 HTML + Tailwind CSS。免费部署到 Vercel/Netlify。最简单的方案。",
        },
        recommendation: "Astro or HTML + Tailwind",
      },
    ],
  },
  {
    id: "mobile",
    question: {
      en: "Target platforms?",
      zh: "目标平台？",
    },
    options: [
      {
        label: { en: "Both iOS and Android", zh: "iOS 和 Android 都要" },
        nextId: null,
        result: {
          en: "React Native (Expo) or Flutter. If your team knows React, go with Expo — the learning curve is gentle.",
          zh: "React Native（Expo）或 Flutter。如果团队熟悉 React，选择 Expo——学习曲线平缓。",
        },
        recommendation: "React Native (Expo) or Flutter",
      },
      {
        label: { en: "Web-first, installable (PWA)", zh: "Web 优先，可安装（PWA）" },
        nextId: null,
        result: {
          en: "Next.js as a PWA. Add a service worker and manifest — your web app becomes installable on phones without an app store.",
          zh: "Next.js 作为 PWA。添加 Service Worker 和 manifest——你的 Web 应用无需应用商店即可安装到手机上。",
        },
        recommendation: "Next.js PWA",
      },
    ],
  },
];

interface Props {
  locale: Locale;
}

export function DecisionTree({ locale }: Props) {
  const [history, setHistory] = useState<string[]>(["start"]);
  const currentId = history[history.length - 1];
  const currentNode = tree.find((n) => n.id === currentId);
  const [result, setResult] = useState<{
    text: { en: string; zh: string };
    recommendation: string;
  } | null>(null);

  const handleChoice = useCallback(
    (option: DecisionNode["options"][0]) => {
      if (option.nextId) {
        setHistory((h) => [...h, option.nextId!]);
        setResult(null);
      } else if (option.result) {
        setResult({
          text: option.result,
          recommendation: option.recommendation ?? "",
        });
      }
    },
    []
  );

  const handleReset = () => {
    setHistory(["start"]);
    setResult(null);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎯</span>
              <span className="font-bold text-sm text-emerald-800">
                {result.recommendation}
              </span>
            </div>
            <p className="text-sm text-emerald-700 leading-relaxed">
              {result.text[locale]}
            </p>
          </motion.div>
        ) : currentNode ? (
          <motion.div
            key={currentId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-xl border border-border/50 bg-white p-5"
          >
            <p className="text-xs text-muted-foreground mb-1">
              {locale === "zh"
                ? `问题 ${history.length} / ?`
                : `Question ${history.length} / ?`}
            </p>
            <h4 className="font-semibold text-sm mb-4">
              {currentNode.question[locale]}
            </h4>
            <div className="space-y-2">
              {currentNode.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(option)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-colors text-sm"
                >
                  {option.label[locale]}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {(history.length > 1 || result) && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            {locale === "zh" ? "重新开始" : "Start over"}
          </Button>
        </div>
      )}
    </div>
  );
}
