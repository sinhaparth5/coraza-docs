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
      { label: "GitHub", href: GITHUB_URL, external: true },
    ],
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
