import type { Metadata } from "next";
import {
  ArchitectureSection,
  DashboardSection,
  FeaturesSection,
  FooterSection,
  HeroSection,
  InstallSection,
  StatsSection,
} from "@/components/home";

export const metadata: Metadata = {
  title: {
    absolute: "Coraza WAF Mod: WAF and reverse proxy in a single Go binary",
  },
  description:
    "Coraza WAF Mod combines OWASP CRS inspection, reverse proxy routing, TLS, and an admin dashboard without Docker or an external database.",
  keywords: [
    "coraza waf mod",
    "web application firewall",
    "reverse proxy",
    "owasp crs",
    "go waf",
    "single binary waf",
    "admin dashboard",
    "ip and geo blocking",
    "bot protection",
    "mysql",
    "postgres",
  ],
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
      <StatsSection />
      <FeaturesSection />
      <DashboardSection />
      <ArchitectureSection />
      <InstallSection />
      <FooterSection />
    </>
  );
}
