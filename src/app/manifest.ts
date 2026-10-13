import type { MetadataRoute } from "next";
import { appName, siteTagline } from "@/lib/shared";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appName,
    short_name: appName,
    description: `${appName}: ${siteTagline}. OWASP CRS inspection, reverse proxy, TLS, rate limiting and a live dashboard.`,
    start_url: "/",
    display: "browser",
    background_color: "#f8f4ec",
    theme_color: "#1c2a23",
    lang: "en",
    categories: ["security", "developer", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/img/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
