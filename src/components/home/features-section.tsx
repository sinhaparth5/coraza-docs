import { Activity, LayoutDashboard, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { EarthIcon, RouteIcon, ShieldCheckIcon } from "@/components/icons";
import { OrganicCluster } from "./organic-cluster";

type FeatureItem = {
  title: string;
  description: string;
  icon: ReactNode;
};

const features: FeatureItem[] = [
  {
    title: "WAF inspection",
    description:
      "Coraza v3 and the OWASP Core Rule Set inspect requests for SQLi, XSS, RCE, path traversal, and known scanner agents.",
    icon: <ShieldCheckIcon aria-hidden="true" className="size-6" size={24} />,
  },
  {
    title: "Reverse proxy",
    description:
      "Route by Host header or path prefix to any number of backends, with automatic prefix stripping like nginx.",
    icon: <RouteIcon aria-hidden="true" className="size-6" size={24} />,
  },
  {
    title: "IP and geo blocking",
    description:
      "Create IP rules or block by country with the bundled GeoIP2 database. Trusted-proxy settings resolve client IPs behind Cloudflare.",
    icon: <EarthIcon aria-hidden="true" className="size-6" size={24} />,
  },
  {
    title: "TLS per service",
    description:
      "Use Let's Encrypt or upload a certificate for each service. Certificate changes do not require a restart.",
    icon: (
      <LockKeyhole aria-hidden="true" className="size-6" strokeWidth={1.8} />
    ),
  },
  {
    title: "Admin dashboard",
    description:
      "View traffic charts, filter request logs, and manage services through the HTMX dashboard. Saved changes hot-reload the affected subsystem.",
    icon: (
      <LayoutDashboard
        aria-hidden="true"
        className="size-6"
        strokeWidth={1.8}
      />
    ),
  },
  {
    title: "Prometheus metrics",
    description:
      "Scrape request volume, Go runtime metrics, and block counters for IP, geo, WAF, bot, and rate-limit decisions.",
    icon: <Activity aria-hidden="true" className="size-6" strokeWidth={1.8} />,
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pastel-green-50 to-white px-5 py-20 sm:px-8 lg:py-24 dark:from-pastel-green-950 dark:to-[#0b3508]">
      <OrganicCluster position="right" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-pastel-green-950 sm:text-4xl dark:text-pastel-green-50">
            Security and routing in one process
          </h2>
          <p className="mt-4 text-pretty text-base leading-7 text-pastel-green-900/70 sm:text-lg dark:text-pastel-green-100/70">
            Add backends from the dashboard, then apply WAF rules, rate limits,
            TLS, and IP controls without editing configuration files.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-pastel-green-700/15 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-pastel-green-500/40 hover:shadow-[0_18px_45px_rgba(8,45,6,0.1)] dark:border-pastel-green-300/10 dark:bg-pastel-green-900/35"
            >
              <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-pastel-green-400 to-pastel-green-700 transition-transform duration-200 group-hover:scale-x-100" />
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-pastel-green-100 to-pastel-green-200 text-pastel-green-700 dark:from-pastel-green-800 dark:to-pastel-green-900 dark:text-pastel-green-200">
                {icon}
              </div>
              <h3 className="text-lg font-bold text-pastel-green-950 dark:text-pastel-green-50">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-pastel-green-900/65 dark:text-pastel-green-100/65">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
