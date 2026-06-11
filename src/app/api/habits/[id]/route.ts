import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const FREQUENCY_TYPES = ["daily", "weekly", "monthly"];

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

  const existing = await prisma.habit.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Prisma.HabitUpdateInput = {};
  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    data.title = body.title.trim();
  }
  if (body.description !== undefined) {
    data.description = typeof body.description === "string" ? body.description : null;
  }
  if (body.icon !== undefined && typeof body.icon === "string") data.icon = body.icon;
  if (body.color !== undefined && typeof body.color === "string") data.color = body.color;
  if (body.frequencyType !== undefined) {
    if (typeof body.frequencyType !== "string" || !FREQUENCY_TYPES.includes(body.frequencyType)) {
      return NextResponse.json({ error: "frequencyType must be daily, weekly, or monthly" }, { status: 400 });
    }
    data.frequencyType = body.frequencyType;
  }
  if (body.frequencyDays !== undefined) {
    if (
      !Array.isArray(body.frequencyDays) ||
      body.frequencyDays.some((d) => !Number.isInteger(d) || (d as number) < 0 || (d as number) > 6)
    ) {
      return NextResponse.json({ error: "frequencyDays must be integers 0-6" }, { status: 400 });
    }
    data.frequencyDays = body.frequencyDays as number[];
  }
  if (body.timesPerPeriod !== undefined) {
    data.timesPerPeriod = Number.isInteger(body.timesPerPeriod) ? (body.timesPerPeriod as number) : null;
  }
  if (body.reminderTime !== undefined) {
    data.reminderTime = typeof body.reminderTime === "string" && body.reminderTime ? body.reminderTime : null;
  }
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags) || body.tags.some((t) => typeof t !== "string")) {
      return NextResponse.json({ error: "tags must be an array of strings" }, { status: 400 });
    }
    data.tags = body.tags as string[];
  }

  try {
    const habit = await prisma.habit.update({ where: { id }, data });
    return NextResponse.json(habit);
  } catch (error) {
    console.error("Habit update failed:", error);
    return NextResponse.json({ error: "Failed to update habit" }, { status: 500 });
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

  const existing = await prisma.habit.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await prisma.habit.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Habit delete failed:", error);
    return NextResponse.json({ error: "Failed to delete habit" }, { status: 500 });
  }
}
