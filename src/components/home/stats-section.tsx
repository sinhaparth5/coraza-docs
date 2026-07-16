import { stats } from "./constants";

export function StatsSection() {
  return (
    <section className="border-y border-pastel-green-700/10 bg-white px-5 py-14 dark:bg-pastel-green-950">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-8">
        {stats.map((stat) => (
          <div
            key={stat.unit}
            className="border-l-2 border-pastel-green-200 pl-4 dark:border-pastel-green-700"
          >
            <div
              className="mb-3 h-1 w-9 rounded-full bg-gradient-to-r from-pastel-green-400 to-pastel-green-700"
              aria-hidden="true"
            />
            <p className="text-3xl font-extrabold tabular-nums tracking-tight text-pastel-green-950 dark:text-pastel-green-50">
              {stat.value}{" "}
              <span className="text-base font-semibold text-pastel-green-700 dark:text-pastel-green-300">
                {stat.unit}
              </span>
            </p>
            <p className="mt-2 text-sm leading-5 text-pastel-green-900/65 dark:text-pastel-green-100/65">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
