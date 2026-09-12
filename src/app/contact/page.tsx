import { brand } from "@/lib/brand";
import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="pt-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 md:grid-cols-2 md:px-6 md:py-16">
        <div>
          <p className="text-xs tracking-[0.22em] text-[var(--brand-moss)] uppercase">
            Contact
          </p>
          <h1 className="mt-3 font-display text-4xl text-[var(--brand-forest-deep)] md:text-5xl">
            Horseshoe Curve Hunt Club
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
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
