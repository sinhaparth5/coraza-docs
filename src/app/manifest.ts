import type { MetadataRoute } from "next";
import { appName } from "@/lib/shared";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appName,
    short_name: appName,
    description:
      "One binary. Full WAF protection. A reverse proxy with OWASP CRS, live dashboard, IP and geo blocking, and TLS termination.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#2b5c74",
    lang: "en",
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
