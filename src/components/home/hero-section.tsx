import Image from "next/image";
import Link from "next/link";
import { DotGrid } from "@/components/decorative-shapes";
import gradientImage from "@/static/img/Gradient.png";
import shapeImage from "@/static/img/Shape.png";
import { GITHUB_URL, primaryButton, secondaryButton } from "./constants";

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden border-b border-pastel-green-700/10 bg-pastel-green-50 dark:bg-pastel-green-950"
    >
      <Image
        src={gradientImage}
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        className="-z-20 object-cover opacity-70 dark:opacity-15"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(243,249,243,0.8),rgba(230,242,231,0.2)_55%,rgba(205,230,207,0.4))] dark:bg-[linear-gradient(115deg,rgba(16,34,18,0.95),rgba(39,65,42,0.5))]" />
      <DotGrid className="-right-16 top-0 hidden h-80 w-80 text-pastel-green-700/[0.07] lg:block dark:text-pastel-green-200/[0.06]" />

      <div className="relative mx-auto grid min-h-[46rem] w-full max-w-7xl grid-cols-1 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:px-12 lg:py-20">
        <div className="relative z-10 max-w-2xl lg:col-start-1">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-pastel-green-700/20 bg-pastel-green-100/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-pastel-green-800 dark:border-pastel-green-300/20 dark:bg-pastel-green-900/60 dark:text-pastel-green-200">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-pixie-green-500 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-pixie-green-600 dark:bg-pixie-green-300" />
            </span>
            Open Source WAF
          </span>
          <h1 className="max-w-3xl text-balance text-4xl font-extrabold leading-[1.06] tracking-[-0.04em] text-pastel-green-950 sm:text-5xl lg:text-6xl dark:text-pastel-green-50">
            Coraza WAF Mod: WAF and reverse proxy in a single Go binary
          </h1>
        </div>

        <div className="relative z-0 my-8 w-full lg:absolute lg:left-1/2 lg:top-36 lg:my-0 lg:w-[min(76rem,92vw)] lg:-translate-x-1/2">
          <Image
            src={shapeImage}
            alt=""
            priority
            quality={90}
            sizes="(max-width: 768px) 100vw, 1200px"
            className="h-auto w-full opacity-90 drop-shadow-[0_24px_55px_rgba(53,97,57,0.12)] dark:opacity-25"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-md self-end lg:col-start-2 lg:row-start-2 lg:-mb-11 lg:ml-auto">
          <p className="mb-7 text-pretty text-base leading-7 text-pastel-green-900/75 sm:text-lg dark:text-pastel-green-100/75">
            Run Coraza v3, OWASP CRS, TLS, routing, and an admin dashboard
            without Docker or an external database.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/docs" className={primaryButton}>
              Read the docs
            </Link>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className={secondaryButton}
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
