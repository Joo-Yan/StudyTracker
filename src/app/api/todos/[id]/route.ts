import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { isValidDateOnly, parseDateOnlyToUtcDate } from "@/lib/todo-utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const existing = await prisma.todo.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Prisma.TodoUpdateInput = {};
  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    data.title = body.title.trim();
  }
  if (body.description !== undefined) {
    data.description = typeof body.description === "string" ? body.description : null;
  }
  if (body.dueDate !== undefined) {
    if (body.dueDate === null || body.dueDate === "") {
      data.dueDate = null;
    } else if (typeof body.dueDate !== "string" || !isValidDateOnly(body.dueDate)) {
      return NextResponse.json({ error: "dueDate must be YYYY-MM-DD" }, { status: 400 });
    } else {
      data.dueDate = parseDateOnlyToUtcDate(body.dueDate);
    }
  }
  if (body.priority !== undefined) {
    if (!Number.isInteger(body.priority) || ![1, 2, 3].includes(body.priority as number)) {
      return NextResponse.json({ error: "priority must be 1, 2, or 3" }, { status: 400 });
    }
    data.priority = body.priority as number;
  }
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags) || body.tags.some((tag) => typeof tag !== "string")) {
      return NextResponse.json({ error: "tags must be an array" }, { status: 400 });
    }
    data.tags = body.tags as string[];
  }
  if (body.completed !== undefined) {
    if (typeof body.completed !== "boolean") {
      return NextResponse.json({ error: "completed must be a boolean" }, { status: 400 });
    }
    data.completed = body.completed;
    data.completedAt = body.completed ? new Date() : null;
  }

  try {
    const todo = await prisma.todo.update({ where: { id }, data });
    return NextResponse.json(todo);
  } catch {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.todo.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
