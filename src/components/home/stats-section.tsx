import { DotGrid } from "@/components/decorative-shapes";
import { stats } from "./constants";

export function StatsSection() {
  return (
    <section className="relative overflow-hidden border-y border-pastel-green-700/10 bg-white px-5 py-14 dark:bg-pastel-green-950">
      <DotGrid className="inset-0 text-pastel-green-700/[0.05] dark:text-pastel-green-200/[0.05]" />
      <div className="relative mx-auto grid max-w-5xl grid-cols-2 divide-y divide-pastel-green-700/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0 dark:divide-pastel-green-200/10">
        {stats.map((stat) => (
          <div
            key={stat.unit}
            className="px-4 py-6 text-center first:pl-0 last:pr-0 sm:py-2"
          >
            <p className="text-4xl font-extrabold tabular-nums tracking-[-0.03em] text-pastel-green-950 sm:text-5xl dark:text-pastel-green-50">
              {stat.value}
            </p>
            <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.14em] text-pixie-green-700 dark:text-pixie-green-300">
              {stat.unit}
            </p>
            <p className="mx-auto mt-2 max-w-[14rem] text-sm leading-5 text-pastel-green-900/65 dark:text-pastel-green-100/65">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
