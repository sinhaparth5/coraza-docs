import Link from "next/link";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/icons";
import { faqItems } from "./constants";

export function FaqSection() {
  return (
    <section className="relative bg-pastel-green-50 px-5 py-20 sm:px-8 lg:py-24 dark:bg-pastel-green-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-pixie-green-700 dark:text-pixie-green-300">
            Frequently asked
          </p>
          <h2 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-pastel-green-950 sm:text-4xl dark:text-pastel-green-50">
            Questions people actually ask before installing
          </h2>
        </div>

        <div className="divide-y divide-pastel-green-700/15 rounded-2xl border border-pastel-green-700/15 bg-white/70 px-5 sm:px-6 dark:divide-pastel-green-200/10 dark:border-pastel-green-200/10 dark:bg-pastel-green-900/30">
          {faqItems.map(({ question, answer }) => (
            <details key={question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-bold text-pastel-green-950 marker:content-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pastel-green-600 sm:text-base dark:text-pastel-green-50">
                {question}
                <ChevronDownIcon
                  aria-hidden="true"
                  size={18}
                  className="shrink-0 text-pastel-green-700/70 transition-transform duration-200 group-open:rotate-180 dark:text-pastel-green-300/70"
                />
              </summary>
              <p className="mt-3 text-pretty text-sm leading-6 text-pastel-green-900/70 dark:text-pastel-green-100/70">
                {answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/docs/faq"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-pastel-green-700 no-underline hover:text-pastel-green-800 dark:text-pastel-green-300 dark:hover:text-pastel-green-200"
          >
            Read the full FAQ
            <ArrowRightIcon aria-hidden="true" size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
