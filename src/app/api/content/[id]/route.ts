import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, userId: user.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const {
    title,
    url,
    description,
    type,
    tags,
    status,
    priority,
    source,
    rating,
    notes,
    estimatedTime,
  } = body;
  const updateData: Prisma.ContentItemUpdateInput = {};

  if (title !== undefined) updateData.title = title;
  if (url !== undefined) updateData.url = url;
  if (description !== undefined) updateData.description = description;
  if (type !== undefined) updateData.type = type;
  if (tags !== undefined) updateData.tags = tags;
  if (status !== undefined) updateData.status = status;
  if (priority !== undefined) updateData.priority = priority;
  if (source !== undefined) updateData.source = source;
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;
  if (estimatedTime !== undefined) updateData.estimatedTime = estimatedTime;

  if (status === "learning" && !item.startedAt) {
    updateData.startedAt = new Date();
  }
  if (status === "completed" && !item.completedAt) {
    updateData.completedAt = new Date();
  }

  const updated = await prisma.contentItem.update({ where: { id }, data: updateData });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const item = await prisma.contentItem.findFirst({ where: { id, userId: user.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.contentItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
