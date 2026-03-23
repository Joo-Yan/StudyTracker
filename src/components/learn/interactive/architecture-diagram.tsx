"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/learn/i18n";
import { cn } from "@/lib/utils";

interface ArchitectureNode {
  id: string;
  label: { en: string; zh: string };
  description: { en: string; zh: string };
  x: number;
  y: number;
  color: string;
  icon: string;
}

interface ArchitectureEdge {
  from: string;
  to: string;
  label?: { en: string; zh: string };
}

const nodes: ArchitectureNode[] = [
  {
    id: "browser",
    label: { en: "Browser", zh: "浏览器" },
    description: {
      en: "The user's web browser (Chrome, Safari, etc.) — this is where the frontend runs. It sends requests and displays the HTML/CSS/JS it receives.",
      zh: "用户的浏览器（Chrome、Safari 等）——前端在这里运行。它发送请求并显示收到的 HTML/CSS/JS。",
    },
    x: 50,
    y: 8,
    color: "bg-blue-100 border-blue-400 text-blue-800",
    icon: "🌐",
  },
  {
    id: "nextjs",
    label: { en: "Next.js Pages", zh: "Next.js 页面" },
    description: {
      en: "React components rendered by Next.js. Server Components run on the server, Client Components hydrate in the browser. Files in app/ define routes.",
      zh: "由 Next.js 渲染的 React 组件。服务器组件在服务器上运行，客户端组件在浏览器中激活。app/ 中的文件定义路由。",
    },
    x: 20,
    y: 38,
    color: "bg-slate-100 border-slate-500 text-slate-800",
    icon: "⚛️",
  },
  {
    id: "api",
    label: { en: "API Routes", zh: "API 路由" },
    description: {
      en: "Server-side functions in app/api/ that handle data operations. They receive requests from the frontend, process them, and return JSON responses.",
      zh: "app/api/ 中的服务器端函数，处理数据操作。它们接收来自前端的请求，处理后返回 JSON 响应。",
    },
    x: 65,
    y: 38,
    color: "bg-emerald-100 border-emerald-400 text-emerald-800",
    icon: "🔌",
  },
  {
    id: "prisma",
    label: { en: "Prisma ORM", zh: "Prisma ORM" },
    description: {
      en: "A type-safe database toolkit. Instead of writing raw SQL, you use JavaScript/TypeScript methods like prisma.habit.findMany() to query data.",
      zh: "类型安全的数据库工具包。无需编写原始 SQL，使用 JavaScript/TypeScript 方法如 prisma.habit.findMany() 查询数据。",
    },
    x: 65,
    y: 65,
    color: "bg-purple-100 border-purple-400 text-purple-800",
    icon: "🔷",
  },
  {
    id: "db",
    label: { en: "PostgreSQL", zh: "PostgreSQL 数据库" },
    description: {
      en: "The relational database where all your data lives — habits, todos, projects, user settings. Hosted on Supabase's cloud infrastructure.",
      zh: "存放所有数据的关系型数据库——习惯、待办、项目、用户设置。托管在 Supabase 的云基础设施上。",
    },
    x: 50,
    y: 88,
    color: "bg-amber-100 border-amber-400 text-amber-800",
    icon: "🗄️",
  },
  {
    id: "auth",
    label: { en: "Supabase Auth", zh: "Supabase 认证" },
    description: {
      en: "Handles user registration, login, and session management. Issues JWT tokens that prove who you are on every request.",
      zh: "处理用户注册、登录和会话管理。颁发 JWT 令牌，在每次请求中证明你的身份。",
    },
    x: 10,
    y: 65,
    color: "bg-rose-100 border-rose-400 text-rose-800",
    icon: "🔐",
  },
];

const edges: ArchitectureEdge[] = [
  {
    from: "browser",
    to: "nextjs",
    label: { en: "Page requests", zh: "页面请求" },
  },
  {
    from: "browser",
    to: "api",
    label: { en: "fetch() API calls", zh: "fetch() API 调用" },
  },
  {
    from: "api",
    to: "prisma",
    label: { en: "Database queries", zh: "数据库查询" },
  },
  {
    from: "prisma",
    to: "db",
    label: { en: "SQL", zh: "SQL" },
  },
  {
    from: "nextjs",
    to: "auth",
    label: { en: "Auth check", zh: "认证检查" },
  },
  {
    from: "api",
    to: "auth",
    label: { en: "Verify user", zh: "验证用户" },
  },
];

interface Props {
  locale: Locale;
}

function getNodeCenter(node: ArchitectureNode) {
  return { x: node.x + 10, y: node.y + 5 };
}

export function ArchitectureDiagram({ locale }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedNode = nodes.find((n) => n.id === selected);

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl border border-border/50 bg-gradient-to-b from-white to-muted/20 p-4 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from)!;
            const toNode = nodes.find((n) => n.id === edge.to)!;
            const from = getNodeCenter(fromNode);
            const to = getNodeCenter(toNode);
            const isHighlighted =
              selected === edge.from || selected === edge.to;

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <motion.path
                  d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                  stroke={isHighlighted ? "#3b82f6" : "#d1d5db"}
                  strokeWidth={isHighlighted ? 0.6 : 0.3}
                  strokeDasharray={isHighlighted ? undefined : "1.5 1"}
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </g>
            );
          })}
        </svg>

        <div className="relative grid grid-cols-4 gap-3" style={{ minHeight: "320px" }}>
          {nodes.map((node) => (
            <motion.button
              key={node.id}
              onClick={() => setSelected(selected === node.id ? null : node.id)}
              aria-label={node.label[locale]}
              className={cn(
                "absolute rounded-xl border-2 px-3 py-2 text-center transition-all hover:shadow-md cursor-pointer z-10",
                node.color,
                selected === node.id && "ring-2 ring-blue-500 shadow-lg"
              )}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                minWidth: "80px",
              }}
              initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: selected === node.id ? 1.05 : 1, x: "-50%", y: "-50%" }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.08 }}
            >
              <span className="text-lg block">{node.icon}</span>
              <span className="text-xs font-semibold block whitespace-nowrap">
                {node.label[locale]}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {selectedNode && (
        <motion.div
          key={selectedNode.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className={cn(
            "rounded-lg border-2 p-4",
            selectedNode.color
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{selectedNode.icon}</span>
            <span className="font-semibold text-sm">{selectedNode.label[locale]}</span>
          </div>
          <p className="text-xs leading-relaxed">{selectedNode.description[locale]}</p>
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        {locale === "zh"
          ? "点击节点查看详细说明"
          : "Click a node to see its description"}
      </p>
    </div>
  );
}
