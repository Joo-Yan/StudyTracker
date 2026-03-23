import { getChapterBySlug, chapters } from "@/lib/learn/chapters";
import { notFound } from "next/navigation";
import { ChapterPageClient } from "./chapter-page-client";

export function generateStaticParams() {
  return chapters.map((c) => ({ chapter: c.slug }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const meta = getChapterBySlug(chapter);
  if (!meta) notFound();
  return <ChapterPageClient slug={chapter} />;
}
