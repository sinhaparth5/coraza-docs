# Repository Guidelines

## Project Structure & Module Organization

This repository is a Next.js 16 documentation site built with Fumadocs. Application routes live in `src/app/`: `(home)` contains the landing page, `docs` renders documentation, and `api/search` provides search. Shared React and MDX components belong in `src/components`, while source loading and layout helpers live in `src/lib`. Write documentation as MDX under `content/docs`; configure its schema and collection behavior in `source.config.ts`. Global styles are in `src/app/global.css`. Generated directories such as `.next/` and `.source/` must not be edited or committed.

## Build, Test, and Development Commands

Use pnpm so installs remain consistent with `pnpm-lock.yaml`.

- `pnpm install` installs dependencies and regenerates Fumadocs metadata.
- `pnpm dev` starts the local development server at `http://localhost:3000`.
- `pnpm build` creates a production build and catches integration errors.
- `pnpm start` serves the completed production build.
- `pnpm types:check` regenerates MDX and route types, then runs strict TypeScript checks.
- `pnpm lint` runs Biome's recommended Next.js and React rules.
- `pnpm format` formats supported files and organizes imports.

## Coding Style & Naming Conventions

Biome is authoritative: use two-space indentation and run `pnpm format` before submitting. Keep TypeScript strict and prefer the `@/` alias for imports from `src`. Name React components in PascalCase, hooks with a `use` prefix, and utility modules with concise lowercase names. Follow Next.js file conventions (`page.tsx`, `layout.tsx`, `route.ts`). Documentation filenames and URL slugs should be lowercase and hyphenated, with clear `title` and `description` frontmatter.

## Testing Guidelines

No automated test framework or coverage threshold is configured yet. Every change should pass `pnpm lint`, `pnpm types:check`, and `pnpm build`. For content or UI changes, also inspect the affected routes in `pnpm dev`, including navigation, search, responsive layout, and MDX rendering. If tests are introduced, colocate them with source files as `*.test.ts` or `*.test.tsx` and add the runner to `package.json`.

## Commit & Pull Request Guidelines

Recent history uses short, imperative, lowercase summaries such as `updated the node version`; keep commits focused and describe the outcome clearly. Pull requests should explain what changed and why, list verification commands, and link relevant issues. Include before-and-after screenshots for visible UI or documentation-layout changes. Do not commit generated output, local configuration, or secrets.
