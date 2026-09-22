import { ConcentricRings } from "@/components/decorative-shapes";
import { CheckIcon } from "@/components/icons";
import { noDepsChips } from "./constants";

const CURL_EXAMPLE = `curl -X POST https://your-host/admin/api/v1/services \\
  -H "Authorization: Bearer cwaf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"api","match_type":"prefix","match_value":"/api","backend":"http://127.0.0.1:9000"}'`;

export function SelfContainedSection() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 lg:py-24 dark:bg-pastel-green-900">
      <ConcentricRings position="-right-32 top-1/2 -translate-y-1/2" />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-pixie-green-700 dark:text-pixie-green-300">
            No dashboard required, either
          </p>
          <h2 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-pastel-green-950 sm:text-4xl dark:text-pastel-green-50">
            One call adds a route, WAF included
          </h2>
          <p className="mt-4 text-pretty text-base leading-7 text-pastel-green-900/70 sm:text-lg dark:text-pastel-green-100/70">
            A bearer-token REST API covers services, IP rules, and bans for
            scripting and CI. Every service it creates, whether through the API
            or the dashboard, inherits WAF inspection, rate limiting, and TLS
            automatically. There's no{" "}
            <code className="font-mono">config.yaml</code> to template out:
            bootstrap flags plus this API cover the whole surface.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-[#0b1210] shadow-[0_25px_65px_-25px_rgba(0,0,0,0.55)] dark:border-white/10">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
            </div>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.75rem] leading-6 text-pastel-green-100/90 sm:text-[0.8125rem]">
              <code>
                <span className="select-none text-pastel-green-400">$ </span>
                {CURL_EXAMPLE}
              </code>
            </pre>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-pastel-green-700/15 bg-pastel-green-50 p-6 shadow-sm sm:p-8 dark:border-pastel-green-200/10 dark:bg-pastel-green-950/40">
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.16em] text-pixie-green-700 dark:text-pixie-green-300">
            No moving parts
          </p>
          <ul className="space-y-4">
            {noDepsChips.map((chip) => (
              <li key={chip} className="flex gap-3.5">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-pixie-green-100 text-pixie-green-700 dark:bg-pixie-green-900/50 dark:text-pixie-green-200">
                  <CheckIcon
                    aria-hidden="true"
                    className="size-3.5"
                    size={14}
                  />
                </span>
                <span className="text-sm leading-6 text-pastel-green-900/80 dark:text-pastel-green-100/80">
                  {chip}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
