import type { Metadata } from "next";
import { CookieConsentPreferences } from "@/components/cookie-consent";
import { GITHUB_URL } from "@/components/home/constants";
import { appName } from "@/lib/shared";

export const metadata: Metadata = {
  title: "Privacy & cookie policy",
  description: `How the ${appName} documentation site uses cookies and analytics, and how to manage your consent.`,
};

const cookies = [
  {
    name: "cz-cookie-consent",
    provider: "This site",
    purpose: "Remembers your cookie consent choice.",
    duration: "12 months",
    category: "Essential",
  },
  {
    name: "_ga",
    provider: "Google Analytics",
    purpose: "Distinguishes visitors for usage statistics.",
    duration: "13 months",
    category: "Analytics (consent required)",
  },
  {
    name: "_ga_*",
    provider: "Google Analytics",
    purpose: "Maintains session state for usage statistics.",
    duration: "13 months",
    category: "Analytics (consent required)",
  },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 font-heading text-xl font-bold text-fd-foreground">
      {children}
    </h2>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-heading text-3xl font-bold text-fd-foreground">
        Privacy &amp; cookie policy
      </h1>
      <p className="mt-2 text-sm text-fd-muted-foreground">
        Last updated: July 18, 2026
      </p>

      <p className="mt-6 leading-7 text-fd-muted-foreground">
        This policy explains what data the {appName} documentation site
        collects, which cookies it sets, and how you can control them. The site
        is a static documentation and blog site — you never need an account, and
        we never ask for personal information to read it.
      </p>

      <SectionHeading>What we collect</SectionHeading>
      <p className="mt-3 leading-7 text-fd-muted-foreground">
        We collect aggregate usage statistics (pages visited, referrers,
        approximate location derived from IP, browser and device type) to
        understand which documentation is useful and where to improve. We do not
        collect names, email addresses, or any content you type into the search
        box beyond what is needed to serve results.
      </p>

      <SectionHeading>Analytics services</SectionHeading>
      <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 leading-7 text-fd-muted-foreground">
        <li>
          <span className="font-medium text-fd-foreground">
            Google Analytics 4 / Google Tag Manager
          </span>{" "}
          — loaded <em>only after you accept all cookies</em> in the consent
          banner. Google may set the cookies listed below. See the{" "}
          <a
            href="https://policies.google.com/privacy"
            rel="noreferrer noopener"
            target="_blank"
            className="text-pixie-green-600 underline underline-offset-2 hover:text-pixie-green-700"
          >
            Google privacy policy
          </a>
          .
        </li>
        <li>
          <span className="font-medium text-fd-foreground">
            Ahrefs Web Analytics
          </span>{" "}
          — a cookieless analytics service that does not store identifiers on
          your device or track you across sites, so it runs without consent. See
          the{" "}
          <a
            href="https://ahrefs.com/privacy"
            rel="noreferrer noopener"
            target="_blank"
            className="text-pixie-green-600 underline underline-offset-2 hover:text-pixie-green-700"
          >
            Ahrefs privacy policy
          </a>
          .
        </li>
      </ul>

      <SectionHeading>Cookies we use</SectionHeading>
      <div className="mt-3 overflow-x-auto rounded-xl border border-fd-border">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-fd-border bg-fd-muted text-left">
              <th className="px-4 py-3 font-bold">Cookie</th>
              <th className="px-4 py-3 font-bold">Provider</th>
              <th className="px-4 py-3 font-bold">Purpose</th>
              <th className="px-4 py-3 font-bold">Duration</th>
              <th className="px-4 py-3 font-bold">Category</th>
            </tr>
          </thead>
          <tbody>
            {cookies.map((cookie) => (
              <tr
                key={cookie.name}
                className="border-b border-fd-border last:border-b-0"
              >
                <td className="px-4 py-3 font-mono text-xs">{cookie.name}</td>
                <td className="px-4 py-3 text-fd-muted-foreground">
                  {cookie.provider}
                </td>
                <td className="px-4 py-3 text-fd-muted-foreground">
                  {cookie.purpose}
                </td>
                <td className="px-4 py-3 text-fd-muted-foreground">
                  {cookie.duration}
                </td>
                <td className="px-4 py-3 text-fd-muted-foreground">
                  {cookie.category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeading>Manage your cookie preferences</SectionHeading>
      <p className="mt-3 leading-7 text-fd-muted-foreground">
        You can change or withdraw your consent at any time. Choosing “Reset
        choice” clears your saved preference and shows the consent banner again.
      </p>
      <div className="mt-4">
        <CookieConsentPreferences />
      </div>
      <p className="mt-4 leading-7 text-fd-muted-foreground">
        You can also delete cookies for this site in your browser settings at
        any time, and most browsers let you block third-party cookies entirely.
      </p>

      <SectionHeading>Changes to this policy</SectionHeading>
      <p className="mt-3 leading-7 text-fd-muted-foreground">
        If we add or change analytics services or cookies, we will update this
        page and, where the change requires it, ask for your consent again.
      </p>

      <SectionHeading>Contact</SectionHeading>
      <p className="mt-3 leading-7 text-fd-muted-foreground">
        Questions about this policy or your data? Open an issue on the{" "}
        <a
          href={GITHUB_URL}
          rel="noreferrer noopener"
          target="_blank"
          className="text-pixie-green-600 underline underline-offset-2 hover:text-pixie-green-700"
        >
          {appName} GitHub repository
        </a>
        .
      </p>
    </main>
  );
}
