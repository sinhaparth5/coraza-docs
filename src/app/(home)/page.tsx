import type { Metadata } from "next";
import {
  ArchitectureSection,
  AutobanSection,
  DashboardSection,
  FaqSection,
  FeaturesSection,
  FooterSection,
  HeroSection,
  InstallSection,
} from "@/components/home";
import { faqItems, GITHUB_URL } from "@/components/home/constants";
import { JaaliDivider } from "@/components/home/ornaments";
import { ScrollProgress } from "@/components/home/scroll-motion";
import { getLatestRelease, type Release } from "@/lib/release";
import { appName, siteUrl } from "@/lib/shared";
import seoImage from "@/static/img/seo_image.jpg";

const title = `${appName}: open-source WAF and reverse proxy in one Go binary`;
const description =
  "A free, self-hosted web application firewall for Linux. OWASP CRS inspection, reverse proxy routing, TLS, rate limiting, automatic IP bans and a live dashboard in one Go binary. No Docker, no database server.";
const ogImage = {
  url: seoImage.src,
  width: seoImage.width,
  height: seoImage.height,
  alt: `${appName}: a web application firewall you can scp to a server`,
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "palisade waf",
    "web application firewall",
    "open source waf",
    "self-hosted waf",
    "reverse proxy",
    "owasp crs",
    "coraza v3",
    "go waf",
    "single binary waf",
    "modsecurity alternative",
    "admin dashboard",
    "ip and geo blocking",
    "automatic ip ban",
    "ja4 fingerprinting",
    "bot protection",
    "rate limiting",
    "tls termination",
    "lets encrypt",
    "sqlite",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: appName,
    type: "website",
    locale: "en_US",
    url: "/",
    title,
    description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

function buildJsonLd(release: Release | null) {
  const organization = { "@id": `${siteUrl}/#organization` };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: appName,
        description,
        inLanguage: "en",
        publisher: organization,
      },
      {
        "@type": "Organization",
        ...organization,
        name: appName,
        url: siteUrl,
        logo: `${siteUrl}/img/logo.svg`,
        sameAs: [GITHUB_URL],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#software`,
        name: appName,
        description:
          "A single-binary web application firewall and reverse proxy for Linux, built on OWASP Coraza v3 and the OWASP Core Rule Set.",
        url: siteUrl,
        image: `${siteUrl}${seoImage.src}`,
        applicationCategory: "SecurityApplication",
        applicationSubCategory: "Web application firewall",
        operatingSystem: "Linux",
        isAccessibleForFree: true,
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        downloadUrl: `${GITHUB_URL}/releases/latest`,
        installUrl: `${siteUrl}/docs/installation/install`,
        softwareHelp: `${siteUrl}/docs`,
        ...(release
          ? {
              softwareVersion: release.tag.replace(/^v/, ""),
              releaseNotes: release.url,
              ...(release.date
                ? { dateModified: release.date.slice(0, 10) }
                : {}),
            }
          : {}),
        featureList: [
          "OWASP Core Rule Set inspection with Coraza v3",
          "Reverse proxy with host and path routing",
          "Per-service TLS with Let's Encrypt",
          "Rate limiting and IP and geo blocking",
          "Automatic IP banning with email alerts",
          "Live admin dashboard with request logs",
          "Prometheus metrics and health probes",
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        author: {
          "@type": "Person",
          name: "Parth Sinha",
          url: "https://parthsinha.com",
        },
        publisher: organization,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

export default async function HomePage() {
  const jsonLd = buildJsonLd(await getLatestRelease());
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static, non-user-controlled JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="field-notes paper-grain flex flex-1 flex-col bg-paper text-ink">
        <ScrollProgress />
        <HeroSection />
        <JaaliDivider />
        <div id="main" className="home-reveal">
          <FeaturesSection />
          <ArchitectureSection />
          <AutobanSection />
          <DashboardSection />
          <JaaliDivider />
          <InstallSection />
          <FaqSection />
        </div>
        <FooterSection />
      </div>
    </>
  );
}
