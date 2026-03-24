import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const objective = await prisma.objective.findFirst({ where: { id, userId: user.id } });
  if (!objective) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const tasks = await prisma.oKRTask.findMany({
    where: { objectiveId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const objective = await prisma.objective.findFirst({ where: { id, userId: user.id } });
  if (!objective) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const task = await prisma.oKRTask.create({
    data: {
      userId: user.id,
      objectiveId: id,
      title: body.title.trim(),
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
  });
  return NextResponse.json(task, { status: 201 });
}
