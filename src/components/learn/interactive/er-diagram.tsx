"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/learn/i18n";
import { cn } from "@/lib/utils";

interface TableDef {
  id: string;
  name: string;
  description: { en: string; zh: string };
  columns: { name: string; type: string; note?: { en: string; zh: string } }[];
  color: string;
}

interface Relation {
  from: string;
  fromField: string;
  to: string;
  toField: string;
  type: "one-to-many" | "many-to-one";
  label: { en: string; zh: string };
}

const tables: TableDef[] = [
  {
    id: "habit",
    name: "Habit",
    description: {
      en: "Stores each habit a user creates — title, icon, color, frequency settings, and tags.",
      zh: "存储用户创建的每个习惯——标题、图标、颜色、频率设置和标签。",
    },
    columns: [
      { name: "id", type: "String @id", note: { en: "Unique identifier", zh: "唯一标识符" } },
      { name: "userId", type: "String", note: { en: "Links to auth user", zh: "关联认证用户" } },
      { name: "title", type: "String" },
      { name: "frequencyType", type: "String" },
      { name: "tags", type: "String[]" },
      { name: "logs", type: "HabitLog[]", note: { en: "Related log entries", zh: "关联的日志记录" } },
    ],
    color: "border-indigo-400 bg-indigo-50",
  },
  {
    id: "habitlog",
    name: "HabitLog",
    description: {
      en: "Records each daily completion of a habit — one row per habit per day.",
      zh: "记录习惯的每日完成情况——每个习惯每天一行记录。",
    },
    columns: [
      { name: "id", type: "String @id" },
      { name: "habitId", type: "String", note: { en: "Foreign key → Habit", zh: "外键 → Habit" } },
      { name: "date", type: "String" },
      { name: "completed", type: "Boolean" },
    ],
    color: "border-violet-400 bg-violet-50",
  },
  {
    id: "objective",
    name: "Objective",
    description: {
      en: "OKR objectives — high-level goals with deadlines and status tracking.",
      zh: "OKR 目标——带截止日期和状态跟踪的高层目标。",
    },
    columns: [
      { name: "id", type: "String @id" },
      { name: "userId", type: "String" },
      { name: "title", type: "String" },
      { name: "deadline", type: "DateTime" },
      { name: "keyResults", type: "KeyResult[]" },
    ],
    color: "border-emerald-400 bg-emerald-50",
  },
  {
    id: "keyresult",
    name: "KeyResult",
    description: {
      en: "Measurable outcomes tied to objectives — track progress with current/target values.",
      zh: "与目标关联的可度量成果——用当前值/目标值跟踪进度。",
    },
    columns: [
      { name: "id", type: "String @id" },
      { name: "objectiveId", type: "String", note: { en: "Foreign key → Objective", zh: "外键 → Objective" } },
      { name: "title", type: "String" },
      { name: "currentValue", type: "Float" },
      { name: "targetValue", type: "Float" },
    ],
    color: "border-teal-400 bg-teal-50",
  },
  {
    id: "project",
    name: "Project",
    description: {
      en: "Project management — tracks status, progress, milestones, and tasks.",
      zh: "项目管理——跟踪状态、进度、里程碑和任务。",
    },
    columns: [
      { name: "id", type: "String @id" },
      { name: "userId", type: "String" },
      { name: "name", type: "String" },
      { name: "status", type: "String" },
      { name: "milestones", type: "Milestone[]" },
    ],
    color: "border-amber-400 bg-amber-50",
  },
  {
    id: "todo",
    name: "Todo",
    description: {
      en: "Simple task list with priorities, due dates, and tags.",
      zh: "带优先级、截止日期和标签的简单任务列表。",
    },
    columns: [
      { name: "id", type: "String @id" },
      { name: "userId", type: "String" },
      { name: "title", type: "String" },
      { name: "priority", type: "String" },
      { name: "dueDate", type: "DateTime?" },
    ],
    color: "border-rose-400 bg-rose-50",
  },
];

const relations: Relation[] = [
  {
    from: "habit",
    fromField: "id",
    to: "habitlog",
    toField: "habitId",
    type: "one-to-many",
    label: { en: "has many", zh: "拥有多个" },
  },
  {
    from: "objective",
    fromField: "id",
    to: "keyresult",
    toField: "objectiveId",
    type: "one-to-many",
    label: { en: "has many", zh: "拥有多个" },
  },
];

interface Props {
  locale: Locale;
}

export function ERDiagram({ locale }: Props) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const selected = tables.find((t) => t.id === selectedTable);

  return (
    <div className="space-y-3">
      {/* Table grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tables.map((table) => (
          <motion.button
            key={table.id}
            onClick={() =>
              setSelectedTable(selectedTable === table.id ? null : table.id)
            }
            aria-label={table.name}
            className={cn(
              "rounded-xl border-2 p-3 text-left transition-all hover:shadow-md",
              table.color,
              selectedTable === table.id && "ring-2 ring-blue-500 shadow-lg"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h4 className="font-mono text-sm font-bold mb-2">{table.name}</h4>
            <div className="space-y-0.5">
              {table.columns.map((col) => (
                <div key={col.name} className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-foreground">{col.name}</span>
                  <span className="text-muted-foreground">{col.type}</span>
                </div>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Relationships */}
      <div className="flex flex-wrap gap-2 justify-center">
        {relations.map((rel) => (
          <div
            key={`${rel.from}-${rel.to}`}
            className={cn(
              "flex items-center gap-1.5 text-xs rounded-full border px-3 py-1 transition-colors",
              (selectedTable === rel.from || selectedTable === rel.to)
                ? "bg-blue-100 border-blue-300 text-blue-800"
                : "bg-muted/50 border-border/50 text-muted-foreground"
            )}
          >
            <span className="font-mono font-semibold">{rel.from}</span>
            <span>→</span>
            <span className="font-mono font-semibold">{rel.to}</span>
            <span className="text-muted-foreground">({rel.label[locale]})</span>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            aria-live="polite"
            className={cn("rounded-xl border-2 p-4", selected.color)}
          >
            <h4 className="font-mono font-bold text-sm mb-1">{selected.name}</h4>
            <p className="text-xs text-muted-foreground mb-3">
              {selected.description[locale]}
            </p>
            <div className="space-y-1">
              {selected.columns.map((col) => (
                <div key={col.name} className="flex items-start gap-2 text-xs">
                  <span className="font-mono font-semibold shrink-0">{col.name}</span>
                  <span className="text-muted-foreground">{col.type}</span>
                  {col.note && (
                    <span className="text-blue-600 ml-auto">— {col.note[locale]}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground text-center">
        {locale === "zh"
          ? "点击表格查看详细信息。StudyTracker 共有 13 个数据表。"
          : "Click a table to see details. StudyTracker has 13 database tables in total."}
      </p>
    </div>
  );
}
