export const CONSENT_KEY = "cz-cookie-consent";
export const CONSENT_CHANGED_EVENT = "cz-cookie-consent-changed";
export const GTM_ID = "GTM-NPSXB8DG";
export const GA_ID = "G-R8GXDLB8L1";

export type ConsentValue = "all" | "essential" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let analyticsLoaded = false;

function normaliseConsent(value: string | null): ConsentValue {
  if (value === "all" || value === "accepted") return "all";
  if (value === "essential" || value === "rejected") return "essential";
  return null;
}

function getCookieValue(name: string): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie
    ? decodeURIComponent(cookie.split("=").slice(1).join("="))
    : null;
}

function getLegacyLocalStorageConsent(): ConsentValue {
  try {
    return normaliseConsent(localStorage.getItem(CONSENT_KEY));
  } catch {
    return null;
  }
}

function removeLegacyLocalStorageConsent(): void {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    // Ignore browsers that block localStorage access.
  }
}

export function getConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  const cookieConsent = normaliseConsent(getCookieValue(CONSENT_KEY));
  if (cookieConsent !== null) return cookieConsent;

  const oldLocalStorageConsent = getLegacyLocalStorageConsent();
  if (oldLocalStorageConsent !== null) {
    setConsent(oldLocalStorageConsent);
    removeLegacyLocalStorageConsent();
  }

  return oldLocalStorageConsent;
}

export function setConsent(value: Exclude<ConsentValue, null>): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API lacks Safari/Firefox support
  document.cookie = `${CONSENT_KEY}=${encodeURIComponent(
    value,
  )}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  window.dispatchEvent(
    new CustomEvent<ConsentValue>(CONSENT_CHANGED_EVENT, { detail: value }),
  );
}

export function clearConsent(): void {
  // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API lacks Safari/Firefox support
  document.cookie = `${CONSENT_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
  removeLegacyLocalStorageConsent();
  window.dispatchEvent(
    new CustomEvent<ConsentValue>(CONSENT_CHANGED_EVENT, { detail: null }),
  );
}

export function loadAnalytics(): void {
  if (typeof window === "undefined" || analyticsLoaded) return;
  analyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  // GTM — loads GA4 internally via its configured tags
  const gtmScript = document.createElement("script");
  gtmScript.async = true;
  gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(gtmScript);

  // GA4 direct — ensures pageview tracking on SPA navigation
  const gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(gaScript);
  gaScript.onload = () => {
    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID);
  };
}
