import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: projectId } = await params;
  const body = await req.json();

  // Verify milestone belongs to user's project
  const milestone = await prisma.milestone.findFirst({
    where: { id: body.milestoneId, project: { id: projectId, userId: user.id } },
  });
  if (!milestone) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const task = await prisma.task.create({
    data: { milestoneId: body.milestoneId, title: body.title },
  });

  return NextResponse.json(task, { status: 201 });
}
