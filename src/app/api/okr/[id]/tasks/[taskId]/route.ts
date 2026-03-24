import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, taskId } = await params;
  const existing = await prisma.oKRTask.findFirst({
    where: { id: taskId, objectiveId: id, userId: user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.status !== undefined) {
    data.status = body.status;
    data.completedAt = body.status === "done" ? new Date() : null;
  }
  if (body.title !== undefined) data.title = body.title;

  const task = await prisma.oKRTask.update({ where: { id: taskId }, data });
  return NextResponse.json(task);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, taskId } = await params;
  const existing = await prisma.oKRTask.findFirst({
    where: { id: taskId, objectiveId: id, userId: user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.oKRTask.delete({ where: { id: taskId } });
  return NextResponse.json({ success: true });
}
