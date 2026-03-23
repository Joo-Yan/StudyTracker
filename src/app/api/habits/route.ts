import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { isHabitScheduledToday } from "@/lib/habit-schedule";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const todayFilter = req.nextUrl.searchParams.get("today") === "true";
  const tag = req.nextUrl.searchParams.get("tag");
  const dateParam = req.nextUrl.searchParams.get("date");
  const todayStr =
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
      ? dateParam
      : new Date().toISOString().slice(0, 10);
  const todayDow = new Date().getDay(); // 0=Sun … 6=Sat

  const habits = await prisma.habit.findMany({
    where: { userId: user.id, isActive: true, ...(tag ? { tags: { has: tag } } : {}) },
    include: {
      logs: {
        where: { date: todayStr },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (!todayFilter) return NextResponse.json(habits);

  // Filter to habits scheduled for today
  const filtered = habits.filter((h) => isHabitScheduledToday(h, todayDow));

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const habit = await prisma.habit.create({
    data: {
      userId: user.id,
      title: body.title,
      description: body.description,
      icon: body.icon ?? "✓",
      color: body.color ?? "#6366f1",
      frequencyType: body.frequencyType ?? "daily",
      frequencyDays: body.frequencyDays ?? [],
      timesPerPeriod: body.timesPerPeriod,
      reminderTime: body.reminderTime,
      tags: body.tags ?? [],
    },
  });

  return NextResponse.json(habit, { status: 201 });
}
