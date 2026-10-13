import Image from "next/image";
import Link from "next/link";
import { GithubIcon } from "@/components/icons";
import { appName } from "@/lib/shared";
import logo from "@/static/img/logo.svg";
import { eyebrow, footerLinks, GITHUB_URL, secondaryButton } from "./constants";

export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-5 pt-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="flex items-center gap-3 font-display text-2xl text-ink">
              <Image src={logo} alt="" width={36} height={36} unoptimized />
              {appName}
            </p>
            <p className="mt-3 leading-7 text-ink-soft">
              WAF, reverse proxy and admin dashboard in a single Go binary.
            </p>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className={`mt-5 gap-2 ${secondaryButton}`}
            >
              <GithubIcon aria-hidden="true" className="size-4" size={16} />
              Star on GitHub
            </Link>
          </div>

          {footerLinks.map((group) => (
            <div key={group.heading}>
              <p className={eyebrow}>{group.heading}</p>
              <ul className="mt-4 flex flex-col gap-1">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer" : undefined}
                      className="inline-flex min-h-9 items-center text-sm text-ink-soft no-underline transition-colors duration-200 hover:text-ink hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-rule pt-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl space-y-1">
            <p>
              &copy; {year} {appName}. Apache 2.0, built on Coraza v3 and OWASP
              CRS.
            </p>
            <p className="text-xs leading-5">
              {appName} is an independent, free and open-source project built on{" "}
              <Link
                href="https://github.com/corazawaf/coraza"
                target="_blank"
                rel="noreferrer"
                className="text-ink-soft underline underline-offset-2 hover:text-ink"
              >
                OWASP Coraza
              </Link>
              . It is not affiliated with or endorsed by OWASP or the Coraza
              project.
            </p>
          </div>
          <p className="font-hand text-xl">
            made by{" "}
            <Link
              href="https://parthsinha.com"
              target="_blank"
              rel="noreferrer"
              className="text-ink underline decoration-accent decoration-2 underline-offset-4"
            >
              Parth Sinha
            </Link>
            {" · "}
            <Link
              href="#top"
              className="text-ink-soft no-underline hover:text-ink"
            >
              back to top ↑
            </Link>
          </p>
        </div>
      </div>

      {/* Oversized wordmark, sized so the full name fits the container. */}
      <div
        aria-hidden="true"
        className="mx-auto mt-14 flex max-w-6xl select-none items-center justify-center gap-[0.2em] pb-12 font-display leading-none text-ink"
        style={{ fontSize: "clamp(2.75rem, 13vw, 11rem)" }}
      >
        <Image
          src={logo}
          alt=""
          unoptimized
          className="h-[0.95em] w-auto shrink-0 rotate-[-4deg]"
        />
        <span className="whitespace-nowrap tracking-[-0.02em]">
          <span className="highlight">Palisade</span>
        </span>
      </div>
    </footer>
  );
}
