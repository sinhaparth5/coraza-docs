"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import { fetchClient } from "fumadocs-core/search/client/fetch";
import Link from "next/link";
import { useState } from "react";
import { SearchIcon } from "@/components/icons";

const searchClient = fetchClient({ api: "/api/search" });

const cleanSnippet = (text: string) =>
  text
    .replace(/<\/?mark>/g, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "");

export function DocsSearchSection() {
  const { search, setSearch, query } = useDocsSearch({
    client: searchClient,
    delayMs: 200,
  });
  const [focused, setFocused] = useState(false);

  const results = query.data !== "empty" ? (query.data ?? []) : [];
  const showPanel = focused && search.trim().length > 0;

  return (
    <section className="relative bg-white px-5 py-20 sm:px-8 lg:py-24 dark:bg-pastel-green-900">
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-pixie-green-700 dark:text-pixie-green-300">
          Still have a question?
        </p>
        <h2 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-pastel-green-950 sm:text-4xl dark:text-pastel-green-50">
          Search the docs directly
        </h2>
        <p className="mt-4 text-pretty text-base leading-7 text-pastel-green-900/70 sm:text-lg dark:text-pastel-green-100/70">
          Every page on this site is indexed. Try a flag, a config key, or an
          error message.
        </p>

        <div className="relative mt-8 text-left">
          <div className="flex items-center gap-3 rounded-2xl border border-pastel-green-700/15 bg-pastel-green-50 px-4 py-3.5 shadow-sm focus-within:border-pixie-green-500/50 dark:border-pastel-green-200/10 dark:bg-pastel-green-950/40">
            <SearchIcon
              aria-hidden="true"
              size={18}
              className="shrink-0 text-pastel-green-700/60 dark:text-pastel-green-200/60"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="e.g. trusted-proxies, rate limiting, webhook"
              className="w-full bg-transparent text-sm text-pastel-green-950 placeholder:text-pastel-green-900/40 focus:outline-none dark:text-pastel-green-50 dark:placeholder:text-pastel-green-100/35"
            />
          </div>

          {showPanel ? (
            <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-pastel-green-700/15 bg-white shadow-[0_25px_60px_-25px_rgba(16,34,18,0.3)] dark:border-pastel-green-200/10 dark:bg-pastel-green-900">
              {query.isLoading ? (
                <p className="px-4 py-4 text-sm text-pastel-green-900/50 dark:text-pastel-green-100/50">
                  Searching…
                </p>
              ) : results.length > 0 ? (
                <ul className="divide-y divide-pastel-green-700/10 dark:divide-pastel-green-200/10">
                  {results.slice(0, 8).map((result) => (
                    <li key={result.id}>
                      <Link
                        href={result.url}
                        className="block px-4 py-3 no-underline hover:bg-pastel-green-50 dark:hover:bg-pastel-green-950/40"
                      >
                        <p className="text-sm font-bold text-pastel-green-950 dark:text-pastel-green-50">
                          {cleanSnippet(result.content)}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-pastel-green-900/50 dark:text-pastel-green-100/45">
                          {result.breadcrumbs?.join(" / ") ?? result.url}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-4 text-sm text-pastel-green-900/50 dark:text-pastel-green-100/50">
                  No matches. Try a different term.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
