import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "./i18n";

interface LearnProgressState {
  locale: Locale;
  completedChapters: string[];
  setLocale: (locale: Locale) => void;
  toggleChapterComplete: (slug: string) => void;
  isChapterComplete: (slug: string) => boolean;
}

export const useLearnStore = create<LearnProgressState>()(
  persist(
    (set, get) => ({
      locale: "en",
      completedChapters: [],
      setLocale: (locale) => set({ locale }),
      toggleChapterComplete: (slug) => {
        const current = get().completedChapters;
        if (current.includes(slug)) {
          set({ completedChapters: current.filter((s) => s !== slug) });
        } else {
          set({ completedChapters: [...current, slug] });
        }
      },
      isChapterComplete: (slug) => get().completedChapters.includes(slug),
    }),
    { name: "learn-progress" }
  )
);
