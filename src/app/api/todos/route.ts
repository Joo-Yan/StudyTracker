import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getUtcDayBounds, isValidDateOnly, parseDateOnlyToUtcDate } from "@/lib/todo-utils";
import { todayString } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const due = req.nextUrl.searchParams.get("due");
  const date = req.nextUrl.searchParams.get("date");
  const tag = req.nextUrl.searchParams.get("tag");
  const targetDay = due === "today" ? date ?? todayString() : null;
  if (date && !isValidDateOnly(date)) {
    return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
  }
  const todayBounds = targetDay ? getUtcDayBounds(targetDay) : null;
  if (targetDay && !todayBounds) {
    return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
  }

  const todos = await prisma.todo.findMany({
    where: {
      userId: user.id,
      ...(due === "today" ? {
        completed: false,
        dueDate: { gte: todayBounds!.start, lte: todayBounds!.end },
      } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
    },
    orderBy: [
      { completed: "asc" },
      { dueDate: "asc" },
      { priority: "asc" },
      { createdAt: "asc" },
    ],
  });

  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (body.priority !== undefined && ![1, 2, 3].includes(body.priority as number)) {
    return NextResponse.json({ error: "priority must be 1, 2, or 3" }, { status: 400 });
  }
  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    return NextResponse.json({ error: "tags must be an array" }, { status: 400 });
  }
  if (body.dueDate !== undefined && body.dueDate !== null) {
    if (typeof body.dueDate !== "string" || !isValidDateOnly(body.dueDate)) {
      return NextResponse.json({ error: "dueDate must be YYYY-MM-DD" }, { status: 400 });
    }
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        userId: user.id,
        title: body.title.trim(),
        description: typeof body.description === "string" ? body.description : null,
        dueDate: typeof body.dueDate === "string" ? parseDateOnlyToUtcDate(body.dueDate) : null,
        priority: (body.priority as number) ?? 2,
        tags: (body.tags as string[]) ?? [],
      },
    });
    return NextResponse.json(todo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}
