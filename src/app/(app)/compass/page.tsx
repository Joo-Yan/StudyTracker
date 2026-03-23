"use client";

import { useEffect, useRef, useState } from "react";
import { Compass } from "lucide-react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const PLACEHOLDER = `在这里记录你的人生方向...

一些可以写的内容：
• 你对未来的构想和愿景
• 让你充满热情的事（Passion）
• 人生目标和核心追求
• 自我优化和完善的方向
• 当前阶段最值得投入的事
• 对你来说真正重要的事情`;

export default function CompassPage() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadRef = useRef(true);
  const hasEditedRef = useRef(false);
  const skipNextSaveRef = useRef(false);

  useEffect(() => {
    fetch("/api/compass")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && !hasEditedRef.current) {
          skipNextSaveRef.current = true;
          setContent(data.content);
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setStatus("saving");
      try {
        const res = await fetch("/api/compass", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        setStatus(res.ok ? "saved" : "error");
      } catch {
        setStatus("error");
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content]);

  const statusText: Record<SaveStatus, string> = {
    idle: "",
    saving: "Saving...",
    saved: "Saved",
    error: "Save failed",
  };
  const statusColor: Record<SaveStatus, string> = {
    idle: "",
    saving: "text-muted-foreground",
    saved: "text-green-600",
    error: "text-destructive",
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Life Compass</h1>
        </div>
        {status !== "idle" && (
          <span className={`text-xs ${statusColor[status]}`}>
            {statusText[status]}
          </span>
        )}
      </div>
      <textarea
        className="flex-1 w-full resize-none rounded-xl border bg-background p-4 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
        placeholder={PLACEHOLDER}
        value={content}
        onChange={(e) => { hasEditedRef.current = true; setContent(e.target.value); }}
      />
    </div>
  );
}
