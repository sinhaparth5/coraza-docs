import { CheckIcon } from "@/components/icons";

const stackPieces = [
  "Reverse proxy",
  "WAF engine",
  "Rate limiter & IP/geo blocking",
  "TLS termination",
  "Metrics exporter",
  "Admin dashboard",
];

const rotations = [
  "-rotate-2",
  "rotate-1",
  "rotate-2",
  "-rotate-1",
  "rotate-3",
  "-rotate-2",
];

export function StackComparisonSection() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 lg:py-24 dark:bg-pastel-green-900">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-pixie-green-700 dark:text-pixie-green-300">
            The consolidation
          </p>
          <h2 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-pastel-green-950 sm:text-4xl dark:text-pastel-green-50">
            Six moving parts, or one binary
          </h2>
          <p className="mt-4 text-pretty text-base leading-7 text-pastel-green-900/70 sm:text-lg dark:text-pastel-green-100/70">
            The usual way wires a proxy, a WAF, a ban tool, TLS, metrics, and a
            dashboard together as separate services. Coraza WAF Mod runs all six
            as one process.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col justify-between rounded-2xl border border-dashed border-pastel-green-700/25 bg-pastel-green-100/50 p-8 dark:border-pastel-green-200/15 dark:bg-black/15">
            <div>
              <p className="mb-6 text-center text-xs font-extrabold uppercase tracking-[0.16em] text-pastel-green-900/65 dark:text-pastel-green-100/65">
                The usual way
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {stackPieces.map((piece, index) => (
                  <span
                    key={piece}
                    className={`${rotations[index]} rounded-lg border border-pastel-green-900/15 bg-white px-3.5 py-2.5 text-xs font-semibold text-pastel-green-900/80 shadow-sm dark:border-pastel-green-200/10 dark:bg-pastel-green-900/40 dark:text-pastel-green-100/80`}
                  >
                    {piece}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-pastel-green-900/65 dark:text-pastel-green-100/65">
              Separate services, separate configs, separate failure modes.
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-pixie-green-600/25 bg-pixie-green-50 p-8 shadow-[0_25px_60px_-25px_rgba(16,34,18,0.25)] dark:border-pixie-green-400/25 dark:bg-pastel-green-900/50">
            <div>
              <p className="mb-6 text-center text-xs font-extrabold uppercase tracking-[0.16em] text-pixie-green-700 dark:text-pixie-green-300">
                With Coraza WAF Mod
              </p>
              <ul className="space-y-3">
                {stackPieces.map((piece) => (
                  <li
                    key={piece}
                    className="flex items-center gap-3 rounded-lg bg-white px-3.5 py-2.5 shadow-sm dark:bg-pixie-green-950/40"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-pixie-green-600 text-white dark:bg-pixie-green-400 dark:text-pastel-green-950">
                      <CheckIcon
                        aria-hidden="true"
                        size={12}
                        className="size-3"
                      />
                    </span>
                    <span className="text-xs font-semibold text-pastel-green-950 dark:text-pastel-green-50">
                      {piece}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 text-center text-xs font-bold text-pixie-green-700 dark:text-pixie-green-300">
              1 binary. 1 process. 1 thing to deploy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
