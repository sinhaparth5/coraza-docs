export const GITHUB_URL = "https://github.com/sinhaparth5/coraza-waf-mod";

export const primaryButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-pastel-green-700 px-6 py-3 text-sm font-bold text-white no-underline transition duration-200 hover:bg-pastel-green-800 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pastel-green-600 dark:bg-pastel-green-300 dark:text-pastel-green-950 dark:hover:bg-pastel-green-200";

export const secondaryButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-pastel-green-800/20 bg-white/70 px-6 py-3 text-sm font-bold text-pastel-green-950 no-underline backdrop-blur-sm transition duration-200 hover:border-pastel-green-700/35 hover:bg-white active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pastel-green-600 dark:border-pastel-green-200/20 dark:bg-pastel-green-950/50 dark:text-pastel-green-50 dark:hover:bg-pastel-green-900/70";

export const stats = [
  { value: "1", unit: "binary", label: "No external runtime services" },
  { value: "0", unit: "CGO", label: "Pure Go build" },
  { value: "1", unit: "SQLite file", label: "All state in one portable file" },
  {
    value: "4.x",
    unit: "OWASP CRS",
    label: "Rule set compiled into the binary",
  },
];

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

export const securityChecklist: { title: string; detail: string }[] = [
  {
    title: "Threat score & adaptive enforcement",
    detail:
      "A composite 0–100 per-IP risk score blends autoban, bot, ASN, geo, and JA4 signals, and can scale rate limits or force a challenge for high-risk clients.",
  },
  {
    title: "Automatic IP banning",
    detail:
      "A sliding-window score bans repeat offenders on its own, instead of needing a manual rule for every abusive IP.",
  },
  {
    title: "Bot & JA4 fingerprinting",
    detail:
      "A JS proof-of-work challenge plus TLS JA4 fingerprint history tells scripted clients apart from real browsers.",
  },
  {
    title: "Suggested exceptions",
    detail:
      "Feedback on blocked and allowed requests trains rule-exception suggestions, instead of tuning the WAF blind.",
  },
  {
    title: "Passkeys & single-session login",
    detail:
      "WebAuthn passkeys and one live admin session at a time. Signing in on a new device signs the previous one out.",
  },
  {
    title: "Scoped API keys",
    detail:
      "Issue read-only keys for integrations that only pull data, kept separate from full-access keys.",
  },
  {
    title: "JSON schema validation",
    detail:
      "Enforce a JSON Schema per service in log-only or blocking mode before a request body reaches your backend.",
  },
  {
    title: "Request body limits",
    detail:
      "Content-Type-aware size caps, with a per-service toggle for larger JS and asset uploads.",
  },
  {
    title: "Threat intel webhooks & trusted proxies",
    detail:
      "Push block and challenge events to your own webhook, and trust the right proxy chain for real client IPs behind Cloudflare or Varnish.",
  },
  {
    title: "Log retention & export",
    detail:
      "Prune or export request logs on a schedule instead of letting the database grow forever.",
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
