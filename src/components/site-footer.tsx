import Link from "next/link";
import { brand } from "@/lib/brand";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.18 2.09 16.09 2 14.93 2 12.26 2 10.5 3.67 10.5 6.58V9.5H8v4h2.5V22h3.5v-8.5z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm10.5 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7.5A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
    </svg>
  );
}

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
          <div className="mt-5">
            <p className="text-xs tracking-[0.2em] text-[var(--brand-gold)] uppercase">
              Follow
            </p>
            <div className="mt-3 flex items-center gap-4">
              <a
                href={brand.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--brand-cream)]/90 hover:text-[var(--brand-gold)]"
                aria-label="Horseshoe Curve Outdoors on Facebook"
              >
                <FacebookIcon className="size-4" />
                Facebook
              </a>
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--brand-cream)]/90 hover:text-[var(--brand-gold)]"
                aria-label="Horseshoe Curve Hunt Club on Instagram"
              >
                <InstagramIcon className="size-4" />
                Instagram
              </a>
            </div>
          </div>
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
            <Link href="/contact" className="hover:text-[var(--brand-gold)]">
              Contact
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
