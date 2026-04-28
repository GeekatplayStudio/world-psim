import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import Link from "next/link";

import "./globals.css";

import { TopNav } from "@/components/top-nav";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-heading"
});

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "BalanceSphere",
  description: "Phase 0 scaffold for a 3D geopolitical relationship visualization platform."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="font-[var(--font-body)] text-foreground antialiased">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
          <header className="mb-10 flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 shadow-panel backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/10 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
                  BS
                </span>
                <div>
                  <p className="font-[var(--font-heading)] text-3xl tracking-wide text-white">
                    BalanceSphere
                  </p>
                  <p className="text-sm text-slate-300">
                    Geopolitical network simulation scaffold
                  </p>
                </div>
              </Link>
            </div>
            <TopNav />
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}