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
        <div className="mx-auto flex min-h-screen max-w-none flex-col px-3 py-3 sm:px-4 lg:px-5">
          <header className="sticky top-3 z-20 mb-3 flex flex-col gap-3 rounded-[1.2rem] border border-white/10 bg-slate-950/62 px-3 py-2.5 shadow-panel backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/10 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
                  BS
                </span>
                <div>
                  <p className="font-[var(--font-heading)] text-[1.9rem] leading-none tracking-wide text-white">
                    BalanceSphere
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-slate-400">
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