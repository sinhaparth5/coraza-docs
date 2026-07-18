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
  "inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-bold transition duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pixie-green-500";

export function CookieConsentBanner() {
  const { consent, mounted } = useConsent();

  if (!mounted || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto max-w-2xl rounded-xl border border-fd-border bg-fd-popover p-5 text-fd-popover-foreground shadow-xl">
        <p className="text-sm font-bold">Cookies on this site</p>
        <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
          We use an essential cookie to remember this choice, and — only if you
          agree — Google Analytics cookies to understand how the docs are used.
          See our{" "}
          <Link
            href="/privacy"
            className="font-medium text-pixie-green-600 underline underline-offset-2 hover:text-pixie-green-700"
          >
            privacy &amp; cookie policy
          </Link>{" "}
          for details.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setConsent("all")}
            className={`${buttonBase} bg-pixie-green-600 text-white hover:bg-pixie-green-700`}
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => setConsent("essential")}
            className={`${buttonBase} border border-fd-border bg-transparent hover:bg-fd-muted`}
          >
            Essential only
          </button>
        </div>
      </div>
    </div>
  );
}

const consentLabels: Record<Exclude<ConsentValue, null>, string> = {
  all: "All cookies accepted — analytics is enabled.",
  essential: "Essential cookies only — analytics is disabled.",
};

export function CookieConsentPreferences() {
  const { consent, mounted } = useConsent();

  return (
    <div className="rounded-xl border border-fd-border bg-fd-card p-5">
      <p className="text-sm font-bold">Your current choice</p>
      <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
        {!mounted
          ? "Loading your preference…"
          : consent === null
            ? "You have not made a choice yet — the consent banner is shown."
            : consentLabels[consent]}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => setConsent("all")}
          className={`${buttonBase} bg-pixie-green-600 text-white hover:bg-pixie-green-700`}
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => setConsent("essential")}
          className={`${buttonBase} border border-fd-border bg-transparent hover:bg-fd-muted`}
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => clearConsent()}
          className={`${buttonBase} border border-fd-border bg-transparent text-fd-muted-foreground hover:bg-fd-muted`}
        >
          Reset choice
        </button>
      </div>
      {mounted && consent === "all" && (
        <p className="mt-3 text-xs leading-5 text-fd-muted-foreground">
          Note: switching to “Essential only” stops new analytics scripts from
          loading, but scripts already loaded on this page stay active until you
          reload.
        </p>
      )}
    </div>
  );
}
