import type { Metadata } from "next";
import {
  ArchitectureSection,
  DashboardSection,
  FeaturesSection,
  HeroSection,
  InstallSection,
  StatsSection,
} from "@/components/home";

export const metadata: Metadata = {
  title: "Coraza WAF and reverse proxy in a single Go binary",
  description:
    "Coraza WAF Mod combines OWASP CRS inspection, reverse proxy routing, TLS, and an admin dashboard without Docker or an external database.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DashboardSection />
      <StatsSection />
      <FeaturesSection />
      <ArchitectureSection />
      <InstallSection />
    </>
  );
}
