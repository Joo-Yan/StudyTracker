"use client";
import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { createMockData, createMockStats, type DemoStore } from "@/lib/mock-data";
import { isHabitScheduledToday } from "@/lib/habit-schedule";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface DemoContextValue {
  isDemo: boolean;
  enterDemo: () => void;
  exitDemo: () => void;
}

const DemoContext = createContext<DemoContextValue>({
  isDemo: false,
  enterDemo: () => {},
  exitDemo: () => {},
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function uuid(): string {
  return `demo-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseApiUrl(url: string): {
  path: string;
  segments: string[];
  params: URLSearchParams;
} {
  const u = new URL(url, "http://localhost");
  const path = u.pathname;
  const segments = path
    .replace(/^\/api\//, "")
    .split("/")
    .filter(Boolean);
  return { path, segments, params: u.searchParams };
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function normaliseDueDate(raw: unknown): string | null {
  if (raw === "" || raw === null || raw === undefined) return null;
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw + "T00:00:00.000Z";
  }
  return raw as string;
}

// ---------------------------------------------------------------------------
// Route dispatcher
// ---------------------------------------------------------------------------

async function handleApiRequest(
  store: DemoStore,
  url: string,
  init: RequestInit | undefined
): Promise<Response> {
  const { segments, params } = parseApiUrl(url);
  const method = (init?.method ?? "GET").toUpperCase();
  const body = init?.body ? JSON.parse(init.body as string) : {};

  const [entity, id, subEntity, subId] = segments;

  // ── /api/habits ────────────────────────────────────────────────────────────
  if (entity === "habits") {
    // POST /api/habits/[id]/log
    if (id && subEntity === "log" && method === "POST") {
      const date = body.date ?? todayStr();
      const habit = store.habits.find((h) => h.id === id);
      if (!habit) return jsonResponse({ error: "Not found" }, 404);
      const existing = habit.logs.find((l: any) => l.date === date);
      if (existing) {
        Object.assign(existing, { completed: body.completed ?? existing.completed });
        return jsonResponse(existing);
      }
      const log = {
        id: uuid(),
        habitId: id,
        userId: "demo",
        date,
        completed: body.completed ?? true,
        note: body.note ?? null,
        createdAt: new Date().toISOString(),
      };
      habit.logs.push(log);
      return jsonResponse(log);
    }

    // GET /api/habits/[id]/logs
    if (id && subEntity === "logs" && method === "GET") {
      const habit = store.habits.find((h) => h.id === id);
      if (!habit) return jsonResponse({ error: "Not found" }, 404);
      const logs = habit.logs
        .filter((l: any) => l.completed === true)
        .sort((a: any, b: any) => b.date.localeCompare(a.date))
        .slice(0, 365);
      return jsonResponse(logs);
    }

    // POST /api/habits
    if (!id && method === "POST") {
      const habit = {
        id: uuid(),
        icon: "✓",
        color: "#6366f1",
        frequencyType: "daily",
        tags: [],
        logs: [],
        ...body,
        userId: "demo",
        createdAt: new Date().toISOString(),
      };
      store.habits.push(habit);
      return jsonResponse(habit, 201);
    }

    // GET /api/habits
    if (!id && method === "GET") {
      const todayParam = params.get("today") === "true";
      const tagParam = params.get("tag");
      const todayDate = todayStr();
      const todayDow = new Date().getDay();

      let result = store.habits;

      if (todayParam) {
        result = result.filter((h) => isHabitScheduledToday(h, todayDow));
      }

      if (tagParam) {
        result = result.filter((h) => Array.isArray(h.tags) && h.tags.includes(tagParam));
      }

      const filterDate = params.get("date") ?? todayDate;
      result = result.map((h) => ({
        ...h,
        logs: h.logs.filter((l: any) => l.date === filterDate),
      }));

      return jsonResponse(result);
    }
  }

  // ── /api/todos ─────────────────────────────────────────────────────────────
  if (entity === "todos") {
    // PATCH /api/todos/[id]
    if (id && method === "PATCH") {
      const todo = store.todos.find((t) => t.id === id);
      if (!todo) return jsonResponse({ error: "Not found" }, 404);
      const prevCompleted = todo.completed;
      Object.assign(todo, body);
      if (body.completed === true && !prevCompleted) {
        todo.completedAt = new Date().toISOString();
      } else if (body.completed === false) {
        todo.completedAt = null;
      }
      if ("dueDate" in body) {
        todo.dueDate = normaliseDueDate(body.dueDate);
      }
      return jsonResponse(todo);
    }

    // DELETE /api/todos/[id]
    if (id && method === "DELETE") {
      const idx = store.todos.findIndex((t) => t.id === id);
      if (idx !== -1) store.todos.splice(idx, 1);
      return jsonResponse({ success: true });
    }

    // POST /api/todos
    if (!id && method === "POST") {
      const todo = {
        priority: 2,
        tags: [],
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
        ...body,
        id: uuid(),
        userId: "demo",
      };
      if (todo.dueDate) {
        todo.dueDate = normaliseDueDate(todo.dueDate);
      }
      store.todos.push(todo);
      return jsonResponse(todo, 201);
    }

    // GET /api/todos
    if (!id && method === "GET") {
      const tagParam = params.get("tag");
      const dueParam = params.get("due");
      const dateParam = params.get("date");

      let result = store.todos;

      if (tagParam) {
        result = result.filter((t) => Array.isArray(t.tags) && t.tags.includes(tagParam));
      }

      if (dueParam === "today" && dateParam) {
        result = result.filter(
          (t) => !t.completed && t.dueDate && t.dueDate.startsWith(dateParam)
        );
      }

      if (dueParam === "upcoming" && dateParam) {
        const daysParam = parseInt(params.get("days") ?? "7", 10);
        // Parse as local date to avoid UTC midnight shift in UTC-behind timezones
        const [y, m, d] = dateParam.split("-").map(Number);
        const start = new Date(y, m - 1, d + 1); // tomorrow, local midnight
        const end = new Date(y, m - 1, d + daysParam); // today+N, local midnight
        result = result.filter((t) => {
          if (t.completed || !t.dueDate) return false;
          const dueStr = t.dueDate.slice(0, 10);
          const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
          const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
          return dueStr >= startStr && dueStr <= endStr;
        });
      }

      result = [...result].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const da = a.dueDate ?? null;
        const db = b.dueDate ?? null;
        if (da === null && db === null) return 0;
        if (da === null) return 1;
        if (db === null) return -1;
        const cmp = da.localeCompare(db);
        if (cmp !== 0) return cmp;
        return (a.priority ?? 2) - (b.priority ?? 2);
      });

      return jsonResponse(result);
    }
  }

  // ── /api/okr ───────────────────────────────────────────────────────────────
  if (entity === "okr") {
    // POST /api/okr/[id]/checkin  — [id] is keyResult id
    if (id && subEntity === "checkin" && method === "POST") {
      let foundKr: any = null;
      for (const obj of store.objectives) {
        if (Array.isArray(obj.keyResults)) {
          foundKr = obj.keyResults.find((kr: any) => kr.id === id);
          if (foundKr) break;
        }
      }
      if (!foundKr) return jsonResponse({ error: "Not found" }, 404);

      const checkIn = {
        id: uuid(),
        keyResultId: id,
        value: body.value,
        note: body.note ?? null,
        createdAt: new Date().toISOString(),
      };
      if (!Array.isArray(foundKr.checkIns)) foundKr.checkIns = [];
      foundKr.checkIns.push(checkIn);
      foundKr.currentValue = body.value;
      if (body.value >= foundKr.targetValue) {
        foundKr.status = "completed";
      } else if (body.value > 0) {
        foundKr.status = "in_progress";
      } else {
        foundKr.status = "not_started";
      }
      return jsonResponse(checkIn, 201);
    }

    // POST /api/okr
    if (!id && method === "POST") {
      const obj = {
        id: uuid(),
        userId: "demo",
        tags: [],
        keyResults: [],
        createdAt: new Date().toISOString(),
        ...body,
      };
      store.objectives.push(obj);
      return jsonResponse(obj, 201);
    }

    // GET /api/okr
    if (!id && method === "GET") {
      const tagParam = params.get("tag");
      let result = store.objectives;
      if (tagParam) {
        result = result.filter(
          (o) => Array.isArray(o.tags) && o.tags.includes(tagParam)
        );
      }
      result = [...result].sort((a, b) => {
        const da = a.deadline ?? "";
        const db = b.deadline ?? "";
        return da.localeCompare(db);
      });
      result = result.map((o) => ({
        ...o,
        tasks: (o.tasks ?? []),
        keyResults: (o.keyResults ?? []).map((kr: any) => ({
          ...kr,
          checkIns: (kr.checkIns ?? []).slice(-5),
        })),
      }));
      return jsonResponse(result);
    }

    // POST /api/okr/[id]/tasks
    if (id && subEntity === "tasks" && !subId && method === "POST") {
      const objective = store.objectives.find((o) => o.id === id);
      if (!objective) return jsonResponse({ error: "Not found" }, 404);
      const task = {
        id: uuid(),
        userId: "demo",
        objectiveId: id,
        title: body.title,
        status: "todo",
        dueDate: body.dueDate ?? null,
        completedAt: null,
        createdAt: new Date().toISOString(),
      };
      if (!Array.isArray(objective.tasks)) objective.tasks = [];
      objective.tasks.push(task);
      return jsonResponse(task, 201);
    }

    // PATCH /api/okr/[id]/tasks/[taskId]
    if (id && subEntity === "tasks" && subId && method === "PATCH") {
      const objective = store.objectives.find((o) => o.id === id);
      if (!objective) return jsonResponse({ error: "Not found" }, 404);
      const task = (objective.tasks ?? []).find((t: any) => t.id === subId);
      if (!task) return jsonResponse({ error: "Not found" }, 404);
      Object.assign(task, body);
      if (body.status === "done" && !task.completedAt) {
        task.completedAt = new Date().toISOString();
      } else if (body.status === "todo") {
        task.completedAt = null;
      }
      return jsonResponse(task);
    }

    // DELETE /api/okr/[id]/tasks/[taskId]
    if (id && subEntity === "tasks" && subId && method === "DELETE") {
      const objective = store.objectives.find((o) => o.id === id);
      if (!objective) return jsonResponse({ error: "Not found" }, 404);
      const idx = (objective.tasks ?? []).findIndex((t: any) => t.id === subId);
      if (idx !== -1) objective.tasks.splice(idx, 1);
      return jsonResponse({ success: true });
    }
  }

  // ── /api/projects ──────────────────────────────────────────────────────────
  if (entity === "projects") {
    // PATCH /api/projects/[id]/tasks/[taskId]
    if (id && subEntity === "tasks" && subId && method === "PATCH") {
      const project = store.projects.find((p) => p.id === id);
      if (!project) return jsonResponse({ error: "Not found" }, 404);
      let foundTask: any = null;
      for (const ms of project.milestones ?? []) {
        foundTask = (ms.tasks ?? []).find((t: any) => t.id === subId);
        if (foundTask) break;
      }
      if (!foundTask) return jsonResponse({ error: "Not found" }, 404);
      Object.assign(foundTask, body);
      if (body.status === "done" && !foundTask.completedAt) {
        foundTask.completedAt = new Date().toISOString();
      }
      return jsonResponse(foundTask);
    }

    // POST /api/projects/[id]/tasks
    if (id && subEntity === "tasks" && !subId && method === "POST") {
      const project = store.projects.find((p) => p.id === id);
      if (!project) return jsonResponse({ error: "Not found" }, 404);
      const milestone = (project.milestones ?? []).find(
        (m: any) => m.id === body.milestoneId
      );
      if (!milestone) return jsonResponse({ error: "Milestone not found" }, 404);
      const task = {
        id: uuid(),
        status: "todo",
        completedAt: null,
        createdAt: new Date().toISOString(),
        ...body,
      };
      if (!Array.isArray(milestone.tasks)) milestone.tasks = [];
      milestone.tasks.push(task);
      return jsonResponse(task, 201);
    }

    // POST /api/projects/[id]/milestones
    if (id && subEntity === "milestones" && !subId && method === "POST") {
      const project = store.projects.find((p) => p.id === id);
      if (!project) return jsonResponse({ error: "Not found" }, 404);
      const milestone = {
        id: uuid(),
        tasks: [],
        createdAt: new Date().toISOString(),
        ...body,
      };
      if (!Array.isArray(project.milestones)) project.milestones = [];
      project.milestones.push(milestone);
      return jsonResponse(milestone, 201);
    }

    // POST /api/projects/[id]/logs
    if (id && subEntity === "logs" && !subId && method === "POST") {
      const project = store.projects.find((p) => p.id === id);
      if (!project) return jsonResponse({ error: "Not found" }, 404);
      const log = {
        id: uuid(),
        projectId: id,
        createdAt: new Date().toISOString(),
        ...body,
      };
      if (!Array.isArray(project.logs)) project.logs = [];
      project.logs.push(log);
      return jsonResponse(log, 201);
    }

    // GET /api/projects/[id]
    if (id && !subEntity && method === "GET") {
      const project = store.projects.find((p) => p.id === id);
      if (!project) return jsonResponse({ error: "Not found" }, 404);
      return jsonResponse(project);
    }

    // PATCH /api/projects/[id]
    if (id && !subEntity && method === "PATCH") {
      const project = store.projects.find((p) => p.id === id);
      if (!project) return jsonResponse({ error: "Not found" }, 404);
      if (body.notes !== undefined) project.notes = body.notes;
      return jsonResponse(project);
    }

    // POST /api/projects
    if (!id && method === "POST") {
      const project = {
        id: uuid(),
        userId: "demo",
        tags: [],
        milestones: [],
        logs: [],
        createdAt: new Date().toISOString(),
        ...body,
      };
      store.projects.push(project);
      return jsonResponse(project, 201);
    }

    // GET /api/projects
    if (!id && method === "GET") {
      const tagParam = params.get("tag");
      let result = store.projects;
      if (tagParam) {
        result = result.filter(
          (p) => Array.isArray(p.tags) && p.tags.includes(tagParam)
        );
      }
      result = [...result]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((p) => ({
          ...p,
          logs: (p.logs ?? []).slice(-3),
        }));
      return jsonResponse(result);
    }
  }

  // ── /api/content ───────────────────────────────────────────────────────────
  if (entity === "content") {
    // PATCH /api/content/[id]
    if (id && method === "PATCH") {
      const item = store.content.find((c) => c.id === id);
      if (!item) return jsonResponse({ error: "Not found" }, 404);
      Object.assign(item, body);
      if (body.status === "learning" && !item.startedAt) {
        item.startedAt = new Date().toISOString();
      }
      if (body.status === "completed" && !item.completedAt) {
        item.completedAt = new Date().toISOString();
      }
      return jsonResponse(item);
    }

    // DELETE /api/content/[id]
    if (id && method === "DELETE") {
      const idx = store.content.findIndex((c) => c.id === id);
      if (idx !== -1) store.content.splice(idx, 1);
      return jsonResponse({ ok: true });
    }

    // POST /api/content
    if (!id && method === "POST") {
      const item = {
        type: "article",
        status: "want_to_learn",
        priority: 2,
        tags: [],
        startedAt: null,
        completedAt: null,
        createdAt: new Date().toISOString(),
        ...body,
        id: uuid(),
        userId: "demo",
      };
      store.content.push(item);
      return jsonResponse(item, 201);
    }

    // GET /api/content
    if (!id && method === "GET") {
      const tagParam = params.get("tag");
      let result = store.content;
      if (tagParam) {
        result = result.filter(
          (c) => Array.isArray(c.tags) && c.tags.includes(tagParam)
        );
      }
      result = [...result].sort((a, b) => {
        const sc = a.status.localeCompare(b.status);
        if (sc !== 0) return sc;
        return b.createdAt.localeCompare(a.createdAt);
      });
      return jsonResponse(result);
    }
  }

  // ── /api/ideas ─────────────────────────────────────────────────────────────
  if (entity === "ideas") {
    // PATCH /api/ideas/[id]
    if (id && method === "PATCH") {
      const item = store.ideas.find((i) => i.id === id);
      if (!item) return jsonResponse({ error: "Not found" }, 404);
      Object.assign(item, body);
      return jsonResponse(item);
    }

    // DELETE /api/ideas/[id]
    if (id && method === "DELETE") {
      const idx = store.ideas.findIndex((i) => i.id === id);
      if (idx !== -1) store.ideas.splice(idx, 1);
      return jsonResponse({ ok: true });
    }

    // POST /api/ideas
    if (!id && method === "POST") {
      const item = {
        id: uuid(),
        userId: "demo",
        tags: [],
        createdAt: new Date().toISOString(),
        ...body,
      };
      store.ideas.push(item);
      return jsonResponse(item, 201);
    }

    // GET /api/ideas
    if (!id && method === "GET") {
      const tagParam = params.get("tag");
      let result = store.ideas;
      if (tagParam) {
        result = result.filter(
          (i) => Array.isArray(i.tags) && i.tags.includes(tagParam)
        );
      }
      result = [...result].sort((a, b) => {
        const pc = (a.priority ?? 2) - (b.priority ?? 2);
        if (pc !== 0) return pc;
        return b.createdAt.localeCompare(a.createdAt);
      });
      return jsonResponse(result);
    }
  }

  // ── /api/compass ───────────────────────────────────────────────────────────
  if (entity === "compass") {
    if (method === "PUT") {
      store.compass = body.content ?? store.compass;
      return jsonResponse({ content: store.compass });
    }
    if (method === "GET") {
      return jsonResponse({ content: store.compass });
    }
  }

  // ── /api/stats ─────────────────────────────────────────────────────────────
  if (entity === "stats" && method === "GET") {
    const rawDays = parseInt(params.get("days") ?? "30", 10);
    const days = Math.min(90, Math.max(7, isNaN(rawDays) ? 30 : rawDays));
    return jsonResponse(createMockStats(days));
  }

  // ── /api/tags ──────────────────────────────────────────────────────────────
  if (entity === "tags" && method === "GET") {
    const entityParam = params.get("entity");
    const keyMap: Record<string, keyof DemoStore> = {
      habits: "habits",
      okr: "objectives",
      todos: "todos",
      projects: "projects",
      content: "content",
      ideas: "ideas",
    };
    const storeKey = entityParam ? keyMap[entityParam] : undefined;
    if (!storeKey) return jsonResponse([], 200);
    const items = store[storeKey];
    if (!Array.isArray(items)) return jsonResponse([], 200);
    const tagSet = new Set<string>();
    for (const item of items) {
      if (Array.isArray(item.tags)) {
        for (const t of item.tags) tagSet.add(t);
      }
    }
    return jsonResponse([...tagSet].sort());
  }

  // Unmatched route
  return jsonResponse({ error: "Not found" }, 404);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);
  const storeRef = useRef<DemoStore | null>(null);
  const originalFetchRef = useRef<typeof window.fetch | null>(null);

  const installInterceptor = useCallback(() => {
    if (typeof window === "undefined") return;
    if (originalFetchRef.current) return; // already installed

    originalFetchRef.current = window.fetch;

    window.fetch = async function interceptedFetch(
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.toString()
          : (input as Request).url;

      const method =
        init?.method ??
        (typeof input !== "string" && !(input instanceof URL)
          ? (input as Request).method
          : "GET");

      const resolvedInit: RequestInit = {
        ...init,
        method,
      };

      if (!url.includes("/api/")) {
        return originalFetchRef.current!(input, init);
      }

      const store = storeRef.current;
      if (!store) {
        return originalFetchRef.current!(input, init);
      }

      return handleApiRequest(store, url, resolvedInit);
    };
  }, []);

  const restoreOriginalFetch = useCallback(() => {
    if (typeof window === "undefined") return;
    if (originalFetchRef.current) {
      window.fetch = originalFetchRef.current;
      originalFetchRef.current = null;
    }
  }, []);

  const enterDemo = useCallback(() => {
    storeRef.current = createMockData();
    setIsDemo(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("studytracker-demo", "true");
    }
    installInterceptor();
  }, [installInterceptor]);

  const exitDemo = useCallback(() => {
    storeRef.current = null;
    setIsDemo(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("studytracker-demo");
    }
    restoreOriginalFetch();
  }, [restoreOriginalFetch]);

  // Auto-enter demo mode if flag was set in a previous session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const flag = localStorage.getItem("studytracker-demo");
      if (flag === "true") {
        enterDemo();
      }
    }
    // Cleanup on unmount
    return () => {
      restoreOriginalFetch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DemoContext.Provider value={{ isDemo, enterDemo, exitDemo }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo(): DemoContextValue {
  return useContext(DemoContext);
}
