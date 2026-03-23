import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tag = req.nextUrl.searchParams.get("tag");

  const projects = await prisma.project.findMany({
    where: { userId: user.id, ...(tag ? { tags: { has: tag } } : {}) },
    include: {
      milestones: {
        include: { tasks: true },
        orderBy: { order: "asc" },
      },
      logs: { orderBy: { createdAt: "desc" }, take: 3 },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      title: body.title,
      description: body.description,
      status: body.status ?? "active",
      color: body.color ?? "#6366f1",
      tags: body.tags ?? [],
      targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
      linkedIdeaId: body.linkedIdeaId,
    },
    include: { milestones: { include: { tasks: true } }, logs: true },
  });

  return NextResponse.json(project, { status: 201 });
}
