# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`coraza-docs` is the documentation and marketing site for Coraza WAF Mod, built with Next.js 16 and Fumadocs. Documentation content lives as Markdown/MDX under `content/`, not in the app router tree.

## Commands

Use pnpm (installs must stay consistent with `pnpm-lock.yaml`).

- `pnpm install` — installs dependencies and regenerates Fumadocs metadata (`postinstall` runs `fumadocs-mdx`).
- `pnpm dev` — starts the dev server at `http://localhost:3000`.
- `pnpm build` — production build; also catches integration errors.
- `pnpm start` — serves a completed production build.
- `pnpm types:check` — regenerates MDX/route types (`fumadocs-mdx`, `next typegen`) then runs `tsc --noEmit`. Run this after touching content schemas, routes, or `source.config.ts`.
- `pnpm lint` — Biome check (Next.js + React rule domains).
- `pnpm format` — Biome format with import organization; run before submitting changes.

There is no test framework configured. Verify changes with `pnpm lint`, `pnpm types:check`, `pnpm build`, and manual inspection via `pnpm dev`.

## Architecture

**Content vs. app split**: Documentation and blog posts are authored as MD/MDX under `content/docs/` and `content/blog/`, not as React routes. `source.config.ts` defines the Fumadocs collections (`docs`, `blog`) including frontmatter schemas (blog posts require `slug`, `date`, `authors`, `tags`; docs use Fumadocs' standard `pageSchema`). Fumadocs MDX compiles these into `.source/` (generated, gitignored, never edit directly) and the `collections/*` path alias (mapped to `.source/*` in `tsconfig.json`).

**Source loading (`src/lib/source.ts`)**: `source` and `blogSource` are `fumadocs-core` loaders built from those collections — nearly everything content-related (page lookup, static params, search indexing, LLM text export) goes through these two loader instances rather than reading the filesystem directly. `src/lib/shared.ts` centralizes route constants (`docsRoute`, `docsContentRoute`, etc.) and `gitConfig` (GitHub org/repo/branch used to build "edit on GitHub" links) — update `gitConfig` there, not inline.

**Route groups**:
- `src/app/(home)` — landing page, shares the root layout but not the docs layout.
- `src/app/docs/[[...slug]]` — catch-all doc page; redirects `/docs` to `/docs/intro`, renders via `source.getPage()` and Fumadocs' `DocsPage`.
- `src/app/blog/[slug]` — blog post pages via `blogSource`.
- `src/app/api/search` — Orama-based search endpoint (`fumadocs-core/search/server`), built from `source`.
- `src/app/og/docs/[...slug]` — dynamic OG image generation per doc page.
- `src/app/llms.txt`, `src/app/llms-full.txt`, `src/app/llms.mdx/docs/[[...slug]]` — machine-readable/LLM-oriented exports of doc content (llms.txt convention).

**Content negotiation (`proxy.ts`)**: rewrites requests for `.md` suffixed doc URLs, or requests from clients that prefer Markdown (`isMarkdownPreferred`), to the `content.md` route under `docsContentRoute` instead of the HTML page. This is how `/docs/foo.md` and markdown-preferring user agents get raw content instead of rendered HTML.

**Icons (`src/components/icons/`)**: custom SVG icon components, not a third-party icon library, each exporting a component and a `*IconHandle` type for imperative control (many support `startAnimation()`/`stopAnimation()` and must respect reduced-motion). New icons: `0 0 24 24` viewBox, `currentColor`, export from `index.ts`, and check them off in `ICON_REPLACEMENTS.md`, which tracks which framework-default (Fumadocs) icons and app icons still need custom replacements — consult it before assuming an icon is unstyled or missing.

## Coding style

- Biome is authoritative (not ESLint/Prettier): two-space indentation, run `pnpm format` before submitting.
- TypeScript strict mode; use the `@/` path alias for imports from `src` (`collections/*` for generated Fumadocs output).
- React components in PascalCase, hooks with a `use` prefix, utility modules in concise lowercase.
- Follow Next.js file conventions (`page.tsx`, `layout.tsx`, `route.ts`).
- Content filenames and URL slugs: lowercase, hyphenated, with `title`/`description` frontmatter.
- Don't edit or commit `.next/` or `.source/` (generated).

## Commits & PRs

Commit summaries are short, imperative, lowercase (e.g. `updated the node version`). PRs should explain what changed and why, list verification commands run, link relevant issues, and include before/after screenshots for visible UI or doc-layout changes.
