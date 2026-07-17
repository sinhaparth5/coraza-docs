import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { appName } from "@/lib/shared";
import seoImage from "@/static/img/seo_image.jpg";
import "./global.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const clashGrotesk = localFont({
  src: [
    {
      path: "../fonts/clash-grotesk/clash-grotesk-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/clash-grotesk/clash-grotesk-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/clash-grotesk/clash-grotesk-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/clash-grotesk/clash-grotesk-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash-grotesk",
  display: "swap",
});

const defaultTitle = `${appName}: WAF and reverse proxy in a single Go binary`;
const defaultDescription =
  "Coraza WAF Mod combines OWASP CRS inspection, reverse proxy routing, TLS, and an admin dashboard without Docker or an external database.";

export const metadata: Metadata = {
  metadataBase: new URL("https://waf.astrareconslabs.com"),
  title: {
    default: defaultTitle,
    template: `%s — ${appName}`,
  },
  description: defaultDescription,
  applicationName: appName,
  keywords: [
    "coraza waf mod",
    "web application firewall",
    "reverse proxy",
    "owasp crs",
    "go",
  ],
  openGraph: {
    siteName: appName,
    type: "website",
    locale: "en_US",
    title: defaultTitle,
    description: defaultDescription,
    images: [seoImage.src],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [seoImage.src],
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${clashGrotesk.variable} ${dmSans.className}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
