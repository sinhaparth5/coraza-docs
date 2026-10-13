import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { eyebrow, faqItems } from "./constants";

export function FaqSection() {
  return (
    <section className="border-b border-rule px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <p className={eyebrow}>Questions</p>
        <h2 className="mt-4 text-balance text-4xl leading-tight text-ink">
          What people ask before installing.
        </h2>

        <div className="mt-10 border-t border-rule">
          {faqItems.map(({ question, answer }) => (
            <details key={question} className="group border-b border-rule">
              <summary className="flex min-h-11 cursor-pointer list-none items-baseline gap-4 py-5 text-left text-lg text-ink marker:content-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                <span
                  aria-hidden="true"
                  className="font-mono text-sm text-accent"
                >
                  Q.
                </span>
                <span className="flex-1 font-semibold">{question}</span>
                <span
                  aria-hidden="true"
                  className="font-mono text-ink-soft transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="flex gap-4 pb-6 text-pretty leading-7 text-ink-soft">
                <span
                  aria-hidden="true"
                  className="font-mono text-sm leading-7 text-stamp"
                >
                  A.
                </span>
                <span>{answer}</span>
              </p>
            </details>
          ))}
        </div>

        <Link
          href="/docs/faq"
          className="mt-8 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent no-underline hover:underline"
        >
          Read the full FAQ
          <ArrowRightIcon aria-hidden="true" size={14} />
        </Link>
      </div>
    </section>
  );
}
