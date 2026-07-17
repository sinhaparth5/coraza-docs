import type { ReactNode } from "react";
import { DiagonalStripes } from "@/components/decorative-shapes";
import {
  ActivityIcon,
  EarthIcon,
  LayoutDashboardIcon,
  LockKeyholeIcon,
  RouteIcon,
  ShieldCheckIcon,
} from "@/components/icons";

type FeatureItem = {
  title: string;
  description: string;
  icon: ReactNode;
  span: string;
  flagship?: boolean;
};

const features: FeatureItem[] = [
  {
    title: "WAF inspection",
    description:
      "Coraza v3 and the OWASP Core Rule Set inspect requests for SQLi, XSS, RCE, path traversal, and known scanner agents — the same pipeline stage every request runs through before it reaches your backend.",
    icon: <ShieldCheckIcon aria-hidden="true" className="size-7" size={28} />,
    span: "lg:col-span-2 lg:row-span-2",
    flagship: true,
  },
  {
    title: "Reverse proxy",
    description:
      "Route by Host header or path prefix to any number of backends, with automatic prefix stripping like nginx.",
    icon: <RouteIcon aria-hidden="true" className="size-6" size={24} />,
    span: "lg:col-span-2",
  },
  {
    title: "IP and geo blocking",
    description:
      "Block by country with the bundled GeoIP2 database, or create IP rules directly.",
    icon: <EarthIcon aria-hidden="true" className="size-6" size={24} />,
    span: "lg:col-span-1",
  },
  {
    title: "TLS per service",
    description:
      "Use Let's Encrypt or upload a certificate per service. Changes never require a restart.",
    icon: <LockKeyholeIcon aria-hidden="true" className="size-6" size={24} />,
    span: "lg:col-span-1",
  },
  {
    title: "Admin dashboard",
    description:
      "View traffic charts, filter request logs, and manage services through the HTMX dashboard. Saved changes hot-reload the affected subsystem.",
    icon: (
      <LayoutDashboardIcon aria-hidden="true" className="size-6" size={24} />
    ),
    span: "lg:col-span-2",
  },
  {
    title: "Prometheus metrics",
    description:
      "Scrape request volume, Go runtime metrics, and block counters for IP, geo, WAF, bot, and rate-limit decisions.",
    icon: <ActivityIcon aria-hidden="true" className="size-6" size={24} />,
    span: "lg:col-span-2",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-pastel-green-50 px-5 py-20 sm:px-8 lg:py-24 dark:from-pastel-green-900 dark:to-pastel-green-950">
      <DiagonalStripes className="-right-10 top-0 hidden h-64 w-64 text-pastel-green-700/[0.06] sm:block dark:text-pastel-green-200/[0.05]" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-pixie-green-700 dark:text-pixie-green-300">
            Everything in one process
          </p>
          <h2 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-pastel-green-950 sm:text-4xl dark:text-pastel-green-50">
            Security and routing, without the sprawl
          </h2>
          <p className="mt-4 text-pretty text-base leading-7 text-pastel-green-900/70 sm:text-lg dark:text-pastel-green-100/70">
            Add backends from the dashboard, then apply WAF rules, rate limits,
            TLS, and IP controls without editing configuration files.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-flow-row-dense lg:grid-cols-4">
          {features.map(({ title, description, icon, span, flagship }) => (
            <article
              key={title}
              className={`group relative overflow-hidden border border-pastel-green-700/15 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-pastel-green-500/40 dark:border-pastel-green-300/10 dark:bg-pastel-green-900/35 ${span} ${
                flagship
                  ? "flex flex-col justify-between rounded-3xl p-8 shadow-sm hover:shadow-[0_22px_55px_rgba(16,34,18,0.12)]"
                  : "rounded-2xl p-6 shadow-sm hover:shadow-[0_14px_35px_rgba(16,34,18,0.1)]"
              }`}
            >
              <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-pastel-green-400 to-pastel-green-700 transition-transform duration-200 group-hover:scale-x-100" />
              <div>
                <div
                  className={`mb-5 flex items-center justify-center rounded-xl bg-gradient-to-br from-pastel-green-100 to-pastel-green-200 text-pastel-green-700 dark:from-pastel-green-800 dark:to-pastel-green-900 dark:text-pastel-green-200 ${
                    flagship ? "size-14" : "size-12"
                  }`}
                >
                  {icon}
                </div>
                <h3
                  className={`font-bold text-pastel-green-950 dark:text-pastel-green-50 ${
                    flagship ? "text-2xl" : "text-lg"
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`mt-2 leading-6 text-pastel-green-900/65 dark:text-pastel-green-100/65 ${
                    flagship ? "text-base" : "text-sm"
                  }`}
                >
                  {description}
                </p>
              </div>
              {flagship ? (
                <span className="mt-6 inline-flex w-fit items-center rounded-full bg-pixie-green-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-pixie-green-800 dark:bg-pixie-green-900/50 dark:text-pixie-green-200">
                  Core pipeline stage
                </span>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
