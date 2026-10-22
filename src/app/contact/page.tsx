import { brand } from "@/lib/brand";
import { ContactForm } from "@/components/contact-form";

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

export default function ContactPage() {
  return (
    <div className="pt-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 md:grid-cols-2 md:px-6 md:py-16">
        <div>
          <p className="text-xs tracking-[0.22em] text-[var(--brand-moss)] uppercase">
            Contact
          </p>
          <h1 className="mt-3 font-display text-4xl text-[var(--brand-forest-deep)] md:text-5xl">
            {brand.name}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[var(--brand-ink)]/80">
            Reach us to ask about lodging, group sizes, or a custom Echo day.
            Or book a published hunt slot online anytime.
          </p>
          <div className="mt-8 space-y-3 text-[var(--brand-ink)]">
            <p>{brand.fullAddress}</p>
            <p>
              <a href={brand.phoneHref} className="hover:text-[var(--brand-moss)]">
                {brand.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${brand.email}`}
                className="hover:text-[var(--brand-moss)]"
              >
                {brand.email}
              </a>
            </p>
          </div>
          <div className="mt-10">
            <p className="text-xs tracking-[0.22em] text-[var(--brand-moss)] uppercase">
              Follow us
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-6">
              <a
                href={brand.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium text-[var(--brand-forest-deep)] hover:text-[var(--brand-moss)]"
              >
                <FacebookIcon className="size-5" />
                Facebook
              </a>
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium text-[var(--brand-forest-deep)] hover:text-[var(--brand-moss)]"
              >
                <InstagramIcon className="size-5" />
                Instagram
              </a>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
