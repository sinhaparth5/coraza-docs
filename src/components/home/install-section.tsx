import Link from "next/link";
import {
  databaseDrivers,
  eyebrow,
  GITHUB_URL,
  primaryButton,
  secondaryButton,
} from "./constants";
import { CopyableCommand } from "./copyable-command";

export function InstallSection() {
  return (
    <section className="border-b border-rule bg-paper-2/60 px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <p className={eyebrow}>Install</p>
        <h2 className="mt-4 text-balance text-4xl leading-tight text-ink">
          One command on a fresh Linux box.
        </h2>
        <p className="mt-4 text-pretty leading-7 text-ink-soft">
          The installer detects your architecture, verifies the SHA-256
          checksum, creates a non-root system user with{" "}
          <code className="font-mono text-[0.9em] text-ink">
            CAP_NET_BIND_SERVICE
          </code>{" "}
          and registers three systemd units.
        </p>

        <div className="mt-8">
          <CopyableCommand
            light
            display="curl -fsSL …/install.sh | sudo bash"
            command="curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | sudo bash"
          />
        </div>

        <dl className="mt-8 grid gap-6 border-t border-dashed border-rule pt-6 sm:grid-cols-2">
          <div>
            <dt className={eyebrow}>From source</dt>
            <dd className="mt-2 leading-7 text-ink-soft">
              <code className="font-mono text-[0.9em] text-ink">git clone</code>{" "}
              then{" "}
              <code className="font-mono text-[0.9em] text-ink">
                make build
              </code>
              . Go 1.27+, no CGO.
            </dd>
          </div>
          <div>
            <dt className={eyebrow}>Storage</dt>
            <dd className="mt-2 leading-7 text-ink-soft">
              SQLite by default, or{" "}
              {databaseDrivers
                .slice(1)
                .join(", ")
                .replace(/, ([^,]*)$/, " or $1")}
              .
            </dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/docs/installation/install" className={primaryButton}>
            Installation guide
          </Link>
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={secondaryButton}
          >
            View source
          </Link>
        </div>
      </div>
    </section>
  );
}
