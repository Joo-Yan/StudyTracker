"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateTodoDialog } from "@/components/todos/create-todo-dialog";
import { TagFilter } from "@/components/shared/tag-filter";
import { cn, formatDate } from "@/lib/utils";
import { isDateOverdue } from "@/lib/todo-utils";

interface Todo {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: number;
  completed: boolean;
  completedAt: string | null;
  tags: string[];
  createdAt: string;
}

const PRIORITY_LABEL: Record<number, string> = { 1: "High", 2: "Medium", 3: "Low" };
const PRIORITY_COLOR: Record<number, string> = {
  1: "bg-red-100 text-red-700",
  2: "bg-yellow-100 text-yellow-700",
  3: "bg-green-100 text-green-700",
};

function isOverdue(todo: Todo): boolean {
  if (!todo.dueDate || todo.completed) return false;
  return isDateOverdue(todo.dueDate);
}

interface TodoRowProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

function TodoRow({ todo, onToggle, onDelete }: TodoRowProps) {
  const overdue = isOverdue(todo);
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border transition-colors",
        todo.completed ? "opacity-50 bg-muted/30" : "bg-background hover:bg-muted/20",
        overdue && !todo.completed && "border-red-200 bg-red-50/50"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo)}
        className="mt-0.5 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", todo.completed && "line-through text-muted-foreground")}>
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{todo.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {todo.dueDate && (
            <span className={cn("flex items-center gap-1 text-xs", overdue ? "text-red-600 font-medium" : "text-muted-foreground")}>
              <Calendar className="h-3 w-3" />
              {overdue ? "Overdue · " : ""}{formatDate(new Date(todo.dueDate))}
            </span>
          )}
          <Badge variant="secondary" className={cn("text-xs px-1.5 py-0", PRIORITY_COLOR[todo.priority])}>
            {PRIORITY_LABEL[todo.priority]}
          </Badge>
          {todo.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">{tag}</Badge>
          ))}
        </div>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1"
        aria-label="Delete todo"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagKey, setTagKey] = useState(0);

  const fetchTodos = useCallback(async () => {
    const url = selectedTag ? `/api/todos?tag=${encodeURIComponent(selectedTag)}` : "/api/todos";
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setTodos(data);
    }
    setLoading(false);
  }, [selectedTag]);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  async function toggleComplete(todo: Todo) {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    }
  }

  async function deleteTodo(id: string) {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }

  const withDue = todos.filter((t) => t.dueDate !== null);
  const withoutDue = todos.filter((t) => t.dueDate === null);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Todos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {todos.filter((t) => !t.completed).length} remaining
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> New todo
        </Button>
      </div>

      <TagFilter entity="todos" selected={selectedTag} onSelect={setSelectedTag} refreshKey={tagKey} />

      {/* With deadline */}
      {withDue.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            With deadline
          </h2>
          <div className="space-y-2">
            {withDue.map((todo) => <TodoRow key={todo.id} todo={todo} onToggle={toggleComplete} onDelete={deleteTodo} />)}
          </div>
        </section>
      )}

      {/* Without deadline */}
      {withoutDue.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            No deadline
          </h2>
          <div className="space-y-2">
            {withoutDue.map((todo) => <TodoRow key={todo.id} todo={todo} onToggle={toggleComplete} onDelete={deleteTodo} />)}
          </div>
        </section>
      )}

      {todos.length === 0 && (
        <div className="border-2 border-dashed rounded-xl p-10 text-center">
          <p className="text-muted-foreground text-sm">No todos yet</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add your first todo
          </Button>
        </div>
      )}

      <CreateTodoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={() => { fetchTodos(); setTagKey((k) => k + 1); }}
      />
    </div>
  );
}
