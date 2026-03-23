// ---------------------------------------------------------------------------
// mock-data.ts – rich, realistic demo data for StudyTracker
// All dates are computed relative to "today" so the demo stays fresh.
// Zero imports – plain functions only.
// ---------------------------------------------------------------------------

// ── Helpers ─────────────────────────────────────────────────────────────────

function today(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

let _seq = 0;
function uuid(): string {
  _seq += 1;
  return `demo-${Math.random().toString(36).slice(2, 8)}-${_seq}`;
}

function isoToday(): string {
  return new Date().toISOString();
}

function isoAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// Seeded pseudo-random (not crypto) so re-renders are deterministic per day.
let _seed = 42;
function rand(): number {
  _seed = (_seed * 1664525 + 1013904223) >>> 0;
  return _seed / 0xffffffff;
}
function seedReset() {
  _seed = 42;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface DemoStore {
  habits: any[];
  todos: any[];
  objectives: any[];
  projects: any[];
  content: any[];
  ideas: any[];
  compass: string;
}

// ── 1. Habits ────────────────────────────────────────────────────────────────

function buildHabitLogs(
  habitId: string,
  completedToday: boolean,
  freqType: "daily" | "weekly",
  freqDays?: number[]
): any[] {
  const logs: any[] = [];

  for (let i = 60; i >= 1; i--) {
    const date = daysAgo(i);
    const dayOfWeek = new Date(date).getDay();

    // For weekly habits, only log on specified days
    if (freqType === "weekly" && freqDays && !freqDays.includes(dayOfWeek)) {
      continue;
    }

    // ~70% completion rate
    if (rand() < 0.7) {
      logs.push({
        id: uuid(),
        habitId,
        userId: "demo",
        date,
        completed: true,
        note: null,
        createdAt: `${date}T08:00:00.000Z`,
      });
    }
  }

  if (completedToday) {
    logs.push({
      id: uuid(),
      habitId,
      userId: "demo",
      date: today(),
      completed: true,
      note: null,
      createdAt: isoToday(),
    });
  }

  return logs;
}

function buildHabits(): any[] {
  seedReset();

  const specs = [
    {
      title: "Morning Meditation",
      description: "10 minutes of mindfulness to start the day centered.",
      icon: "🧘",
      color: "#8b5cf6",
      frequencyType: "daily" as const,
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      tags: ["health", "mindfulness"],
      completedToday: true,
    },
    {
      title: "Read 30 mins",
      description: "Read non-fiction or technical books for at least 30 minutes.",
      icon: "📚",
      color: "#3b82f6",
      frequencyType: "daily" as const,
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      tags: ["learning", "reading"],
      completedToday: true,
    },
    {
      title: "Exercise",
      description: "Any physical activity – gym, run, or home workout.",
      icon: "💪",
      color: "#ef4444",
      frequencyType: "daily" as const,
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      tags: ["health", "fitness"],
      completedToday: true,
    },
    {
      title: "Review Goals",
      description: "Weekly review of OKRs and adjust priorities.",
      icon: "🎯",
      color: "#f59e0b",
      frequencyType: "weekly" as const,
      frequencyDays: [1, 5],
      tags: ["productivity"],
      completedToday: false,
    },
    {
      title: "Journal",
      description: "Reflect on the day – wins, lessons, and tomorrow's focus.",
      icon: "✍️",
      color: "#10b981",
      frequencyType: "daily" as const,
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      tags: ["mindfulness", "writing"],
      completedToday: true,
    },
    {
      title: "Learn Japanese",
      description: "Anki flashcards + 1 grammar point + 1 sentence writing.",
      icon: "🇯🇵",
      color: "#ec4899",
      frequencyType: "daily" as const,
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      tags: ["learning", "language"],
      completedToday: false,
    },
  ];

  return specs.map((s) => {
    const id = uuid();
    return {
      id,
      userId: "demo",
      title: s.title,
      description: s.description,
      icon: s.icon,
      color: s.color,
      isActive: true,
      frequencyType: s.frequencyType,
      frequencyDays: s.frequencyDays,
      tags: s.tags,
      createdAt: isoAgo(90),
      logs: buildHabitLogs(id, s.completedToday, s.frequencyType, s.frequencyDays),
    };
  });
}

// ── 2. Todos ─────────────────────────────────────────────────────────────────

function buildTodos(): any[] {
  const t = today();
  const todayIso = new Date().toISOString();

  return [
    // 2 completed
    {
      id: uuid(),
      userId: "demo",
      title: "Finish React hooks deep-dive chapter",
      description: "Complete the advanced patterns section and take notes.",
      dueDate: isoAgo(3),
      priority: 2,
      completed: true,
      completedAt: isoAgo(2),
      tags: ["study", "frontend"],
      createdAt: isoAgo(10),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Set up CI/CD pipeline for StudyTracker",
      description: "GitHub Actions workflow for lint, test, and deploy.",
      dueDate: isoAgo(5),
      priority: 2,
      completed: true,
      completedAt: isoAgo(4),
      tags: ["project", "devops"],
      createdAt: isoAgo(14),
    },

    // 1 overdue
    {
      id: uuid(),
      userId: "demo",
      title: "Submit assignment 3 – data structures",
      description: "Binary trees and graph traversal problems.",
      dueDate: isoAgo(2),
      priority: 1,
      completed: false,
      completedAt: null,
      tags: ["study", "urgent"],
      createdAt: isoAgo(12),
    },

    // 3 due today
    {
      id: uuid(),
      userId: "demo",
      title: "Review pull request from teammate",
      description: "Auth refactor PR – check for security issues.",
      dueDate: todayIso,
      priority: 2,
      completed: false,
      completedAt: null,
      tags: ["project", "coding"],
      createdAt: isoAgo(2),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Anki deck – Japanese vocab N3 set 12",
      description: "Complete today's new cards and all due reviews.",
      dueDate: todayIso,
      priority: 3,
      completed: false,
      completedAt: null,
      tags: ["study", "language"],
      createdAt: isoAgo(1),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Write blog post outline: TypeScript generics",
      description: "Structure intro, core concepts, and 3 practical examples.",
      dueDate: todayIso,
      priority: 2,
      completed: false,
      completedAt: null,
      tags: ["project", "writing"],
      createdAt: isoAgo(3),
    },

    // 2 future
    {
      id: uuid(),
      userId: "demo",
      title: "Prepare for mock technical interview",
      description: "LeetCode medium problems: arrays, trees, and DP.",
      dueDate: daysFromNow(5),
      priority: 1,
      completed: false,
      completedAt: null,
      tags: ["study", "career"],
      createdAt: isoAgo(1),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Deploy beta version of blog platform",
      description: "Vercel deploy + configure custom domain + smoke test.",
      dueDate: daysFromNow(14),
      priority: 2,
      completed: false,
      completedAt: null,
      tags: ["project", "coding"],
      createdAt: isoAgo(7),
    },

    // 2 no deadline
    {
      id: uuid(),
      userId: "demo",
      title: "Explore Bun runtime for side projects",
      description: "Try replacing Node.js with Bun – measure cold start times.",
      dueDate: null,
      priority: 3,
      completed: false,
      completedAt: null,
      tags: ["personal", "coding"],
      createdAt: isoAgo(5),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Create study flashcards for system design",
      description: "CAP theorem, consistent hashing, load balancing patterns.",
      dueDate: null,
      priority: 3,
      completed: false,
      completedAt: null,
      tags: ["study", "personal"],
      createdAt: isoAgo(8),
    },
  ];
}

// ── 3. Objectives / OKRs ─────────────────────────────────────────────────────

function buildCheckIns(
  keyResultId: string,
  values: { value: number; note: string; daysBack: number }[]
): any[] {
  return values.map(({ value, note, daysBack }) => ({
    id: uuid(),
    keyResultId,
    value,
    note,
    date: isoAgo(daysBack),
    createdAt: isoAgo(daysBack),
  }));
}

function buildObjectives(): any[] {
  // Objective 1
  const obj1Id = uuid();
  const kr1a = uuid();
  const kr1b = uuid();

  // Objective 2
  const obj2Id = uuid();
  const kr2a = uuid();
  const kr2b = uuid();

  // Objective 3
  const obj3Id = uuid();
  const kr3a = uuid();
  const kr3b = uuid();

  return [
    {
      id: obj1Id,
      userId: "demo",
      title: "Master React & Next.js",
      description:
        "Build production-quality frontend apps with the modern React ecosystem including hooks, RSC, and App Router.",
      deadline: daysFromNow(60),
      status: "active",
      tags: ["learning", "frontend"],
      keyResults: [
        {
          id: kr1a,
          objectiveId: obj1Id,
          title: "Complete 3 portfolio projects",
          type: "percentage",
          targetValue: 3,
          currentValue: 2,
          unit: "projects",
          weight: 3,
          status: "active",
          checkIns: buildCheckIns(kr1a, [
            { value: 0, note: "Starting from scratch", daysBack: 45 },
            { value: 1, note: "Finished StudyTracker MVP", daysBack: 25 },
            { value: 2, note: "Shipped blog platform v0.1", daysBack: 7 },
          ]),
        },
        {
          id: kr1b,
          objectiveId: obj1Id,
          title: "Pass Meta React certification exam",
          type: "percentage",
          targetValue: 100,
          currentValue: 65,
          unit: "%",
          weight: 2,
          status: "active",
          checkIns: buildCheckIns(kr1b, [
            { value: 20, note: "Completed practice test 1", daysBack: 30 },
            { value: 45, note: "Finished official course modules", daysBack: 14 },
            { value: 65, note: "Mock exam score: 68% – nearly there", daysBack: 3 },
          ]),
        },
      ],
    },
    {
      id: obj2Id,
      userId: "demo",
      title: "Improve Physical Health",
      description:
        "Build sustainable fitness habits, reach target weight, and improve energy levels through consistent exercise and nutrition.",
      deadline: daysFromNow(90),
      status: "active",
      tags: ["health"],
      keyResults: [
        {
          id: kr2a,
          objectiveId: obj2Id,
          title: "Exercise 5x/week consistently",
          type: "percentage",
          targetValue: 100,
          currentValue: 40,
          unit: "%",
          weight: 3,
          status: "active",
          checkIns: buildCheckIns(kr2a, [
            { value: 10, note: "First week – managed 2 sessions", daysBack: 28 },
            { value: 25, note: "Getting into a rhythm", daysBack: 14 },
            { value: 40, note: "Hit 4/5 days this week", daysBack: 2 },
          ]),
        },
        {
          id: kr2b,
          objectiveId: obj2Id,
          title: "Reach target weight",
          type: "percentage",
          targetValue: 70,
          currentValue: 74,
          unit: "kg",
          weight: 2,
          status: "active",
          checkIns: buildCheckIns(kr2b, [
            { value: 78, note: "Starting weight recorded", daysBack: 30 },
            { value: 76, note: "Down 2 kg – cutting working", daysBack: 15 },
            { value: 74, note: "Plateau – adjusting calories", daysBack: 4 },
          ]),
        },
      ],
    },
    {
      id: obj3Id,
      userId: "demo",
      title: "Launch Side Project to Public",
      description:
        "Build, polish, and ship a real product with paying users or active beta testers within the next month.",
      deadline: daysFromNow(30),
      status: "active",
      tags: ["project", "coding"],
      keyResults: [
        {
          id: kr3a,
          objectiveId: obj3Id,
          title: "Complete all MVP features",
          type: "percentage",
          targetValue: 100,
          currentValue: 90,
          unit: "%",
          weight: 3,
          status: "active",
          checkIns: buildCheckIns(kr3a, [
            { value: 30, note: "Auth + CRUD done", daysBack: 21 },
            { value: 70, note: "Dashboard and analytics shipped", daysBack: 10 },
            { value: 90, note: "Only polish and edge cases left", daysBack: 1 },
          ]),
        },
        {
          id: kr3b,
          objectiveId: obj3Id,
          title: "Get 50 beta users signed up",
          type: "percentage",
          targetValue: 50,
          currentValue: 32,
          unit: "users",
          weight: 2,
          status: "active",
          checkIns: buildCheckIns(kr3b, [
            { value: 5, note: "Shared with close friends", daysBack: 20 },
            { value: 18, note: "Posted on Indie Hackers", daysBack: 10 },
            { value: 32, note: "Reddit post got traction!", daysBack: 3 },
          ]),
        },
      ],
    },
  ];
}

// ── 4. Projects ──────────────────────────────────────────────────────────────

function buildTask(
  milestoneId: string,
  title: string,
  status: "done" | "in-progress" | "todo",
  order: number
): any {
  return {
    id: uuid(),
    milestoneId,
    title,
    status,
    order,
    completedAt: status === "done" ? isoAgo(Math.floor(rand() * 14 + 1)) : null,
    createdAt: isoAgo(30),
  };
}

function buildProjects(): any[] {
  // Project 1 – StudyTracker App
  const p1Id = uuid();
  const m1aId = uuid();
  const m1bId = uuid();

  // Project 2 – Blog Platform
  const p2Id = uuid();
  const m2aId = uuid();

  // Project 3 – Japanese Study Plan
  const p3Id = uuid();
  const m3aId = uuid();

  return [
    {
      id: p1Id,
      userId: "demo",
      title: "StudyTracker App",
      description:
        "A full-stack productivity app for students – habits, OKRs, todo lists, and a study compass.",
      status: "active",
      color: "#6366f1",
      tags: ["coding", "fullstack"],
      targetDate: daysFromNow(45),
      createdAt: isoAgo(60),
      milestones: [
        {
          id: m1aId,
          projectId: p1Id,
          title: "Core Features",
          description: "All primary CRUD and tracking functionality.",
          status: "in-progress",
          order: 1,
          tasks: [
            buildTask(m1aId, "Set up Next.js project with Prisma + Supabase", "done", 1),
            buildTask(m1aId, "Build habit tracker with streak logic", "done", 2),
            buildTask(m1aId, "Implement OKR module with check-ins", "in-progress", 3),
          ],
        },
        {
          id: m1bId,
          projectId: p1Id,
          title: "Polish & Deploy",
          description: "UI polish, performance tuning, and production deployment.",
          status: "todo",
          order: 2,
          tasks: [
            buildTask(m1bId, "Add dark mode and theme customization", "todo", 1),
            buildTask(m1bId, "Deploy to Vercel with custom domain", "todo", 2),
          ],
        },
      ],
      logs: [
        {
          id: uuid(),
          projectId: p1Id,
          userId: "demo",
          content: "Finished the habit log calendar view – looks great with the heatmap!",
          createdAt: isoAgo(5),
        },
        {
          id: uuid(),
          projectId: p1Id,
          userId: "demo",
          content: "OKR check-in flow is working end-to-end. Just need to wire up the progress charts.",
          createdAt: isoAgo(2),
        },
      ],
    },
    {
      id: p2Id,
      userId: "demo",
      title: "Blog Platform",
      description: "A minimal, fast blogging platform built with Next.js and MDX. Focus on writing experience.",
      status: "planning",
      color: "#f59e0b",
      tags: ["coding", "writing"],
      targetDate: daysFromNow(75),
      createdAt: isoAgo(20),
      milestones: [
        {
          id: m2aId,
          projectId: p2Id,
          title: "Design & Architecture",
          description: "Finalize tech stack, wireframes, and data model.",
          status: "in-progress",
          order: 1,
          tasks: [
            buildTask(m2aId, "Create Figma wireframes for core pages", "done", 1),
            buildTask(m2aId, "Design database schema for posts and tags", "todo", 2),
          ],
        },
      ],
      logs: [
        {
          id: uuid(),
          projectId: p2Id,
          userId: "demo",
          content: "Decided to go with MDX + Contentlayer for the content layer. Great DX.",
          createdAt: isoAgo(10),
        },
        {
          id: uuid(),
          projectId: p2Id,
          userId: "demo",
          content: "Wireframes approved. Moving on to schema design next week.",
          createdAt: isoAgo(3),
        },
      ],
    },
    {
      id: p3Id,
      userId: "demo",
      title: "Japanese Study Plan",
      description:
        "Structured JLPT N3 preparation: grammar, vocabulary, kanji, and listening practice over 6 months.",
      status: "active",
      color: "#10b981",
      tags: ["learning", "language"],
      targetDate: daysFromNow(120),
      createdAt: isoAgo(45),
      milestones: [
        {
          id: m3aId,
          projectId: p3Id,
          title: "JLPT N3 Preparation",
          description: "Cover all N3 grammar patterns, 1500 vocab words, and 300 kanji.",
          status: "in-progress",
          order: 1,
          tasks: [
            buildTask(m3aId, "Complete N3 grammar guide (Tobira chapters 1-10)", "done", 1),
            buildTask(m3aId, "Anki deck: 1500 N3 vocabulary cards", "in-progress", 2),
            buildTask(m3aId, "Practice 5 full JLPT N3 mock exams", "todo", 3),
          ],
        },
      ],
      logs: [
        {
          id: uuid(),
          projectId: p3Id,
          userId: "demo",
          content: "Hit 400-day Anki streak! Vocabulary retention is getting much better.",
          createdAt: isoAgo(8),
        },
        {
          id: uuid(),
          projectId: p3Id,
          userId: "demo",
          content: "Mock exam 1 result: 62% – need to focus more on grammar section.",
          createdAt: isoAgo(2),
        },
        {
          id: uuid(),
          projectId: p3Id,
          userId: "demo",
          content: "Discovered a great podcast for N3 listening practice. Adding to daily routine.",
          createdAt: isoAgo(1),
        },
      ],
    },
  ];
}

// ── 5. Content Items ──────────────────────────────────────────────────────────

function buildContent(): any[] {
  return [
    {
      id: uuid(),
      userId: "demo",
      title: "The Pragmatic Programmer",
      url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
      description:
        "20th anniversary edition – timeless software craftsmanship advice from Hunt and Thomas.",
      type: "book",
      status: "completed",
      priority: 1,
      rating: 5,
      notes:
        "Key takeaway: 'Don't live with broken windows.' The DRY principle and orthogonality chapters are essential re-reads.",
      source: "Recommended by mentor",
      estimatedTime: 480,
      tags: ["programming", "career", "fundamentals"],
      startedAt: isoAgo(40),
      completedAt: isoAgo(12),
      createdAt: isoAgo(45),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Next.js App Router Deep Dive",
      url: "https://www.youtube.com/watch?v=DrxiNfbr63s",
      description:
        "Comprehensive walkthrough of the Next.js 14 App Router, RSC, server actions, and streaming.",
      type: "video",
      status: "completed",
      priority: 1,
      rating: 4,
      notes: "Server actions change everything for forms. Need to refactor old pages-router projects.",
      source: "YouTube – Fireship",
      estimatedTime: 90,
      tags: ["nextjs", "react", "frontend"],
      startedAt: isoAgo(15),
      completedAt: isoAgo(8),
      createdAt: isoAgo(20),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "System Design Interview – An Insider's Guide",
      url: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF",
      description:
        "Volume 1 – covers URL shorteners, rate limiters, consistent hashing, and more real interview scenarios.",
      type: "book",
      status: "learning",
      priority: 1,
      rating: null,
      notes: "Currently on chapter 6 (design a key-value store). Taking detailed notes as I go.",
      source: "Recommended by tech community",
      estimatedTime: 600,
      tags: ["system-design", "career", "interview"],
      startedAt: isoAgo(10),
      completedAt: null,
      createdAt: isoAgo(18),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Full-Stack TypeScript with tRPC and Prisma",
      url: "https://www.totaltypescript.com/tutorials/zod",
      description:
        "End-to-end type safety from database to UI using tRPC, Prisma, and Zod for runtime validation.",
      type: "course",
      status: "learning",
      priority: 2,
      rating: null,
      notes: "Module 4 (advanced Zod patterns) is gold. The discriminated union section is immediately useful.",
      source: "Total TypeScript – Matt Pocock",
      estimatedTime: 240,
      tags: ["typescript", "trpc", "fullstack"],
      startedAt: isoAgo(6),
      completedAt: null,
      createdAt: isoAgo(14),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Building a Second Brain",
      url: "https://www.buildingasecondbrain.com/",
      description:
        "Tiago Forte's PARA method for organizing digital knowledge and turning notes into output.",
      type: "book",
      status: "want_to_learn",
      priority: 2,
      rating: null,
      notes: "Heard great things about the CODE method (Capture, Organize, Distill, Express).",
      source: "Mentioned in productivity podcast",
      estimatedTime: 360,
      tags: ["productivity", "note-taking", "knowledge-management"],
      startedAt: null,
      completedAt: null,
      createdAt: isoAgo(7),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Understanding TypeScript – 2024 Edition",
      url: "https://www.udemy.com/course/understanding-typescript/",
      description:
        "Maximilian Schwarzmüller's comprehensive TypeScript course covering generics, decorators, and module systems.",
      type: "course",
      status: "want_to_learn",
      priority: 3,
      rating: null,
      notes: "Want to revisit decorators section after working with NestJS.",
      source: "Udemy",
      estimatedTime: 540,
      tags: ["typescript", "javascript", "programming"],
      startedAt: null,
      completedAt: null,
      createdAt: isoAgo(3),
    },
  ];
}

// ── 6. Ideas ──────────────────────────────────────────────────────────────────

function buildIdeas(projects: any[]): any[] {
  const studyTrackerProjectId = projects[0]?.id ?? null;

  return [
    {
      id: uuid(),
      userId: "demo",
      title: "AI-powered study assistant",
      description:
        "Integrate an LLM to analyze study patterns, suggest optimal review times based on spaced repetition science, and generate personalized quiz questions from notes.",
      type: "feature",
      status: "evaluating",
      priority: 1,
      tags: ["ai", "productivity", "learning"],
      linkedProjectId: studyTrackerProjectId,
      createdAt: isoAgo(14),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Habit analytics dashboard",
      description:
        "Rich visualizations for habit data – streak calendars, completion heatmaps, time-of-day patterns, and correlation analysis between habits.",
      type: "feature",
      status: "planned",
      priority: 1,
      tags: ["analytics", "visualization", "habits"],
      linkedProjectId: studyTrackerProjectId,
      createdAt: isoAgo(20),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Pomodoro timer with session logging",
      description:
        "Built-in Pomodoro timer that automatically creates study session logs, tags them with the active project, and contributes to daily activity stats.",
      type: "feature",
      status: "in_progress",
      priority: 2,
      tags: ["productivity", "timer", "focus"],
      linkedProjectId: studyTrackerProjectId,
      createdAt: isoAgo(8),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Weekly review email digest",
      description:
        "Automated Sunday evening email summarizing the week: habits completed, OKR progress, todos resolved, and a motivational nudge for the week ahead.",
      type: "product",
      status: "raw",
      priority: 2,
      tags: ["email", "automation", "engagement"],
      linkedProjectId: null,
      createdAt: isoAgo(5),
    },
    {
      id: uuid(),
      userId: "demo",
      title: "Public progress page / share profile",
      description:
        "Let users share a public URL showing their active goals, habit streaks, and recent wins. Great for accountability and community building.",
      type: "product",
      status: "raw",
      priority: 3,
      tags: ["social", "accountability", "sharing"],
      linkedProjectId: null,
      createdAt: isoAgo(3),
    },
  ];
}

// ── 7. Compass ───────────────────────────────────────────────────────────────

const COMPASS_CONTENT = `# My Life Compass

## Vision
I want to become a world-class software engineer who builds products people love, speaks Japanese fluently, and maintains the energy and health to do meaningful work for decades.

## Core Values
- **Craftsmanship** – I take pride in my work. Good enough is a ceiling, not a goal.
- **Continuous learning** – Every day I should understand something I didn't yesterday.
- **Health as foundation** – Without energy and clarity, nothing else scales.
- **Depth over breadth** – Master a few things rather than skim everything.

## 1-Year Theme: *Compound Growth*
This year is about stacking small wins that compound. Ship real projects. Maintain habits even when motivation is low. Learn Japanese consistently. Review and adjust every week.

## Career Direction
Build full-stack web products using TypeScript, React, and Node.js. Target senior engineer roles at product-focused companies or grow an indie product to $1k MRR within 18 months.

## Learning Focus
1. Frontend mastery – React, Next.js, advanced TypeScript
2. System design – distributed systems fundamentals
3. Japanese – reach JLPT N3 by end of year

## Guiding Questions
- Am I working on the most important thing right now?
- Would I be proud of this work in 5 years?
- Am I taking care of my body and mind?
`;

// ── 8. Stats ──────────────────────────────────────────────────────────────────

export function createMockStats(days: number): any {
  // Completion over time – one entry per day
  const completionOverTime = Array.from({ length: days }, (_, i) => {
    const d = daysAgo(days - 1 - i);
    // Slight upward trend with noise
    const base = 0.55 + (i / days) * 0.2;
    const noise = (Math.sin(i * 1.7) * 0.1 + Math.cos(i * 0.9) * 0.08);
    const rate = Math.min(1, Math.max(0, base + noise));
    return { date: d, rate: Math.round(rate * 100) / 100 };
  });

  // Streaks
  const streaks = [
    { habitId: "h1", title: "Morning Meditation", icon: "🧘", current: 14, longest: 32 },
    { habitId: "h2", title: "Read 30 mins", icon: "📚", current: 21, longest: 45 },
    { habitId: "h3", title: "Exercise", icon: "💪", current: 7, longest: 28 },
    { habitId: "h5", title: "Journal", icon: "✍️", current: 10, longest: 22 },
    { habitId: "h6", title: "Learn Japanese", icon: "🇯🇵", current: 38, longest: 38 },
    { habitId: "h4", title: "Review Goals", icon: "🎯", current: 4, longest: 12 },
  ];

  // Habit performance
  const habitPerformance = [
    { habitId: "h6", title: "Learn Japanese", rate: 0.88 },
    { habitId: "h2", title: "Read 30 mins", rate: 0.82 },
    { habitId: "h1", title: "Morning Meditation", rate: 0.78 },
    { habitId: "h5", title: "Journal", rate: 0.72 },
    { habitId: "h3", title: "Exercise", rate: 0.65 },
    { habitId: "h4", title: "Review Goals", rate: 0.60 },
  ];

  // Weekly pattern (0=Sun...6=Sat)
  const weeklyPattern = [
    { day: "Sun", avgCompletions: 4.1 },
    { day: "Mon", avgCompletions: 4.8 },
    { day: "Tue", avgCompletions: 5.0 },
    { day: "Wed", avgCompletions: 4.6 },
    { day: "Thu", avgCompletions: 4.7 },
    { day: "Fri", avgCompletions: 3.9 },
    { day: "Sat", avgCompletions: 3.5 },
  ];

  // OKR objectives
  const objectives = [
    { id: "o1", title: "Master React & Next.js", progress: 65, status: "active", deadline: daysFromNow(60) },
    { id: "o2", title: "Improve Physical Health", progress: 40, status: "active", deadline: daysFromNow(90) },
    { id: "o3", title: "Launch Side Project", progress: 80, status: "active", deadline: daysFromNow(30) },
  ];

  // Content by status / type
  const contentByStatus = [
    { status: "completed", count: 2 },
    { status: "learning", count: 2 },
    { status: "want_to_learn", count: 2 },
  ];

  const contentByType = [
    { type: "book", count: 3 },
    { type: "course", count: 2 },
    { type: "video", count: 1 },
  ];

  // Completed over time (past 6 months, monthly)
  const completedOverTime = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { month, count: Math.floor(1 + i * 0.4 + Math.sin(i) * 0.5) };
  });

  // Task velocity (past 4 weeks)
  const taskVelocity = Array.from({ length: 4 }, (_, i) => {
    const weekStart = daysAgo((3 - i) * 7 + 6);
    return { week: weekStart, count: 3 + Math.floor(Math.sin(i * 1.2) * 2 + i * 1.5) };
  });

  // Daily activity
  const dailyActivity = Array.from({ length: days }, (_, i) => {
    const d = daysAgo(days - 1 - i);
    const weekDay = new Date(d).getDay();
    const isWeekend = weekDay === 0 || weekDay === 6;
    const base = isWeekend ? 3 : 6;
    const count = Math.max(0, Math.floor(base + Math.sin(i * 0.7) * 2 + (i / days) * 3));
    return { date: d, count };
  });

  return {
    summary: {
      totalHabits: 6,
      habitCompletionRate: 0.74,
      activeObjectives: 3,
      avgOkrProgress: 62,
      contentCompleted: 2,
      contentTotal: 6,
      tasksCompleted: 5,
      tasksTotal: 10,
      totalIdeas: 5,
    },
    habits: {
      completionOverTime,
      streaks,
      habitPerformance,
      weeklyPattern,
    },
    okr: {
      objectives,
      statusBreakdown: [{ status: "active", count: 3 }],
    },
    content: {
      byStatus: contentByStatus,
      byType: contentByType,
      completedOverTime,
    },
    projects: {
      tasksByStatus: [
        { status: "done", count: 5 },
        { status: "in-progress", count: 2 },
        { status: "todo", count: 4 },
      ],
      projectsByStatus: [
        { status: "active", count: 2 },
        { status: "planning", count: 1 },
      ],
      taskVelocity,
    },
    activity: {
      dailyActivity,
    },
  };
}

// ── Main factory ──────────────────────────────────────────────────────────────

export function createMockData(): DemoStore {
  seedReset();
  const habits = buildHabits();
  const todos = buildTodos();
  const objectives = buildObjectives();
  const projects = buildProjects();
  const content = buildContent();
  const ideas = buildIdeas(projects);
  const compass = COMPASS_CONTENT;

  return { habits, todos, objectives, projects, content, ideas, compass };
}
