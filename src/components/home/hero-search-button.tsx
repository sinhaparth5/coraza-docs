"use client";

import { useSearchContext } from "fumadocs-ui/contexts/search";
import { SearchIcon } from "@/components/icons";

export function HeroSearchButton() {
  const { setOpenSearch, enabled } = useSearchContext();
  if (!enabled) return null;

  return (
    <button
      type="button"
      onClick={() => setOpenSearch(true)}
      className="inline-flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-pastel-green-800/20 bg-white/70 px-4 text-left text-sm text-pastel-green-900/75 backdrop-blur-sm transition duration-200 hover:border-pastel-green-700/35 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pastel-green-600 dark:border-pastel-green-200/20 dark:bg-pastel-green-950/50 dark:text-pastel-green-100/80 dark:hover:bg-pastel-green-900/70"
    >
      <SearchIcon aria-hidden="true" size={16} className="shrink-0" />
      <span className="flex-1">Search the docs</span>
      <kbd className="hidden rounded border border-current/25 px-1.5 py-0.5 font-mono text-xs sm:inline">
        Ctrl K
      </kbd>
    </button>
  );
}
