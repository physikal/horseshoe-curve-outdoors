"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/brand";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/hunts", label: "The Hunts" },
  { href: "/book", label: "Book a Hunt" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "z-40 w-full",
        isHome
          ? "absolute inset-x-0 top-0"
          : "sticky top-0 border-b border-white/10 bg-[var(--brand-forest-deep)]/95 backdrop-blur",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
        <Link
          href="/"
          className="font-display text-lg tracking-[0.08em] text-[var(--brand-cream)] uppercase md:text-xl"
        >
          {brand.name}
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-wide text-[var(--brand-cream)]/85 transition hover:text-[var(--brand-gold)]",
                pathname === link.href && "text-[var(--brand-gold)]",
              )}
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink
            href="/book"
            className="bg-[var(--brand-gold)] text-[var(--brand-ink)] hover:bg-[var(--brand-gold-bright)]"
          >
            Reserve
          </ButtonLink>
        </nav>
        <button
          type="button"
          className="rounded-md p-2 text-[var(--brand-cream)] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 bg-[var(--brand-forest)]/95 px-4 py-4 backdrop-blur md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-1 text-[var(--brand-cream)]"
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-2 bg-[var(--brand-gold)] text-[var(--brand-ink)]"
            >
              Reserve a hunt
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
