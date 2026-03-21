import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const date = body.date ?? new Date().toISOString().slice(0, 10);

  // Verify habit belongs to user
  const habit = await prisma.habit.findFirst({
    where: { id, userId: user.id },
  });

  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const log = await prisma.habitLog.upsert({
    where: { habitId_date: { habitId: id, date } },
    create: { habitId: id, date, completed: true, note: body.note },
    update: { completed: body.completed ?? true, note: body.note },
  });

  return NextResponse.json(log);
}
