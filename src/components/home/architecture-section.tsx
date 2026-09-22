import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import archDiagram from "@/static/img/arch_diagram_white-bg.png";
import { PipelineFlow } from "./pipeline-flow";

export function ArchitectureSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--color-sinbad-100),var(--color-pixie-green-100)_55%,white)] px-5 py-20 sm:px-8 lg:py-24 dark:bg-[linear-gradient(135deg,color-mix(in_oklch,var(--color-sinbad-950)_88%,black),color-mix(in_oklch,var(--color-pixie-green-950)_78%,black)_60%,var(--color-sinbad-900))]">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 hidden text-pixie-green-700/15 sm:block dark:text-pixie-green-200/10"
        fill="none"
        height="420"
        viewBox="0 0 420 420"
        width="420"
      >
        <circle cx="210" cy="210" r="209" stroke="currentColor" />
        <circle cx="210" cy="210" r="150" stroke="currentColor" />
        <circle cx="210" cy="210" r="90" stroke="currentColor" />
      </svg>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-pastel-green-700 dark:text-pastel-green-300">
            Request pipeline
          </p>
          <h2 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-pastel-green-950 sm:text-4xl dark:text-pastel-green-50">
            Every request runs the same gauntlet, in the same process
          </h2>
          <p className="mt-4 text-pretty text-base leading-7 text-pastel-green-900/70 sm:text-lg dark:text-pastel-green-100/70">
            Bot detection, rate limiting, geo policy, WAF inspection, and
            routing execute as one strict sequence inside a single Go binary,
            with no sidecars, no service mesh, and no extra network hop between
            checks.
          </p>
        </div>

        <PipelineFlow />

        <div className="mt-12">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-pastel-green-950">
              The full request path, end to end
            </p>
            <Link
              href="/docs/overview/architecture"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-pastel-green-700 no-underline hover:text-pastel-green-800"
            >
              Read the architecture docs
              <ArrowRightIcon aria-hidden="true" size={14} />
            </Link>
          </div>
          <Image
            src={archDiagram}
            alt="Coraza WAF Mod request architecture from the client through Cloudflare and OS firewall to the WAF proxy, SQLite, dashboard, and backend"
            sizes="(max-width: 1280px) 92vw, 1152px"
            quality={88}
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
