import Link from "next/link";
import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--brand-forest)]/15 bg-[var(--brand-forest-deep)] text-[var(--brand-cream)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-display text-xl tracking-[0.06em] uppercase">
            {brand.name}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--brand-cream)]/75">
            Upland bird hunts, sporting clays, and lodge hospitality along the
            Umatilla River outside Pendleton, Oregon.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--brand-gold)] uppercase">
            Visit
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            {brand.address}
            <br />
            {brand.cityStateZip}
          </p>
          <a
            href={brand.phoneHref}
            className="mt-3 block text-sm text-[var(--brand-cream)]/90 hover:text-[var(--brand-gold)]"
          >
            {brand.phone}
          </a>
          <a
            href={`mailto:${brand.email}`}
            className="mt-1 block text-sm text-[var(--brand-cream)]/90 hover:text-[var(--brand-gold)]"
          >
            {brand.email}
          </a>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] text-[var(--brand-gold)] uppercase">
            Explore
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/gallery" className="hover:text-[var(--brand-gold)]">
              Gallery
            </Link>
            <Link href="/hunts" className="hover:text-[var(--brand-gold)]">
              The Hunts
            </Link>
            <Link href="/book" className="hover:text-[var(--brand-gold)]">
              Book a Hunt
            </Link>
            <Link href="/admin" className="hover:text-[var(--brand-gold)]">
              Admin
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-[var(--brand-cream)]/55">
        © {new Date().getFullYear()} {brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
