import Link from "next/link";
import { getLatestRelease } from "@/lib/release";
import {
  eyebrow,
  GITHUB_URL,
  primaryButton,
  secondaryButton,
} from "./constants";
import { CopyableCommand } from "./copyable-command";
import { DimensionLine, Rosette } from "./ornaments";
import { RequestStream } from "./request-stream";
import { Scribble } from "./scribbles";

export async function HeroSection() {
  const release = await getLatestRelease();

  return (
    <section
      id="top"
      className="relative overflow-x-clip border-b border-rule px-5 pb-16 pt-14 sm:px-8 lg:pb-24 lg:pt-20"
    >
      {/* Notebook margin rule. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-3 hidden w-px bg-stamp/30 sm:block lg:left-8"
      />

      {/* Engraved guilloche seal, peeking out behind the figure. */}
      <Rosette className="parallax pointer-events-none absolute -right-40 -top-28 size-[36rem] text-ink opacity-[0.09] [--parallax:4rem] lg:-right-24 lg:[--parallax:6rem]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div>
          {release ? (
            <Link
              href={release.url}
              target="_blank"
              rel="noreferrer"
              className="mb-5 inline-flex min-h-9 items-center gap-2 rounded-full border border-rule bg-paper-2 px-3 font-mono text-xs text-ink-soft no-underline transition-colors duration-200 hover:border-ink hover:text-ink"
            >
              <Rosette size="small" className="size-4 text-ink-soft" />
              latest release {release.tag}
              {release.date ? (
                <span className="hidden sm:inline">
                  {" · "}
                  {new Date(release.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              ) : null}
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
          <p className={eyebrow}>
            Palisade · built on OWASP Coraza · Apache 2.0
          </p>
          <h1 className="mt-5 text-balance text-[2.6rem] leading-[1.05] tracking-[-0.01em] text-ink sm:text-6xl">
            A web application firewall you can{" "}
            <span className="highlight">scp</span> to a server.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-ink-soft">
            Coraza v3, the OWASP Core Rule Set, a reverse proxy, TLS and an
            admin dashboard, compiled into one Go binary. No Docker. No database
            server. A file and a systemd unit.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/docs" className={primaryButton}>
              Read the docs
            </Link>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className={secondaryButton}
            >
              View on GitHub
            </Link>
          </div>

          <div className="relative mt-8 max-w-xl">
            <p className="mb-2 font-hand text-xl text-ink-soft">
              or install it in one line
              <Scribble
                kind="arrow-down"
                className="ml-2 inline-block h-6 w-8 text-ink-soft"
              />
            </p>
            <CopyableCommand
              light
              display="curl -fsSL …/install.sh | sudo bash"
              command="curl -fsSL https://waf-install.astrareconslabs.com/palisade-waf/install.sh | sudo bash"
            />
            <DimensionLine label="one line · one binary" className="mt-3" />
          </div>
        </div>

        <div className="parallax crop-marks rounded-lg border border-rule bg-paper-2/70 p-4 sm:p-6 lg:[--parallax:-1.5rem]">
          <RequestStream />
          <p className="sr-only">
            Illustration: a stream of HTTP requests moves toward the firewall.
            Normal requests pass through to the backend, while SQL injection,
            XSS and path traversal attempts are blocked with a 403.
          </p>
        </div>
      </div>
    </section>
  );
}
