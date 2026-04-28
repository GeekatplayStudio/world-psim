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
        <div className="mx-auto flex min-h-screen max-w-none flex-col px-4 py-4 sm:px-6 lg:px-8">
          <header className="sticky top-4 z-20 mb-4 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/70 px-4 py-3 shadow-panel backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/10 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
                  BS
                </span>
                <div>
                  <p className="font-[var(--font-heading)] text-2xl tracking-wide text-white">
                    BalanceSphere
                  </p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Interactive geopolitical simulation
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