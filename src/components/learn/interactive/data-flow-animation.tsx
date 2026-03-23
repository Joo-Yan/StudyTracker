"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/learn/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface FlowStep {
  label: { en: string; zh: string };
  description: { en: string; zh: string };
  code?: string;
  highlight: string;
  icon: string;
}

const steps: FlowStep[] = [
  {
    label: { en: "User clicks 'Save Habit'", zh: "用户点击「保存习惯」" },
    description: {
      en: "The user fills in a habit name and clicks the save button. This triggers an event handler in the React component.",
      zh: "用户填写习惯名称并点击保存按钮。这会触发 React 组件中的事件处理函数。",
    },
    code: `onClick={() => handleSave(habitName)}`,
    highlight: "browser",
    icon: "👆",
  },
  {
    label: { en: "Frontend sends fetch() request", zh: "前端发送 fetch() 请求" },
    description: {
      en: "The frontend uses the Fetch API to send an HTTP POST request to the backend API route. The habit data is included in the request body as JSON.",
      zh: "前端使用 Fetch API 向后端 API 路由发送 HTTP POST 请求。习惯数据以 JSON 格式包含在请求体中。",
    },
    code: `fetch("/api/habits", {
  method: "POST",
  body: JSON.stringify({ name: habitName }),
})`,
    highlight: "network",
    icon: "📡",
  },
  {
    label: { en: "API route receives request", zh: "API 路由接收请求" },
    description: {
      en: "The server-side API route function (in app/api/habits/route.ts) receives the request. It first checks if the user is authenticated.",
      zh: "服务器端的 API 路由函数（在 app/api/habits/route.ts 中）接收请求。它首先检查用户是否已认证。",
    },
    code: `export async function POST(request: Request) {
  const { user } = await supabase.auth.getUser();
  const body = await request.json();`,
    highlight: "server",
    icon: "🖥️",
  },
  {
    label: { en: "Prisma writes to database", zh: "Prisma 写入数据库" },
    description: {
      en: "Prisma ORM translates the JavaScript method call into an SQL INSERT statement and sends it to the PostgreSQL database.",
      zh: "Prisma ORM 将 JavaScript 方法调用转换为 SQL INSERT 语句，并发送到 PostgreSQL 数据库。",
    },
    code: `const habit = await prisma.habit.create({
  data: { name: body.name, userId: user.id },
});`,
    highlight: "database",
    icon: "💾",
  },
  {
    label: { en: "Database confirms save", zh: "数据库确认保存" },
    description: {
      en: "PostgreSQL stores the new habit row and returns the created record (with an auto-generated ID and timestamp) back to Prisma.",
      zh: "PostgreSQL 存储新的习惯记录，并将创建的记录（带有自动生成的 ID 和时间戳）返回给 Prisma。",
    },
    highlight: "database",
    icon: "✅",
  },
  {
    label: { en: "API sends JSON response", zh: "API 发送 JSON 响应" },
    description: {
      en: "The API route packages the created habit into a JSON response and sends it back to the browser with a 201 (Created) status code.",
      zh: "API 路由将创建的习惯打包成 JSON 响应，并以 201（已创建）状态码发送回浏览器。",
    },
    code: `return NextResponse.json(habit, { status: 201 });`,
    highlight: "network",
    icon: "📨",
  },
  {
    label: { en: "UI updates with new habit", zh: "界面更新显示新习惯" },
    description: {
      en: "The frontend receives the response, adds the new habit to the React state, and the component automatically re-renders to show it in the list.",
      zh: "前端接收响应，将新习惯添加到 React 状态中，组件自动重新渲染以在列表中显示它。",
    },
    code: `setHabits(prev => [...prev, newHabit]);`,
    highlight: "browser",
    icon: "🎉",
  },
];

const highlightColors: Record<string, string> = {
  browser: "bg-blue-100 border-blue-300",
  network: "bg-amber-100 border-amber-300",
  server: "bg-emerald-100 border-emerald-300",
  database: "bg-purple-100 border-purple-300",
};

interface Props {
  locale: Locale;
}

export function DataFlowAnimation({ locale }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const step = steps[currentStep];

  const goNext = useCallback(() => {
    setCurrentStep((s) => {
      if (s < steps.length - 1) return s + 1;
      setIsPlaying(false);
      return s;
    });
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStep((s) => (s > 0 ? s - 1 : s));
  }, []);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(goNext, 3000);
    return () => clearInterval(timer);
  }, [isPlaying, goNext]);

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= currentStep ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Step display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "rounded-xl border-2 p-5",
            highlightColors[step.highlight]
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{step.icon}</span>
            <div>
              <p className="text-xs text-muted-foreground">
                {locale === "zh" ? `步骤 ${currentStep + 1} / ${steps.length}` : `Step ${currentStep + 1} of ${steps.length}`}
              </p>
              <h4 className="font-semibold text-sm">{step.label[locale]}</h4>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            {step.description[locale]}
          </p>

          {step.code && (
            <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 text-xs overflow-x-auto font-mono">
              <code>{step.code}</code>
            </pre>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goPrev}
          disabled={currentStep === 0}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (isPlaying) {
              setIsPlaying(false);
            } else {
              setIsPlaying(true);
              if (currentStep === steps.length - 1) setCurrentStep(0);
            }
          }}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goNext}
          disabled={currentStep === steps.length - 1}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
