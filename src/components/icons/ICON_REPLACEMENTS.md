# Icon Replacement Checklist

Use this file to track custom SVG replacements. Interface icons should use a `0 0 24 24` viewBox,
`currentColor`, and no fixed visual color unless the icon is an official brand mark. Animated icons
must respect reduced-motion preferences and expose `startAnimation()` and `stopAnimation()` when
programmatic control is needed.

## Added

- [x] `ShieldCheckIcon` — WAF inspection feature card
- [x] `RouteIcon` — reverse proxy feature card
- [x] `EarthIcon` — IP and geo blocking feature card
- [x] `GithubIcon` — primary navigation link

The GitHub icon inside Fumadocs' **Open** page-action menu still uses the framework asset and needs
a page-action override before it can share `GithubIcon`.

## Application icons pending

- [ ] `LockKeyholeIcon` — TLS feature card
- [ ] `LayoutDashboardIcon` — admin dashboard feature card
- [ ] `ActivityIcon` — Prometheus metrics feature card
- [ ] `ArrowRightIcon` — architecture bullets and blog links
- [ ] `ArrowLeftIcon` — return to all articles
- [ ] `CopyIcon` — installer command copy action
- [ ] `CheckIcon` — copied confirmation
- [ ] `CorazaLogo` — primary navigation and brand artwork
- [ ] `CorazaFavicon` — browser and manifest icon

## Fumadocs icons pending

These require component or layout-slot overrides rather than direct import replacement.

- [ ] `SearchIcon` — search trigger and dialog
- [ ] `HashIcon` — search-result headings
- [ ] `SunIcon` — light theme
- [ ] `MoonIcon` — dark theme
- [ ] `SidebarIcon` — mobile documentation sidebar
- [ ] `ChevronDownIcon` — menus, sidebar groups, TOC, and page options
- [ ] `ChevronRightIcon` — breadcrumbs and search results
- [ ] `ChevronLeftIcon` — previous-page navigation
- [ ] `TextDocumentIcon` — table of contents and Markdown view
- [ ] `ExternalLinkIcon` — external navigation items
- [ ] `ClipboardIcon` — code-block copy action
- [ ] `LinkIcon` — heading anchor action
- [ ] `CopyCheckIcon` — copied heading-link confirmation
- [ ] `InfoIcon` — information and note callouts
- [ ] `TriangleAlertIcon` — warning callouts
- [ ] `ReadingProgressCircle` — mobile article progress
- [ ] `GithubIcon` — Fumadocs page-action menu
- [ ] `SciraLogo` — Open in Scira AI
- [ ] `OpenAILogo` — Open in ChatGPT
- [ ] `AnthropicLogo` — Open in Claude
- [ ] `CursorLogo` — Open in Cursor

## Replacement code

Add each supplied component to `src/components/icons/`, export it from `index.ts`, then check the
matching item above. Keep brand logos faithful to their official artwork.
