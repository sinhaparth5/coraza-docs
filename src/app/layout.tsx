import { RootProvider } from "fumadocs-ui/provider/next";
import { Manrope } from "next/font/google";
import "./global.css";

const manrope = Manrope({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={manrope.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
