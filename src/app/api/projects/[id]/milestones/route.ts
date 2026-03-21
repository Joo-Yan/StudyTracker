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
  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const count = await prisma.milestone.count({ where: { projectId } });

  const milestone = await prisma.milestone.create({
    data: {
      projectId,
      title: body.title,
      description: body.description,
      order: count,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    },
    include: { tasks: true },
  });

  return NextResponse.json(milestone, { status: 201 });
}
