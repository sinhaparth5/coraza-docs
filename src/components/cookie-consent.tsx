"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONSENT_CHANGED_EVENT,
  type ConsentValue,
  clearConsent,
  getConsent,
  loadAnalytics,
  setConsent,
} from "@/lib/consent";

function useConsent(): { consent: ConsentValue; mounted: boolean } {
  const [consent, setConsentState] = useState<ConsentValue>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = getConsent();
    setConsentState(current);
    setMounted(true);
    if (current === "all") loadAnalytics();

    const onChange = (event: Event) => {
      const value = (event as CustomEvent<ConsentValue>).detail;
      setConsentState(value);
      if (value === "all") loadAnalytics();
    };
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  }, []);

  return { consent, mounted };
}

const buttonBase =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const buttonInk = `${buttonBase} bg-ink text-paper shadow-[3px_3px_0_var(--color-highlight)] hover:-translate-y-px hover:shadow-[4px_4px_0_var(--color-highlight)] active:translate-y-0 active:shadow-[1px_1px_0_var(--color-highlight)]`;
const buttonOutline = `${buttonBase} border border-ink/30 text-ink hover:border-ink hover:bg-paper-2`;

export function CookieConsentBanner() {
  const { consent, mounted } = useConsent();

  if (!mounted || consent !== null) return null;

  return (
    <section
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-50 sm:left-auto sm:right-6 sm:w-[23rem]"
    >
      {/* A note taped to the corner of the page. */}
      <span
        aria-hidden="true"
        className="absolute -top-3 right-10 z-10 h-6 w-20 rotate-6 bg-highlight/70"
      />
      <div className="paper-grain rotate-[0.6deg] rounded-md border border-rule bg-paper p-5 text-ink shadow-[0_18px_40px_-20px_rgba(0,0,0,0.45)]">
        <p className="font-hand text-2xl leading-none">
          a quick note on cookies
        </p>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          One essential cookie remembers this choice. Google Analytics cookies
          are set only if you agree, to see which docs people read.{" "}
          <Link
            href="/privacy"
            className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink"
          >
            Details
          </Link>
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setConsent("essential")}
            className={buttonOutline}
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => setConsent("all")}
            className={buttonInk}
          >
            Accept all
          </button>
        </div>
      </div>
    </section>
  );
}

const consentLabels: Record<Exclude<ConsentValue, null>, string> = {
  all: "All cookies accepted — analytics is enabled.",
  essential: "Essential cookies only — analytics is disabled.",
};

export function CookieConsentPreferences() {
  const { consent, mounted } = useConsent();

  return (
    <div className="rounded-md border border-rule bg-paper-2 p-5 text-ink">
      <p className="font-hand text-2xl leading-none">your current choice</p>
      <p className="mt-3 text-sm leading-6 text-ink-soft">
        {!mounted
          ? "Loading your preference…"
          : consent === null
            ? "You have not made a choice yet — the consent banner is shown."
            : consentLabels[consent]}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setConsent("all")}
          className={buttonInk}
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => setConsent("essential")}
          className={buttonOutline}
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => clearConsent()}
          className={`${buttonOutline} text-ink-soft`}
        >
          Reset choice
        </button>
      </div>
      {mounted && consent === "all" && (
        <p className="mt-3 text-xs leading-5 text-ink-soft">
          Note: switching to “Essential only” stops new analytics scripts from
          loading, but scripts already loaded on this page stay active until you
          reload.
        </p>
      )}
    </div>
  );
}
