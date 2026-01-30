import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import { Providers } from "./providers";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PAULINE — Portfolio",
  description: "Art-driven portfolio site with cinematic video hero.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={sans.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <SiteNav />

            <main className="relative flex-1">{children}</main>

            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}