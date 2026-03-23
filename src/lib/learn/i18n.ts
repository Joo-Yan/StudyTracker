import { en } from "./locales/en";
import { zh } from "./locales/zh";

export type Locale = "en" | "zh";

export type LocaleContent = typeof en;

const locales: Record<Locale, LocaleContent> = { en, zh };

export function getContent(locale: Locale): LocaleContent {
  return locales[locale];
}

export function formatChapterLabel(t: LocaleContent, order: number): string {
  return t.ui.chapterLabel.replace("{n}", String(order));
}
