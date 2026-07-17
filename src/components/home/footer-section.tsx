import Link from "next/link";
import { BlurBlob, DotGrid } from "@/components/decorative-shapes";
import { GithubIcon } from "@/components/icons";
import { appName } from "@/lib/shared";
import { footerLinks, GITHUB_URL } from "./constants";

export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[color-mix(in_oklch,var(--color-pixie-green-950)_45%,black)]">
      <BlurBlob className="-bottom-40 -left-24 size-[30rem] bg-sinbad-500/15" />
      <DotGrid className="inset-0 text-white/[0.035]" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="text-lg font-extrabold text-white">{appName}</p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              WAF, reverse proxy, and admin dashboard in a single Go binary. No
              Docker, no external database.
            </p>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-bold text-white no-underline transition duration-200 hover:border-white/30 hover:bg-white/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pixie-green-300"
            >
              <GithubIcon aria-hidden="true" className="size-4" size={16} />
              Star on GitHub
            </Link>
          </div>

          {footerLinks.map((group) => (
            <div key={group.heading}>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-pixie-green-300">
                {group.heading}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer" : undefined}
                      className="text-sm text-white/60 no-underline transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {appName}. Apache 2.0 licensed, built on Coraza v3 and
            OWASP CRS.
          </p>
          <Link
            href="#top"
            className="text-white/45 no-underline transition-colors duration-200 hover:text-white/80"
          >
            Back to top
          </Link>
        </div>
      </div>
    </footer>
  );
}
