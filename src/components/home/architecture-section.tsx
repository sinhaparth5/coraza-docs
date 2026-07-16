import { ArrowRight } from "lucide-react";
import Image from "next/image";
import archDiagram from "@/static/img/arch_diagram.png";
import { pipeline } from "./constants";

export function ArchitectureSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#092615] px-5 py-20 sm:px-8 lg:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-pastel-green-500/20 blur-[120px]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
            Built for the request path
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-white/70">
            Every request passes through a strict pipeline before reaching any
            backend. Each stage logs asynchronously to a buffered SQLite queue,
            so the hot path is never blocked.
          </p>
          <ul className="mx-auto mt-6 grid max-w-2xl gap-2 text-left sm:grid-cols-2">
            {pipeline.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-6 text-white/65"
              >
                <ArrowRight
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-pastel-green-300"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#071b12] shadow-[0_28px_80px_rgba(0,0,0,0.4)]">
          <Image
            src={archDiagram}
            alt="Coraza WAF request architecture from the client through Cloudflare and OS firewall to the WAF proxy, SQLite, dashboard, and backend"
            sizes="(max-width: 1280px) 92vw, 1152px"
            quality={88}
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
