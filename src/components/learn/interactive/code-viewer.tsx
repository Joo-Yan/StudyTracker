"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Annotation {
  line: number;
  text: string;
}

interface CodeViewerProps {
  /** Must be static/trusted content — rendered via dangerouslySetInnerHTML after shiki processing */
  code: string;
  language?: string;
  annotations?: Annotation[];
  highlightLines?: number[];
  filename?: string;
}

export function CodeViewer({
  code,
  language = "typescript",
  annotations = [],
  highlightLines = [],
  filename,
}: CodeViewerProps) {
  const [html, setHtml] = useState<string>("");
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function highlight() {
      try {
        const { codeToHtml } = await import("shiki");
        const result = await codeToHtml(code.trim(), {
          lang: language,
          theme: "github-light",
        });
        if (!cancelled) setHtml(result);
      } catch {
        // Fallback plain text stays visible
      }
    }
    highlight();
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const lines = code.trim().split("\n");
  const annotationMap = new Map(annotations.map((a) => [a.line, a]));

  const activeAnn = activeAnnotation !== null ? annotationMap.get(activeAnnotation) : null;

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-white">
      {filename && (
        <div className="px-4 py-2 bg-muted/50 border-b border-border/50 text-xs text-muted-foreground font-mono">
          {filename}
        </div>
      )}
      <div className="relative">
        {html ? (
          <div className="overflow-x-auto">
            <div className="relative min-w-0">
              {/* Highlight overlay — offset by 1rem to match pre padding */}
              <div className="absolute inset-0 pt-4 pointer-events-none" aria-hidden>
                {lines.map((_, i) => {
                  const lineNum = i + 1;
                  const isHighlighted = highlightLines.includes(lineNum);
                  const hasAnnotation = annotationMap.has(lineNum);
                  return (
                    <div
                      key={i}
                      className={cn(
                        "h-[1.5rem]",
                        isHighlighted && "bg-amber-100/60",
                        hasAnnotation && activeAnnotation === lineNum && "bg-blue-100/60"
                      )}
                    />
                  );
                })}
              </div>
              {/* Annotation badges — offset by 1rem to match pre padding */}
              <div className="absolute right-2 top-4 pointer-events-auto z-10">
                {annotations.map((ann, idx) => (
                  <div
                    key={ann.line}
                    className="absolute right-0"
                    style={{ top: `${(ann.line - 1) * 1.5}rem` }}
                  >
                    <button
                      onClick={() =>
                        setActiveAnnotation(
                          activeAnnotation === ann.line ? null : ann.line
                        )
                      }
                      aria-label={`Annotation ${idx + 1}`}
                      className={cn(
                        "h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors",
                        activeAnnotation === ann.line
                          ? "bg-blue-500 text-white"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      )}
                    >
                      {idx + 1}
                    </button>
                  </div>
                ))}
              </div>
              {/* Rendered code */}
              <div
                className="text-sm [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:m-0 [&_code]:leading-[1.5rem]"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        ) : (
          <div className="p-4">
            <pre className="text-sm text-muted-foreground font-mono leading-[1.5rem]">
              {code.trim()}
            </pre>
          </div>
        )}
      </div>
      {/* Annotation detail panel */}
      {activeAnn && (
        <div className="px-4 py-3 bg-blue-50/50 border-t border-blue-100 text-sm text-foreground/80">
          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-500 text-white text-[10px] font-bold mr-2">
            {annotations.indexOf(activeAnn) + 1}
          </span>
          {activeAnn.text}
        </div>
      )}
    </div>
  );
}
