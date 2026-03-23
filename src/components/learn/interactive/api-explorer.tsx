"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/learn/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

interface MockEndpoint {
  method: "GET" | "POST" | "DELETE";
  path: string;
  description: { en: string; zh: string };
  requestBody?: string;
  responseStatus: number;
  responseBody: string;
  headers: Record<string, string>;
}

const endpoints: MockEndpoint[] = [
  {
    method: "GET",
    path: "/api/habits",
    description: {
      en: "Fetch all habits for the current user",
      zh: "获取当前用户的所有习惯",
    },
    responseStatus: 200,
    responseBody: JSON.stringify(
      [
        { id: 1, title: "Read 30 min", streak: 12, completed_today: true },
        { id: 2, title: "Exercise", streak: 5, completed_today: false },
        { id: 3, title: "Meditate", streak: 20, completed_today: true },
      ],
      null,
      2
    ),
    headers: {
      "Content-Type": "application/json",
      Cookie: "sb-auth-token=<httponly-session-cookie>",
    },
  },
  {
    method: "POST",
    path: "/api/habits",
    description: {
      en: "Create a new habit",
      zh: "创建新习惯",
    },
    requestBody: JSON.stringify({ title: "Learn coding", frequencyType: "daily" }, null, 2),
    responseStatus: 201,
    responseBody: JSON.stringify(
      { id: 4, title: "Learn coding", frequencyType: "daily", streak: 0, createdAt: "2025-01-15T10:30:00Z" },
      null,
      2
    ),
    headers: {
      "Content-Type": "application/json",
      Cookie: "sb-auth-token=<httponly-session-cookie>",
    },
  },
  {
    method: "GET",
    path: "/api/stats",
    description: {
      en: "Get aggregated statistics across all modules",
      zh: "获取所有模块的聚合统计数据",
    },
    responseStatus: 200,
    responseBody: JSON.stringify(
      {
        habits: { total: 8, completedToday: 5, longestStreak: 30 },
        todos: { total: 24, completed: 18, pending: 6 },
        projects: { active: 3, completed: 7 },
      },
      null,
      2
    ),
    headers: {
      "Content-Type": "application/json",
      Cookie: "sb-auth-token=<httponly-session-cookie>",
    },
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-blue-100 text-blue-700",
  POST: "bg-green-100 text-green-700",
  DELETE: "bg-red-100 text-red-700",
};

const HTTP_STATUS_TEXT: Record<number, string> = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  500: "Internal Server Error",
};

function statusText(code: number): string {
  return HTTP_STATUS_TEXT[code] ?? "Unknown";
}

interface Props {
  locale: Locale;
}

export function ApiExplorer({ locale }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const endpoint = endpoints[selectedIdx];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSend = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLoading(true);
    setSent(false);
    timerRef.current = setTimeout(() => {
      setLoading(false);
      setSent(true);
      timerRef.current = null;
    }, 800);
  };

  const handleSelect = (idx: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelectedIdx(idx);
    setSent(false);
    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-border/50 bg-white overflow-hidden">
      {/* Endpoint selector */}
      <div className="border-b border-border/50 p-3 space-y-2">
        {endpoints.map((ep, i) => (
          <button
            key={ep.path + ep.method}
            onClick={() => handleSelect(i)}
            className={cn(
              "flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
              selectedIdx === i
                ? "bg-muted/50 ring-1 ring-border"
                : "hover:bg-muted/30"
            )}
          >
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                methodColors[ep.method]
              )}
            >
              {ep.method}
            </span>
            <span className="font-mono text-xs">{ep.path}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {ep.description[locale]}
            </span>
          </button>
        ))}
      </div>

      {/* Request/Response area */}
      <div className="p-4 space-y-4">
        {/* Request */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {locale === "zh" ? "请求" : "Request"}
            </h4>
            <Button size="sm" onClick={handleSend} disabled={loading}>
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Send className="h-3 w-3 mr-1" />
                  {locale === "zh" ? "发送" : "Send"}
                </>
              )}
            </Button>
          </div>

          <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono space-y-2">
            <div className="text-slate-300">
              <span className={cn("font-bold", endpoint.method === "GET" ? "text-blue-400" : "text-green-400")}>
                {endpoint.method}
              </span>{" "}
              <span className="text-slate-100">{endpoint.path}</span>
            </div>
            <div className="text-slate-500">
              {Object.entries(endpoint.headers).map(([key, value]) => (
                <div key={key}>
                  <span className="text-slate-400">{key}:</span> {value}
                </div>
              ))}
            </div>
            {endpoint.requestBody && (
              <div>
                <div className="text-slate-500 mb-1">Body:</div>
                <pre className="text-amber-300 whitespace-pre">{endpoint.requestBody}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Response */}
        <AnimatePresence>
          {sent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {locale === "zh" ? "响应" : "Response"}
              </h4>
              <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono">
                <div className="mb-2">
                  <span className="text-slate-400">Status: </span>
                  <span className={endpoint.responseStatus < 300 ? "text-green-400" : "text-red-400"}>
                    {endpoint.responseStatus} {statusText(endpoint.responseStatus)}
                  </span>
                </div>
                <pre className="text-emerald-300 whitespace-pre overflow-x-auto">
                  {endpoint.responseBody}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
