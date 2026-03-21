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

  const { id: projectId, taskId } = await params;
  const body = await req.json();

  const task = await prisma.task.findFirst({
    where: { id: taskId, milestone: { project: { id: projectId, userId: user.id } } },
  });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: body.status,
      completedAt: body.status === "done" ? new Date() : null,
    },
  });

  return NextResponse.json(updated);
}
