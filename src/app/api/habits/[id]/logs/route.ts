import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const habit = await prisma.habit.findFirst({
    where: { id, userId: user.id },
  });

  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const logs = await prisma.habitLog.findMany({
    where: { habitId: id, completed: true },
    orderBy: { date: "desc" },
    take: 365,
  });

  return NextResponse.json(logs);
}
