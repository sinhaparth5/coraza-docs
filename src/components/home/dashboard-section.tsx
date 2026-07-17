import Image from "next/image";
import { BlurBlob, DotGrid } from "@/components/decorative-shapes";
import dashboardImage from "@/static/img/hero_image.png";

export function DashboardSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[color-mix(in_oklch,var(--color-sinbad-950)_55%,black)] px-5 py-20 text-center sm:px-8 lg:py-24">
      <BlurBlob className="-left-40 top-[-12rem] size-[36rem] bg-sinbad-500/20" />
      <BlurBlob className="-right-32 bottom-[-16rem] size-[34rem] bg-pixie-green-500/15" />
      <DotGrid className="inset-0 text-white/[0.04]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-pixie-green-300">
          Admin dashboard
        </p>
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
          Watch every request decision as it happens
        </h2>
        <p className="mx-auto mb-10 mt-4 max-w-xl text-pretty text-base leading-7 text-white/65 sm:text-lg">
          Filter request decisions by status, app, or date. The live view
          streams new traffic as it arrives — no separate log aggregator to run.
        </p>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-[0_35px_90px_-25px_rgba(0,0,0,0.75)] ring-1 ring-pixie-green-300/15">
          <Image
            src={dashboardImage}
            alt="Coraza WAF Mod admin dashboard with live traffic charts, a request log, and threat summaries"
            sizes="(max-width: 1280px) 92vw, 1152px"
            quality={88}
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
