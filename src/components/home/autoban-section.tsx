import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { AutobanStream } from "./autoban-stream";
import { eyebrow } from "./constants";

const scoring = [
  { event: "Critical WAF block (SQLi, XSS, RCE, LFI)", points: 5 },
  { event: "Other WAF rule block", points: 2 },
  { event: "Rate-limited", points: 1 },
  { event: "Already blocked", points: 0 },
];

export function AutobanSection() {
  return (
    <section className="iso-grid border-b border-rule px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div>
          <p className={`section-no ${eyebrow}`}>Automatic banning</p>
          <h2 className="mt-4 text-balance text-4xl leading-tight text-ink">
            Keep trying and you stop getting answers.
          </h2>
          <p className="mt-4 text-pretty leading-7 text-ink-soft">
            Every block adds to the client IP's score. Cross the threshold
            inside the window and the IP goes on the blocklist, the blocklist
            hot-reloads, and you get an email. Allow rules you added by hand
            always win.
          </p>

          <table className="mt-8 w-full border-collapse text-sm">
            <caption className="sr-only">Points per event</caption>
            <tbody>
              {scoring.map(({ event, points }) => (
                <tr key={event} className="border-t border-dashed border-rule">
                  <th
                    scope="row"
                    className="py-2.5 pr-4 text-left font-normal text-ink-soft"
                  >
                    {event}
                  </th>
                  <td className="tabular py-2.5 text-right font-mono text-ink">
                    +{points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 font-hand text-xl text-ink-soft">
            default: 10 points in 10 minutes, editable live
          </p>

          <Link
            href="/blog/ja4-autoban-email-alerts"
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent no-underline hover:underline"
          >
            How the scoring works
            <ArrowRightIcon aria-hidden="true" size={14} />
          </Link>
        </div>

        <div className="crop-marks rounded-lg border border-rule bg-paper-2/70 p-4 sm:p-6">
          <AutobanStream />
          <p className="sr-only">
            Illustration: one IP sends repeated login attempts and an SQL
            injection probe. Each 429 or 403 raises its score until it reaches
            10, at which point it is written to the IP rules as an automatic
            block, an alert email is sent, and later requests are refused at the
            blocklist. A normal visitor keeps getting through.
          </p>
        </div>
      </div>
    </section>
  );
}
