"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/learn/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Rocket, RotateCcw } from "lucide-react";

interface DeployStep {
  label: { en: string; zh: string };
  description: { en: string; zh: string };
  duration: number; // ms to simulate
  icon: string;
  logs: string[];
}

const steps: DeployStep[] = [
  {
    label: { en: "Git Push", zh: "Git 推送" },
    description: {
      en: "You push your code to GitHub. Vercel is watching your repository and detects the new commit.",
      zh: "你将代码推送到 GitHub。Vercel 正在监视你的仓库并检测到新的提交。",
    },
    duration: 1500,
    icon: "📤",
    logs: [
      "$ git push origin main",
      "Enumerating objects: 42, done.",
      "Counting objects: 100% (42/42), done.",
      "remote: Resolving deltas: 100% (18/18)",
      "To github.com:user/studytracker.git",
      "   a31e518..f8c2b1a  main -> main",
    ],
  },
  {
    label: { en: "Vercel Build Triggered", zh: "Vercel 构建触发" },
    description: {
      en: "Vercel clones your repo, installs dependencies (npm install), and generates the Prisma client.",
      zh: "Vercel 克隆你的仓库，安装依赖（npm install），并生成 Prisma 客户端。",
    },
    duration: 2000,
    icon: "🔨",
    logs: [
      "Cloning github.com/user/studytracker...",
      "Installing dependencies...",
      "npm install: added 847 packages in 23s",
      "Running prisma generate...",
      "✔ Generated Prisma Client",
    ],
  },
  {
    label: { en: "Next.js Build", zh: "Next.js 构建" },
    description: {
      en: "Next.js compiles your TypeScript, optimizes images, generates static pages, and bundles JavaScript.",
      zh: "Next.js 编译 TypeScript，优化图片，生成静态页面，并打包 JavaScript。",
    },
    duration: 2500,
    icon: "⚙️",
    logs: [
      "▲ Next.js 15.5.14",
      "Creating an optimized production build...",
      "Compiled successfully",
      "Generating static pages (8/8)",
      "Route (app)  Size  First Load JS",
      "├ /learn     3.2kB  137kB",
      "├ /habits    5.9kB  149kB",
      "✓ Build completed in 28s",
    ],
  },
  {
    label: { en: "Environment Variables", zh: "环境变量" },
    description: {
      en: "Vercel injects your secret environment variables (DATABASE_URL, SUPABASE_KEY) at build time. These are never exposed in the browser.",
      zh: "Vercel 在构建时注入你的秘密环境变量（DATABASE_URL、SUPABASE_KEY）。这些永远不会暴露在浏览器中。",
    },
    duration: 800,
    icon: "🔑",
    logs: [
      "Loaded env from project settings",
      "DATABASE_URL: ****",
      "DIRECT_URL: ****",
      "NEXT_PUBLIC_SUPABASE_URL: https://xxx.supabase.co",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbG...",
    ],
  },
  {
    label: { en: "Deploy to Edge Network", zh: "部署到边缘网络" },
    description: {
      en: "Vercel distributes your app to data centers worldwide. Users get served from the nearest location for minimal latency.",
      zh: "Vercel 将你的应用分发到全球数据中心。用户从最近的位置获取服务，延迟最小。",
    },
    duration: 1200,
    icon: "🌍",
    logs: [
      "Deploying to Vercel Edge Network...",
      "Uploading build artifacts (4.2MB)...",
      "Propagating to 30+ regions...",
      "✓ Production: studytracker.vercel.app",
      "✓ Ready in 1m 12s",
    ],
  },
];

interface Props {
  locale: Locale;
}

export function DeploymentSimulator({ locale }: Props) {
  const [currentStep, setCurrentStep] = useState(-1); // -1 = not started
  const [logLines, setLogLines] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      logTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  const simulateStep = useCallback(
    (stepIdx: number) => {
      if (stepIdx >= steps.length) {
        setCurrentStep(steps.length); // out of range so step becomes null
        setIsRunning(false);
        return;
      }

      // Clear any outstanding log timers from the previous step
      logTimersRef.current.forEach(clearTimeout);
      logTimersRef.current = [];

      const step = steps[stepIdx];
      setCurrentStep(stepIdx);
      setLogLines([]);

      // Gradually reveal log lines
      step.logs.forEach((line, i) => {
        const timer = setTimeout(() => {
          setLogLines((prev) => [...prev, line]);
        }, (i + 1) * (step.duration / (step.logs.length + 1)));
        logTimersRef.current.push(timer);
      });

      // Move to next step after duration
      timerRef.current = setTimeout(() => {
        simulateStep(stepIdx + 1);
      }, step.duration);
    },
    []
  );

  const handleStart = () => {
    setIsRunning(true);
    setCurrentStep(-1);
    setLogLines([]);
    logTimersRef.current.forEach(clearTimeout);
    logTimersRef.current = [];
    if (timerRef.current) clearTimeout(timerRef.current);
    simulateStep(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setLogLines([]);
    if (timerRef.current) clearTimeout(timerRef.current);
    logTimersRef.current.forEach(clearTimeout);
    logTimersRef.current = [];
  };

  const step = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;
  const isComplete = currentStep === steps.length;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-2 rounded-full transition-colors",
              i < currentStep
                ? "bg-emerald-500"
                : i === currentStep
                  ? "bg-primary animate-pulse"
                  : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Current step info */}
      <AnimatePresence mode="wait">
        {step ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-border/50 bg-white p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{step.icon}</span>
              <div>
                <p className="text-xs text-muted-foreground">
                  {locale === "zh"
                    ? `步骤 ${currentStep + 1} / ${steps.length}`
                    : `Step ${currentStep + 1} of ${steps.length}`}
                </p>
                <h4 className="font-semibold text-sm">{step.label[locale]}</h4>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{step.description[locale]}</p>

            {/* Terminal output */}
            <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs max-h-48 overflow-y-auto">
              {logLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "text-slate-300",
                    line.startsWith("✓") && "text-emerald-400",
                    line.startsWith("$") && "text-amber-300",
                    line.includes("****") && "text-rose-400"
                  )}
                >
                  {line}
                </motion.div>
              ))}
              {isRunning && (
                <span className="inline-block w-2 h-4 bg-slate-400 animate-pulse" />
              )}
            </div>
          </motion.div>
        ) : isComplete ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 text-center"
          >
            <span className="text-3xl block mb-2">🎉</span>
            <p className="font-semibold text-emerald-800">
              {locale === "zh" ? "部署成功！" : "Deployment successful!"}
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              {locale === "zh"
                ? "你的网站已上线：studytracker.vercel.app"
                : "Your site is live: studytracker.vercel.app"}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        {currentStep === -1 && !isRunning ? (
          <Button size="sm" onClick={handleStart}>
            <Rocket className="h-4 w-4 mr-1.5" />
            {locale === "zh" ? "开始部署模拟" : "Start Deploy Simulation"}
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            {locale === "zh" ? "重新开始" : "Reset"}
          </Button>
        )}
      </div>
    </div>
  );
}
