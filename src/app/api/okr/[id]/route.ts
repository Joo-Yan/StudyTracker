import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const STATUSES = ["active", "completed", "overdue", "archived"];

interface KrInput {
  id?: string;
  title: string;
  type?: string;
  targetValue?: number;
  unit?: string | null;
  weight?: number;
}

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

  const existing = await prisma.objective.findFirst({
    where: { id, userId: user.id },
    include: { keyResults: { select: { id: true } } },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Prisma.ObjectiveUpdateInput = {};
  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    data.title = body.title.trim();
  }
  if (body.description !== undefined) {
    data.description = typeof body.description === "string" ? body.description : null;
  }
  if (body.deadline !== undefined) {
    const deadline = new Date(body.deadline as string);
    if (isNaN(deadline.getTime())) {
      return NextResponse.json({ error: "A valid deadline is required" }, { status: 400 });
    }
    data.deadline = deadline;
  }
  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = body.status;
  }
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags) || body.tags.some((t) => typeof t !== "string")) {
      return NextResponse.json({ error: "tags must be an array of strings" }, { status: 400 });
    }
    data.tags = body.tags as string[];
  }

  // Optional key-result reconciliation: entries with an id are updated, entries
  // without are created, and existing KRs missing from the array are deleted.
  let krs: KrInput[] | null = null;
  if (body.keyResults !== undefined) {
    if (!Array.isArray(body.keyResults)) {
      return NextResponse.json({ error: "keyResults must be an array" }, { status: 400 });
    }
    krs = body.keyResults as KrInput[];
    const ownIds = new Set(existing.keyResults.map((kr) => kr.id));
    for (const kr of krs) {
      if (typeof kr.title !== "string" || !kr.title.trim()) {
        return NextResponse.json({ error: "Each key result needs a title" }, { status: 400 });
      }
      if (kr.id && !ownIds.has(kr.id)) {
        return NextResponse.json({ error: "Unknown key result id" }, { status: 400 });
      }
    }
  }

  try {
    const keepIds = krs?.filter((kr) => kr.id).map((kr) => kr.id as string) ?? [];
    const objective = await prisma.$transaction(async (tx) => {
      if (krs) {
        await tx.keyResult.deleteMany({
          where: { objectiveId: id, id: { notIn: keepIds } },
        });
        for (const kr of krs) {
          const fields = {
            title: kr.title.trim(),
            type: kr.type ?? "percentage",
            targetValue: kr.targetValue ?? 100,
            unit: kr.unit || null,
            weight: kr.weight ?? 3,
          };
          if (kr.id) {
            await tx.keyResult.update({ where: { id: kr.id }, data: fields });
          } else {
            await tx.keyResult.create({ data: { ...fields, objectiveId: id } });
          }
        }
      }
      return tx.objective.update({
        where: { id },
        data,
        include: {
          keyResults: {
            include: { checkIns: { orderBy: { date: "desc" }, take: 5 } },
            orderBy: { createdAt: "asc" },
          },
          tasks: { orderBy: { createdAt: "asc" } },
        },
      });
    });
    return NextResponse.json(objective);
  } catch (error) {
    console.error("Objective update failed:", error);
    return NextResponse.json({ error: "Failed to update objective" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.objective.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await prisma.objective.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Objective delete failed:", error);
    return NextResponse.json({ error: "Failed to delete objective" }, { status: 500 });
  }
}
