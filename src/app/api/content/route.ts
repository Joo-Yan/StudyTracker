import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tag = req.nextUrl.searchParams.get("tag");

  const items = await prisma.contentItem.findMany({
    where: { userId: user.id, ...(tag ? { tags: { has: tag } } : {}) },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const item = await prisma.contentItem.create({
    data: {
      userId: user.id,
      title: body.title,
      url: body.url,
      description: body.description,
      type: body.type ?? "article",
      tags: body.tags ?? [],
      status: body.status ?? "want_to_learn",
      priority: body.priority ?? 2,
      source: body.source,
      estimatedTime: body.estimatedTime,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
