"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/learn/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface AuthStep {
  label: { en: string; zh: string };
  description: { en: string; zh: string };
  icon: string;
  highlight: string;
}

const steps: AuthStep[] = [
  {
    label: { en: "User opens /login", zh: "用户打开 /login" },
    description: {
      en: "The user navigates to the login page. The (auth) route group renders a clean layout without the sidebar — just the login form.",
      zh: "用户导航到登录页面。(auth) 路由组渲染一个简洁的布局，没有侧边栏——只有登录表单。",
    },
    icon: "🔗",
    highlight: "bg-blue-100 border-blue-300",
  },
  {
    label: { en: "User enters credentials", zh: "用户输入凭据" },
    description: {
      en: "The user types their email and password. The form validates inputs on the client side (email format, password length) before submitting.",
      zh: "用户输入邮箱和密码。表单在客户端验证输入（邮箱格式、密码长度）后再提交。",
    },
    icon: "✏️",
    highlight: "bg-slate-100 border-slate-300",
  },
  {
    label: { en: "Request sent to Supabase Auth", zh: "请求发送到 Supabase Auth" },
    description: {
      en: "The frontend calls supabase.auth.signInWithPassword(). This sends an HTTPS request to Supabase's auth server, which checks the email/password against its user database.",
      zh: "前端调用 supabase.auth.signInWithPassword()。这会向 Supabase 的认证服务器发送 HTTPS 请求，服务器对照用户数据库检查邮箱/密码。",
    },
    icon: "📡",
    highlight: "bg-emerald-100 border-emerald-300",
  },
  {
    label: { en: "JWT token issued", zh: "颁发 JWT 令牌" },
    description: {
      en: "If credentials are valid, Supabase returns a JWT (JSON Web Token) — a cryptographically signed string that proves who you are. It's stored in an HTTP-only cookie for security.",
      zh: "如果凭据有效，Supabase 返回一个 JWT（JSON Web Token）——一个加密签名的字符串，证明你是谁。为安全起见，它存储在 HTTP-only cookie 中。",
    },
    icon: "🎫",
    highlight: "bg-amber-100 border-amber-300",
  },
  {
    label: { en: "Middleware checks every request", zh: "中间件检查每个请求" },
    description: {
      en: "Next.js middleware runs BEFORE any page loads. It reads the JWT cookie, verifies it with Supabase, and either allows the request to continue or redirects to /login.",
      zh: "Next.js 中间件在任何页面加载之前运行。它读取 JWT cookie，通过 Supabase 验证，然后允许请求继续或重定向到 /login。",
    },
    icon: "🛡️",
    highlight: "bg-purple-100 border-purple-300",
  },
  {
    label: { en: "Protected page loads", zh: "受保护页面加载" },
    description: {
      en: "The middleware approved the request, so the page component renders. The AuthGate component provides the user's data (id, email) to all child components via React Context.",
      zh: "中间件批准了请求，页面组件开始渲染。AuthGate 组件通过 React Context 将用户数据（id、email）提供给所有子组件。",
    },
    icon: "✅",
    highlight: "bg-green-100 border-green-300",
  },
  {
    label: { en: "API routes verify too", zh: "API 路由也会验证" },
    description: {
      en: "When the page fetches data from /api/habits, the API route ALSO reads the JWT to know which user's data to return. Double verification: middleware protects pages, API routes protect data.",
      zh: "当页面从 /api/habits 获取数据时，API 路由也会读取 JWT 以知道返回哪个用户的数据。双重验证：中间件保护页面，API 路由保护数据。",
    },
    icon: "🔐",
    highlight: "bg-rose-100 border-rose-300",
  },
];

interface Props {
  locale: Locale;
}

export function AuthFlowDiagram({ locale }: Props) {
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

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(goNext, 3500);
    return () => clearInterval(timer);
  }, [isPlaying, goNext]);

  return (
    <div className="space-y-4">
      {/* Progress dots */}
      <div className="flex items-center gap-1">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            aria-label={locale === "zh" ? `步骤 ${i + 1}` : `Step ${i + 1}`}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= currentStep ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className={cn("rounded-xl border-2 p-5", step.highlight)}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{step.icon}</span>
            <div>
              <p className="text-xs text-muted-foreground">
                {locale === "zh"
                  ? `步骤 ${currentStep + 1} / ${steps.length}`
                  : `Step ${currentStep + 1} of ${steps.length}`}
              </p>
              <h4 className="font-semibold text-sm">{step.label[locale]}</h4>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description[locale]}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={goPrev} disabled={currentStep === 0}>
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
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={goNext} disabled={currentStep === steps.length - 1}>
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
