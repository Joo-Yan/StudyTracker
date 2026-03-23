"use client";

import type { Locale } from "@/lib/learn/i18n";
import { getContent } from "@/lib/learn/i18n";
import { codeSamples, getAnnotations } from "@/lib/learn/code-samples";
import { SectionBlock } from "@/components/learn/content/section-block";
import { AnalogyCard } from "@/components/learn/content/analogy-card";
import { KeyConcept } from "@/components/learn/content/key-concept";
import { TipCallout } from "@/components/learn/content/tip-callout";
import { CodeViewer } from "@/components/learn/interactive/code-viewer";
import {
  FileTreeExplorer,
  type TreeNode,
} from "@/components/learn/interactive/file-tree-explorer";
import { InlineMarkdown } from "@/components/learn/content/inline-markdown";
import { Quiz } from "@/components/learn/interactive/quiz";
import { quizData } from "@/lib/learn/quiz-data";
import {
  FolderTree,
  Building,
  Eye,
  FolderOpen,
  Layers,
  Grid3X3,
  Code,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Chapter2Props {
  locale: Locale;
}

function getProjectTree(locale: Locale): TreeNode[] {
  const d = (en: string, zh: string) => (locale === "zh" ? zh : en);
  return [
    {
      name: "src/",
      description: d("Main source code folder", "主要源代码文件夹"),
      children: [
        {
          name: "app/",
          description: d(
            "Pages & API routes — folder structure = URL structure",
            "页面和 API 路由——文件夹结构 = URL 结构"
          ),
          children: [
            {
              name: "(app)/",
              description: d(
                "Route group for authenticated app pages (shared sidebar layout)",
                "已认证的应用页面路由组（共享侧边栏布局）"
              ),
              children: [
                {
                  name: "page.tsx",
                  description: d("Dashboard — the / home page", "仪表盘—— / 首页"),
                },
                { name: "habits/", children: [{ name: "page.tsx" }] },
                { name: "todos/", children: [{ name: "page.tsx" }] },
                { name: "okr/", children: [{ name: "page.tsx" }] },
                {
                  name: "projects/",
                  children: [
                    { name: "page.tsx" },
                    {
                      name: "[id]/",
                      description: d(
                        "Dynamic route — [id] becomes the project ID in the URL",
                        "动态路由——[id] 变成 URL 中的项目 ID"
                      ),
                      children: [{ name: "page.tsx" }],
                    },
                  ],
                },
                { name: "content/", children: [{ name: "page.tsx" }] },
                { name: "ideas/", children: [{ name: "page.tsx" }] },
                { name: "compass/", children: [{ name: "page.tsx" }] },
                { name: "stats/", children: [{ name: "page.tsx" }] },
                {
                  name: "layout.tsx",
                  description: d(
                    "Shared layout: Sidebar + Header + AuthGate wrapping all (app) pages",
                    "共享布局：为所有 (app) 页面添加侧边栏 + 头部 + 认证守卫"
                  ),
                },
              ],
            },
            {
              name: "(auth)/",
              description: d(
                "Route group for login/register (simpler layout, no sidebar)",
                "登录/注册路由组（更简洁的布局，无侧边栏）"
              ),
              children: [
                { name: "login/", children: [{ name: "page.tsx" }] },
                { name: "register/", children: [{ name: "page.tsx" }] },
              ],
            },
            {
              name: "(learn)/",
              description: d(
                "Route group for this learning module (public, no auth required)",
                "学习模块路由组（公开访问，无需登录）"
              ),
              children: [
                {
                  name: "learn/",
                  children: [
                    { name: "page.tsx", description: d("Course overview", "课程概览") },
                    { name: "[chapter]/", children: [{ name: "page.tsx" }] },
                  ],
                },
              ],
            },
            {
              name: "api/",
              description: d(
                "Backend API routes — run on the server, not in the browser",
                "后端 API 路由——运行在服务器上，而不是浏览器中"
              ),
              children: [
                { name: "habits/", children: [{ name: "route.ts" }] },
                { name: "todos/", children: [{ name: "route.ts" }] },
                { name: "okr/", children: [{ name: "route.ts" }] },
                { name: "projects/", children: [{ name: "route.ts" }] },
                { name: "stats/", children: [{ name: "route.ts" }] },
              ],
            },
          ],
        },
        {
          name: "components/",
          description: d(
            "Reusable UI building blocks — used across multiple pages",
            "可复用的 UI 构建块——在多个页面中使用"
          ),
          children: [
            { name: "ui/", description: d("Base components: Button, Card, Badge, Input...", "基础组件：Button、Card、Badge、Input...") },
            { name: "layout/", description: d("Sidebar and Header", "侧边栏和头部") },
            { name: "shared/", description: d("AuthGate, TagFilter, TagInput", "AuthGate、TagFilter、TagInput") },
            { name: "habits/", description: d("Habit-specific: dialog, heatmap", "习惯专用：对话框、热力图") },
            { name: "stats/", description: d("Charts and visualizations", "图表和可视化") },
          ],
        },
        {
          name: "lib/",
          description: d("Utilities, helpers, and configuration", "工具函数、辅助代码和配置"),
          children: [
            { name: "supabase/", description: d("Auth & database client setup", "认证和数据库客户端配置") },
            { name: "utils.ts", description: d("Common utility functions", "通用工具函数") },
            { name: "auth-context.tsx", description: d("User authentication state", "用户认证状态") },
          ],
        },
      ],
    },
    {
      name: "prisma/",
      description: d("Database schema definition", "数据库模式定义"),
      children: [
        { name: "schema.prisma", description: d("Tables, columns, and relationships", "表、列和关系") },
      ],
    },
    { name: "package.json", description: d("Project dependencies list", "项目依赖列表") },
    { name: "next.config.ts", description: d("Next.js configuration", "Next.js 配置") },
    { name: "tailwind.config.ts", description: d("Tailwind CSS theme config", "Tailwind CSS 主题配置") },
    { name: "tsconfig.json", description: d("TypeScript settings", "TypeScript 设置") },
  ];
}

export function Chapter2ProjectStructure({ locale }: Chapter2Props) {
  const t = getContent(locale);
  const s = t.chapters["project-structure"].sections;
  const pageSample = codeSamples.pageRouteExample;
  const folderSample = codeSamples.folderStructureExample;

  return (
    <div className="space-y-8">
      <SectionBlock icon={FolderTree} title={s.intro.title}>
        <p><InlineMarkdown text={s.intro.body} /></p>
      </SectionBlock>

      <SectionBlock icon={Building} title={s.analogy.title}>
        <AnalogyCard title={s.analogy.analogyTitle}>
          <p><InlineMarkdown text={s.analogy.analogyBody} /></p>
        </AnalogyCard>
      </SectionBlock>

      <SectionBlock icon={Eye} title={s.overview.title}>
        <p className="mb-4"><InlineMarkdown text={s.overview.body} /></p>
        <CodeViewer
          code={folderSample.code}
          language={folderSample.language}
          filename={folderSample.filename}
          annotations={getAnnotations(folderSample, locale)}
          highlightLines={folderSample.highlightLines}
        />
      </SectionBlock>

      <SectionBlock icon={FolderOpen} title={s.appDir.title}>
        <p className="mb-2"><InlineMarkdown text={s.appDir.body} /></p>
        <p className="text-xs text-muted-foreground mb-3">
          {t.ui.clickToExplore}
        </p>
        <FileTreeExplorer
          tree={getProjectTree(locale)}
          defaultExpanded={["src/", "src//app/"]}
        />
      </SectionBlock>

      <SectionBlock icon={Layers} title={s.routeGroups.title}>
        <p className="mb-3"><InlineMarkdown text={s.routeGroups.body} /></p>
        <KeyConcept term={s.routeGroups.term}>
          <p><InlineMarkdown text={s.routeGroups.definition} /></p>
        </KeyConcept>
      </SectionBlock>

      <SectionBlock icon={Grid3X3} title={s.modules.title}>
        <p className="mb-3"><InlineMarkdown text={s.modules.body} /></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {s.modules.list.map((mod, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
            >
              <Badge variant="secondary" className="text-xs shrink-0">
                {i + 1}
              </Badge>
              <div>
                <span className="text-sm font-medium"><InlineMarkdown text={mod.name} /></span>
                <span className="text-xs text-muted-foreground ml-1.5">
                  <InlineMarkdown text={mod.desc} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock icon={Code} title={s.codeExample.title}>
        <p className="mb-4"><InlineMarkdown text={s.codeExample.body} /></p>
        <CodeViewer
          code={pageSample.code}
          language={pageSample.language}
          filename={pageSample.filename}
          annotations={getAnnotations(pageSample, locale)}
          highlightLines={pageSample.highlightLines}
        />
      </SectionBlock>

      <TipCallout><InlineMarkdown text={s.tip} /></TipCallout>

      <SectionBlock icon={HelpCircle} title={t.ui.quizTitle}>
        <Quiz questions={quizData["project-structure"]} locale={locale} />
      </SectionBlock>
    </div>
  );
}
