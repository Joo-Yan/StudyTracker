import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const due = req.nextUrl.searchParams.get("due");
  const tag = req.nextUrl.searchParams.get("tag");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const todos = await prisma.todo.findMany({
    where: {
      userId: user.id,
      ...(due === "today" ? {
        completed: false,
        dueDate: { gte: todayStart, lte: todayEnd },
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

  try {
    const todo = await prisma.todo.create({
      data: {
        userId: user.id,
        title: body.title.trim(),
        description: typeof body.description === "string" ? body.description : null,
        dueDate: body.dueDate ? new Date(body.dueDate as string) : null,
        priority: (body.priority as number) ?? 2,
        tags: (body.tags as string[]) ?? [],
      },
    });
    return NextResponse.json(todo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}
