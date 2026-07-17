import Image from "next/image";
import Link from "next/link";
import {
  ActivityIcon,
  ArrowRightIcon,
  EarthIcon,
  LockKeyholeIcon,
  RouteIcon,
  ShieldCheckIcon,
} from "@/components/icons";
import archDiagram from "@/static/img/arch_diagram_white-bg.png";
import { pipeline } from "./constants";

const stageIcons = [
  LockKeyholeIcon,
  ActivityIcon,
  EarthIcon,
  ShieldCheckIcon,
  RouteIcon,
];

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
            routing execute as one strict sequence inside a single Go binary —
            no sidecars, no service mesh, no extra network hop between checks.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pipeline.map((item, index) => {
            const StageIcon = stageIcons[index];
            return (
              <li
                key={item.stage}
                className="group rounded-2xl border border-pastel-green-900/10 bg-white/70 p-5 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(16,34,18,0.1)] dark:border-pastel-green-200/10 dark:bg-black/20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tabular-nums text-pixie-green-600 dark:text-pixie-green-300">
                    {item.stage}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full bg-pixie-green-100 text-pixie-green-700 dark:bg-pixie-green-900/40 dark:text-pixie-green-200">
                    <StageIcon aria-hidden="true" size={18} />
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-bold text-pastel-green-950 dark:text-pastel-green-50">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-pastel-green-900/65 dark:text-pastel-green-100/65">
                  {item.detail}
                </p>
              </li>
            );
          })}
        </ol>

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
