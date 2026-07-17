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
- [x] `LockKeyholeIcon` — TLS feature card
- [x] `LayoutDashboardIcon` — admin dashboard feature card
- [x] `ActivityIcon` — Prometheus metrics feature card
- [x] `ArrowRightIcon` — architecture bullets and blog links
- [x] `ArrowLeftIcon` — return to all articles
- [x] `CopyIcon` — installer command copy action
- [x] `CheckIcon` — copied confirmation

The supplied `SearchIcon`, `SunIcon`, `MoonIcon`, `ChevronDownIcon`, `ChevronLeftIcon`,
`ChevronRightIcon`, `ClipboardCheckIcon`, `LinkIcon`, and `TextDocumentIcon` are compatible and
exported from `index.ts`. They are not applied to Fumadocs yet because those controls are owned by
the framework.

The GitHub icon inside Fumadocs' **Open** page-action menu still uses the framework asset and needs
a page-action override before it can share `GithubIcon`.

## Application icons pending

- [ ] `CorazaLogo` — primary navigation and brand artwork
- [ ] `CorazaFavicon` — browser and manifest icon

## Fumadocs icons pending

These require component or layout-slot overrides rather than direct import replacement.

- [x] `SearchIcon` — supplied; search trigger and dialog override pending
- [ ] `HashIcon` — search-result headings
- [x] `SunIcon` — supplied; light-theme control override pending
- [x] `MoonIcon` — supplied; dark-theme control override pending
- [ ] `SidebarIcon` — mobile documentation sidebar
- [x] `ChevronDownIcon` — supplied; menus and sidebar override pending
- [x] `ChevronRightIcon` — supplied; breadcrumbs and search override pending
- [x] `ChevronLeftIcon` — supplied; previous-page override pending
- [x] `TextDocumentIcon` — supplied; TOC and Markdown-view override pending
- [ ] `ExternalLinkIcon` — external navigation items
- [x] `ClipboardCheckIcon` — supplied; copied code-block state override pending
- [x] `LinkIcon` — supplied; heading-anchor override pending
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
