import {
  Globe,
  FolderTree,
  Monitor,
  Server,
  Database,
  Shield,
  Wrench,
  Rocket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ChapterMeta {
  slug: string;
  order: number;
  icon: LucideIcon;
}

export const chapters: ChapterMeta[] = [
  { slug: "what-is-a-web-app", order: 1, icon: Globe },
  { slug: "project-structure", order: 2, icon: FolderTree },
  { slug: "frontend", order: 3, icon: Monitor },
  { slug: "backend-and-api", order: 4, icon: Server },
  { slug: "database", order: 5, icon: Database },
  { slug: "authentication", order: 6, icon: Shield },
  { slug: "tech-stack", order: 7, icon: Wrench },
  { slug: "deployment", order: 8, icon: Rocket },
];

export function getChapterBySlug(slug: string): ChapterMeta | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getAdjacentChapters(slug: string) {
  const idx = chapters.findIndex((c) => c.slug === slug);
  return {
    prev: idx > 0 ? chapters[idx - 1] : null,
    next: idx < chapters.length - 1 ? chapters[idx + 1] : null,
  };
}
