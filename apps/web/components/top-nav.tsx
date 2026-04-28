"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Graph" },
  { href: "/admin", label: "Admin" },
  { href: "/admin/claims", label: "Claims" },
  { href: "/sources", label: "Sources" },
  { href: "/scenarios", label: "Scenarios" }
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-3">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              isActive
                ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-100"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}