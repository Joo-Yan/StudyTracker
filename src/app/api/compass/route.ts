import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const compass = await prisma.lifeCompass.findUnique({ where: { userId: user.id } });
    return NextResponse.json({ content: compass?.content ?? "" });
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { content?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.content !== "string") {
    return NextResponse.json({ error: "content must be a string" }, { status: 400 });
  }

  try {
    const compass = await prisma.lifeCompass.upsert({
      where: { userId: user.id },
      create: { userId: user.id, content: body.content },
      update: { content: body.content },
    });
    return NextResponse.json({ content: compass.content });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
