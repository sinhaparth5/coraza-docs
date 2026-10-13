import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata, Viewport } from "next";
import { Calistoga, Caveat, DM_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { CookieConsentBanner } from "@/components/cookie-consent";
import { appName, siteTagline, siteUrl } from "@/lib/shared";
import seoImage from "@/static/img/seo_image.jpg";
import "./global.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const calistoga = Calistoga({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-calistoga",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

const defaultTitle = `${appName}: ${siteTagline}`;
const defaultDescription =
  "Palisade is a free, open-source web application firewall and reverse proxy for Linux. OWASP CRS inspection, TLS, rate limiting, IP and geo blocking and a live admin dashboard in one Go binary. No Docker, no database server.";
const ogImage = {
  url: seoImage.src,
  width: seoImage.width,
  height: seoImage.height,
  alt: `${appName}: a web application firewall you can scp to a server`,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s · ${appName}`,
  },
  description: defaultDescription,
  applicationName: appName,
  authors: [{ name: "Parth Sinha", url: "https://parthsinha.com" }],
  creator: "Parth Sinha",
  publisher: appName,
  category: "technology",
  keywords: [
    "palisade waf",
    "web application firewall",
    "open source waf",
    "self-hosted waf",
    "reverse proxy",
    "owasp crs",
    "coraza",
    "go waf",
    "linux waf",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    types: { "text/plain": "/llms.txt" },
  },
  openGraph: {
    siteName: appName,
    type: "website",
    locale: "en_US",
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImage],
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f4ec" },
    { media: "(prefers-color-scheme: dark)", color: "#141c18" },
  ],
  colorScheme: "light dark",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable} ${calistoga.variable} ${caveat.variable} ${dmSans.className}`}
      suppressHydrationWarning
    >
      <Script
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="PKvhYC++VHQ209t/ICjrig"
        strategy="afterInteractive"
      />
      <body className="flex flex-col min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-fd-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-fd-primary-foreground"
        >
          Skip to content
        </a>
        <RootProvider>{children}</RootProvider>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
