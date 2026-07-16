import Link from "next/link";
import { GITHUB_URL } from "./constants";
import { CopyableCommand } from "./copyable-command";

export function InstallSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#04120a] px-5 py-20 sm:px-8 lg:py-24">
      <div
        className="pointer-events-none absolute -left-60 bottom-[-20rem] -z-10 size-[42rem] rounded-full bg-pastel-green-700/30 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-48 top-[-18rem] -z-10 size-[40rem] rounded-full bg-pastel-green-400/25 blur-[150px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-12 top-10 -z-10 hidden h-56 w-28 rounded-full bg-gradient-to-b from-pastel-green-300/25 to-pastel-green-700/10 lg:block"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
          Install the service
        </h2>
        <p className="mx-auto mb-8 mt-5 max-w-2xl text-pretty text-base leading-7 text-white/70">
          The installer detects your architecture, verifies the SHA-256
          checksum, creates a dedicated non-root system user with{" "}
          <code className="rounded bg-pastel-green-300/10 px-1.5 py-0.5 font-mono text-sm text-pastel-green-300">
            CAP_NET_BIND_SERVICE
          </code>
          , and registers three systemd units.
        </p>
        <CopyableCommand command="curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | sudo bash" />
        <p className="mb-8 text-sm leading-6 text-white/50">
          Or build from source:{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-white/75">
            git clone
          </code>{" "}
          the repo and run{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-white/75">
            make build
          </code>
          . Requires Go 1.25+, no CGO.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/docs"
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-pastel-green-300 px-6 py-3 text-sm font-bold text-pastel-green-950 no-underline transition duration-200 hover:bg-pastel-green-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pastel-green-200"
          >
            Read the docs
          </Link>
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-white/30 bg-white/5 px-6 py-3 text-sm font-bold text-white no-underline transition duration-200 hover:border-white/50 hover:bg-white/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pastel-green-300"
          >
            View source
          </Link>
        </div>
      </div>
    </section>
  );
}
