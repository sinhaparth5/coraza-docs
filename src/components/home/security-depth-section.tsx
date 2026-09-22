import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { securityChecklist } from "./constants";

export function SecurityDepthSection() {
  return (
    <section className="relative overflow-hidden bg-pastel-green-50 px-5 py-20 sm:px-8 lg:py-24 dark:bg-pastel-green-950">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-pixie-green-700 dark:text-pixie-green-300">
              Beyond block or allow
            </p>
            <h2 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-pastel-green-950 sm:text-4xl dark:text-pastel-green-50">
              Ten more decisions the proxy already makes for you
            </h2>
            <p className="mt-4 text-pretty text-base leading-7 text-pastel-green-900/70 sm:text-lg dark:text-pastel-green-100/70">
              Past the core WAF pipeline, every request and every admin session
              runs through this, and none of it needs a sidecar or a second
              service.
            </p>
          </div>
          <Link
            href="/docs/security/waf"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-pastel-green-700 no-underline hover:text-pastel-green-800 dark:text-pastel-green-300 dark:hover:text-pastel-green-200"
          >
            Read the security docs
            <ArrowRightIcon aria-hidden="true" size={14} />
          </Link>
        </div>

        <div className="grid gap-x-8 rounded-2xl border border-pastel-green-700/15 bg-white/70 px-6 shadow-sm sm:grid-cols-2 dark:border-pastel-green-200/10 dark:bg-pastel-green-900/30">
          {[securityChecklist.slice(0, 5), securityChecklist.slice(5)].map(
            (column, columnIndex) => (
              <dl
                // biome-ignore lint/suspicious/noArrayIndexKey: two fixed columns, order never changes
                key={columnIndex}
                className="divide-y divide-pastel-green-700/10 dark:divide-pastel-green-200/10"
              >
                {column.map(({ title, detail }) => (
                  <div key={title} className="flex gap-3.5 py-6">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-pixie-green-100 text-pixie-green-700 dark:bg-pixie-green-900/50 dark:text-pixie-green-200">
                      <CheckIcon
                        aria-hidden="true"
                        className="size-3.5"
                        size={14}
                      />
                    </span>
                    <div>
                      <dt className="text-sm font-bold text-pastel-green-950 dark:text-pastel-green-50">
                        {title}
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-pastel-green-900/65 dark:text-pastel-green-100/65">
                        {detail}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
