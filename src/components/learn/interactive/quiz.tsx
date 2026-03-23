"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/learn/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

export interface QuizQuestion {
  question: { en: string; zh: string };
  options: { en: string; zh: string }[];
  correctIndex: number;
  explanation: { en: string; zh: string };
}

interface QuizProps {
  questions: QuizQuestion[];
  locale: Locale;
}

export function Quiz({ questions, locale }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelectedIdx(idx);
  };

  const handleCheck = () => {
    if (selectedIdx === null) return;
    setRevealed(true);
    if (selectedIdx === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedIdx(null);
      setRevealed(false);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 text-center"
      >
        <span className="text-3xl block mb-2">
          {percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "📚"}
        </span>
        <p className="font-bold text-lg mb-1">
          {score} / {questions.length}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {percentage >= 80
            ? locale === "zh" ? "太棒了！你已经掌握了这章的内容！" : "Great job! You've mastered this chapter!"
            : percentage >= 50
              ? locale === "zh" ? "不错！再复习一下可以做得更好。" : "Not bad! A quick review could help."
              : locale === "zh" ? "继续加油！回顾一下这章的内容吧。" : "Keep going! Review this chapter and try again."}
        </p>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          {locale === "zh" ? "重新测试" : "Try Again"}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-white p-5 space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {locale === "zh"
            ? `第 ${currentIdx + 1} 题，共 ${questions.length} 题`
            : `Question ${currentIdx + 1} of ${questions.length}`}
        </span>
        <span>
          {locale === "zh" ? `得分：${score}` : `Score: ${score}`}
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
        >
          <p className="font-semibold text-sm mb-3">{question.question[locale]}</p>

          <div className="space-y-2">
            {question.options.map((option, i) => {
              const isSelected = selectedIdx === i;
              const isCorrect = i === question.correctIndex;

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={revealed}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors",
                    !revealed && isSelected && "border-primary bg-primary/5",
                    !revealed && !isSelected && "border-border/50 hover:bg-muted/30",
                    revealed && isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-800",
                    revealed && isSelected && !isCorrect && "border-rose-400 bg-rose-50 text-rose-800",
                    revealed && !isSelected && !isCorrect && "border-border/30 opacity-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {revealed && isCorrect && <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />}
                    {revealed && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-rose-500 shrink-0" />}
                    <span>{option[locale]}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground"
            >
              {question.explanation[locale]}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {!revealed ? (
          <Button size="sm" onClick={handleCheck} disabled={selectedIdx === null}>
            {locale === "zh" ? "检查答案" : "Check Answer"}
          </Button>
        ) : (
          <Button size="sm" onClick={handleNext}>
            {currentIdx < questions.length - 1
              ? locale === "zh" ? "下一题" : "Next"
              : locale === "zh" ? "查看结果" : "See Results"}
          </Button>
        )}
      </div>
    </div>
  );
}
