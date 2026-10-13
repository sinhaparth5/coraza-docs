export const GITHUB_URL = "https://github.com/sinhaparth5/coraza-waf-mod";

export const primaryButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md bg-ink px-5 py-3 text-sm font-semibold text-paper no-underline shadow-[3px_3px_0_var(--color-highlight)] transition duration-200 hover:-translate-y-px hover:shadow-[4px_4px_0_var(--color-highlight)] active:translate-y-0 active:shadow-[1px_1px_0_var(--color-highlight)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const secondaryButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-ink/30 px-5 py-3 text-sm font-semibold text-ink no-underline transition duration-200 hover:border-ink hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const eyebrow =
  "font-mono text-xs uppercase tracking-[0.14em] text-ink-soft";

export const footerLinks: {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    heading: "Product",
    links: [
      { label: "Introduction", href: "/docs/intro" },
      { label: "Architecture", href: "/docs/overview/architecture" },
      { label: "Installation", href: "/docs/installation/install" },
      { label: "Admin dashboard", href: "/docs/configuration/dashboard" },
    ],
  },
  {
    heading: "Security",
    links: [
      { label: "WAF rules", href: "/docs/security/waf" },
      {
        label: "Bot protection",
        href: "/docs/security/bot-and-fingerprinting",
      },
      { label: "Rate limiting", href: "/docs/configuration/rate-limiting" },
      { label: "Threat score", href: "/docs/security/threat-score" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/docs/faq" },
      { label: "Troubleshooting", href: "/docs/troubleshooting" },
      { label: "Privacy & cookies", href: "/privacy" },
      { label: "GitHub", href: GITHUB_URL, external: true },
    ],
  },
];

export const databaseDrivers = [
  "SQLite",
  "MySQL",
  "MariaDB",
  "Postgres",
  "CockroachDB",
  "Neon",
];

export const noDepsChips = [
  "No Docker",
  "No config.yaml",
  "No external database server",
  "No MaxMind account",
  "No Redis, unless you scale to multiple nodes",
  "Nothing fetched at runtime: GeoIP, CRS, and the dashboard are embedded",
];

export const faqItems: { question: string; answer: string }[] = [
  {
    question: "Do I need Docker?",
    answer:
      "No. Native binary + systemd installation remains supported. A published multi-architecture image is also available from GHCR for container deployments.",
  },
  {
    question: "Do I need a database server?",
    answer:
      "No. SQLite is the default. MySQL/MariaDB and Postgres-compatible servers are optional alternatives; Redis is separate and only provides shared rate-limit state.",
  },
  {
    question: "Do I need a MaxMind account for geo blocking?",
    answer:
      "No. A GeoLite2-Country database is bundled. You can optionally override it with a freshly downloaded .mmdb via --geo-db.",
  },
  {
    question: "Is there a config file?",
    answer:
      "Not for the running server. It's configured by CLI flags plus the dashboard/database. Older docs referencing config.yaml predate the move to flags.",
  },
  {
    question: "Can I run multiple instances?",
    answer:
      "Yes, behind a load balancer. Use an external database for shared state, Redis for a shared rate-limit view, and set --trusted-proxies to the load balancer's CIDR.",
  },
  {
    question: "Can I manage services and IP rules without the dashboard UI?",
    answer:
      "Yes. A bearer-token-authenticated REST API at /admin/api/v1 covers services, IP rules, and bans, for scripting and CI integrations.",
  },
];

export const pipeline = [
  {
    stage: "01",
    title: "Bot gate",
    detail: "JS proof-of-work turns away headless clients early.",
  },
  {
    stage: "02",
    title: "Rate & IP policy",
    detail: "Token-bucket limits and IP blocklists throttle abuse per client.",
  },
  {
    stage: "03",
    title: "Geo policy",
    detail: "Country allow or deny, resolved from the bundled GeoIP2 database.",
  },
  {
    stage: "04",
    title: "WAF inspection",
    detail: "OWASP CRS 4.x rules catch SQLi, XSS, RCE, and path traversal.",
  },
  {
    stage: "05",
    title: "Routing",
    detail: "Host or prefix match forwards what survives to your backend.",
  },
];
