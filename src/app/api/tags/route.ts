import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { isTagEntity, type TagEntity } from "@/lib/tags";

async function getEntityTags(entity: TagEntity, userId: string) {
  switch (entity) {
    case "habits":
      return prisma.habit.findMany({ where: { userId }, select: { tags: true } });
    case "okr":
      return prisma.objective.findMany({ where: { userId }, select: { tags: true } });
    case "todos":
      return prisma.todo.findMany({ where: { userId }, select: { tags: true } });
    case "projects":
      return prisma.project.findMany({ where: { userId }, select: { tags: true } });
    case "content":
      return prisma.contentItem.findMany({ where: { userId }, select: { tags: true } });
    case "ideas":
      return prisma.idea.findMany({ where: { userId }, select: { tags: true } });
  }

  const exhaustiveCheck: never = entity;
  throw new Error(`Unsupported entity: ${exhaustiveCheck}`);
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entity = req.nextUrl.searchParams.get("entity");
  if (!entity || !isTagEntity(entity)) {
    return NextResponse.json({ error: "entity is required" }, { status: 400 });
  }

  try {
    const records = await getEntityTags(entity, user.id);
    const allTags = records
      .flatMap((item) => item.tags)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const unique = [...new Set(allTags)].sort((a, b) => a.localeCompare(b));
    return NextResponse.json(unique);
  } catch {
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}
