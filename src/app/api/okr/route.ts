import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const objectives = await prisma.objective.findMany({
    where: { userId: user.id },
    include: {
      keyResults: {
        include: {
          checkIns: {
            orderBy: { date: "desc" },
            take: 5,
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { deadline: "asc" },
  });

  return NextResponse.json(objectives);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const objective = await prisma.objective.create({
    data: {
      userId: user.id,
      title: body.title,
      description: body.description,
      deadline: new Date(body.deadline),
      keyResults: {
        create: (body.keyResults ?? []).map(
          (kr: {
            title: string;
            type?: string;
            targetValue?: number;
            unit?: string;
            weight?: number;
            dueDate?: string;
          }) => ({
            title: kr.title,
            type: kr.type ?? "percentage",
            targetValue: kr.targetValue ?? 100,
            unit: kr.unit,
            weight: kr.weight ?? 3,
            dueDate: kr.dueDate ? new Date(kr.dueDate) : undefined,
          })
        ),
      },
    },
    include: { keyResults: true },
  });

  return NextResponse.json(objective, { status: 201 });
}
