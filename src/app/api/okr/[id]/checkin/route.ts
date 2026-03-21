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

  const { id: keyResultId } = await params;
  const body = await req.json();

  // Verify ownership via objective
  const kr = await prisma.keyResult.findFirst({
    where: {
      id: keyResultId,
      objective: { userId: user.id },
    },
  });

  if (!kr) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [checkIn] = await prisma.$transaction([
    prisma.checkIn.create({
      data: {
        keyResultId,
        value: body.value,
        note: body.note,
      },
    }),
    prisma.keyResult.update({
      where: { id: keyResultId },
      data: {
        currentValue: body.value,
        status:
          body.value >= kr.targetValue
            ? "completed"
            : body.value > 0
            ? "in_progress"
            : "not_started",
      },
    }),
  ]);

  return NextResponse.json(checkIn, { status: 201 });
}
