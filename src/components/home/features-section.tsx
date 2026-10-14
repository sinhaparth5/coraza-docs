import { eyebrow } from "./constants";
import { Scribble } from "./scribbles";

const features = [
  {
    title: "WAF inspection",
    description:
      "Coraza v3 and the OWASP Core Rule Set check every request for SQLi, XSS, RCE, path traversal and known scanners before it reaches your backend.",
  },
  {
    title: "Reverse proxy",
    description:
      "Route by Host header or path prefix to any number of backends, with prefix stripping that works the way nginx does.",
  },
  {
    title: "IP and geo blocking",
    description:
      "Block countries with the bundled GeoIP2 database, or add IP rules directly from the dashboard.",
  },
  {
    title: "TLS per service",
    description:
      "Let's Encrypt or your own certificate, per service. Changing one never needs a restart.",
  },
  {
    title: "Admin dashboard",
    description:
      "Live logs with a GoAccess-style stats view, one-click WAF exceptions, and rule dry-runs. Saving a change hot-reloads only the part it touches.",
  },
  {
    title: "Metrics and analytics",
    description:
      "Prometheus counters for every block decision, health probes for your load balancer, and an optional ClickHouse mirror for a year of history.",
  },
];

const notNeeded = [
  "Docker",
  "a config.yaml",
  "a database server",
  "a MaxMind account",
  "Redis (until you run several nodes)",
];

export function FeaturesSection() {
  return (
    <section className="border-b border-rule px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="features-scope grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className={`section-no ${eyebrow}`}>What's inside the binary</p>
            <h2 className="mt-4 text-balance text-4xl leading-tight text-ink">
              Six jobs, one process.
            </h2>
            <p className="mt-4 text-pretty leading-7 text-ink-soft">
              Each of these usually means another service to run. Here they
              share one process and one SQLite file.
            </p>

            <FeatureTicker className="mt-8 hidden lg:block" />

            <div className="relative mt-10 rotate-[-1deg]">
              <div
                aria-hidden="true"
                className="hatch absolute inset-0 translate-x-2 translate-y-2 rounded-md border border-rule"
              />
              <div className="relative rounded-md border border-rule bg-paper-2 p-5">
                <p className="font-hand text-2xl text-ink">
                  things you won't need
                </p>
                <ul className="mt-3 space-y-1.5">
                  {notNeeded.map((item) => (
                    <li
                      key={item}
                      className="text-ink-soft line-through decoration-stamp/70 decoration-2"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <FeatureTicker className="sticky top-14 z-10 -mx-5 bg-paper/95 px-5 py-3 backdrop-blur-sm sm:-mx-8 sm:px-8 lg:hidden" />
            <ol className="features-list grid gap-x-10 sm:grid-cols-2 lg:grid-cols-1">
              {features.map(({ title, description }, index) => (
                <li
                  key={title}
                  className="feature-card relative border-t border-dashed border-rule py-6 lg:py-10"
                >
                  <span className="font-mono text-sm text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-2xl text-ink">
                    {title}
                    {index === 0 ? (
                      <Scribble
                        kind="underline"
                        className="mt-0.5 block h-2.5 w-40 text-accent"
                      />
                    ) : null}
                  </h3>
                  <p className="mt-2 max-w-xl text-pretty leading-7 text-ink-soft">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

// Scroll companion pinned beside the list: the index, title and rule are
// driven by the list's scroll position in CSS (see .feature-ticker in
// global.css), and the whole ticker is hidden where that is unsupported.
function FeatureTicker({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`feature-ticker ${className}`}>
      <div className="flex items-baseline gap-3 font-mono text-sm text-ink-soft">
        <span className="feature-ticker-count text-accent" />
        <span>/ {String(features.length).padStart(2, "0")}</span>
        <span className="h-6 flex-1 overflow-hidden text-ink">
          <span className="feature-ticker-titles block">
            {features.map(({ title }) => (
              <span key={title} className="block h-6 leading-6">
                {title}
              </span>
            ))}
          </span>
        </span>
      </div>
      <div className="mt-2 h-px bg-rule">
        <div className="feature-ticker-bar h-px origin-left bg-accent" />
      </div>
    </div>
  );
}
