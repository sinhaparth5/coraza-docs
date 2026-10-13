import type { Metadata } from "next";
import {
  ArchitectureSection,
  DashboardSection,
  DocsSearchSection,
  FaqSection,
  FeaturesSection,
  FooterSection,
  HeroSection,
  InstallSection,
  SecurityDepthSection,
  SelfContainedSection,
  StackComparisonSection,
  StatsSection,
} from "@/components/home";
import { faqItems } from "@/components/home/constants";
import seoImage from "@/static/img/seo_image.jpg";

const title = "Coraza WAF Mod: WAF and reverse proxy in a single Go binary";
const description =
  "A single Go binary combining OWASP CRS inspection, reverse proxy routing, TLS, rate limiting, and an admin dashboard. No Docker or database server needed.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "coraza waf mod",
    "web application firewall",
    "reverse proxy",
    "owasp crs",
    "coraza v3",
    "go waf",
    "single binary waf",
    "admin dashboard",
    "ip and geo blocking",
    "bot protection",
    "rate limiting",
    "tls termination",
    "sqlite",
    "mysql",
    "postgres",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "Coraza WAF Mod",
    type: "website",
    locale: "en_US",
    url: "/",
    title,
    description,
    images: [seoImage.src],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [seoImage.src],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Coraza WAF Mod",
      description:
        "A single-binary Web Application Firewall and reverse proxy for Linux, built on Coraza v3 and the OWASP Core Rule Set.",
      url: "https://waf.astrareconslabs.com",
      applicationCategory: "SecurityApplication",
      operatingSystem: "Linux",
      license: "https://www.apache.org/licenses/LICENSE-2.0",
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
    },
    {
      "@type": "Organization",
      name: "Coraza WAF Mod",
      url: "https://waf.astrareconslabs.com",
      logo: "https://waf.astrareconslabs.com/img/logo.svg",
      sameAs: ["https://github.com/sinhaparth5/coraza-waf-mod"],
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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static, non-user-controlled JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <div id="main" className="home-reveal">
        <StatsSection />
        <FeaturesSection />
        <StackComparisonSection />
        <SecurityDepthSection />
        <DashboardSection />
        <ArchitectureSection />
        <SelfContainedSection />
        <InstallSection />
        <FaqSection />
        <DocsSearchSection />
      </div>
      <FooterSection />
    </>
  );
}
