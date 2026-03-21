import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ideas = await prisma.idea.findMany({
    where: { userId: user.id },
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(ideas);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const idea = await prisma.idea.create({
    data: {
      userId: user.id,
      title: body.title,
      description: body.description,
      type: body.type ?? "project",
      tags: body.tags ?? [],
      status: body.status ?? "raw",
      priority: body.priority ?? 2,
    },
  });

  return NextResponse.json(idea, { status: 201 });
}
