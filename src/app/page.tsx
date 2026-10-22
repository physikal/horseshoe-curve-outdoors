import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { brand, images } from "@/lib/brand";

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden">
        <Image
          src={images.hero}
          alt="Eastern Oregon hills and open sky above Horseshoe Curve country"
          fill
          priority
          className="object-cover ken-burns"
          sizes="100vw"
        />
        <div className="hero-veil absolute inset-0" />
        <div className="relative z-10 flex min-h-[100svh] items-end px-4 pb-16 pt-28 md:items-center md:px-6 md:pb-24">
          <div className="mx-auto w-full max-w-6xl">
            <p className="fade-up font-display text-3xl leading-none tracking-[0.06em] text-[var(--brand-cream)] uppercase sm:text-5xl md:text-6xl lg:text-7xl">
              {brand.name}
            </p>
            <h1 className="fade-up-delay mt-6 max-w-2xl font-display text-2xl leading-snug text-[var(--brand-cream)] sm:text-3xl md:text-4xl">
              Escape the everyday for low-pressure upland hunting along the
              Umatilla River.
            </h1>
            <p className="fade-up-delay-2 mt-5 max-w-xl text-base leading-relaxed text-[var(--brand-cream)]/85 md:text-lg">
              Just outside Pendleton, Oregon—expert guides, top-notch dogs, and
              lodge hospitality wait beyond the traffic and the noise.
            </p>
            <div className="fade-up-delay-2 mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href="/book"
                size="lg"
                className="bg-[var(--brand-gold)] px-7 text-[var(--brand-ink)] hover:bg-[var(--brand-gold-bright)]"
              >
                Book a hunt
              </ButtonLink>
              <ButtonLink
                href="/hunts"
                size="lg"
                variant="outline"
                className="border-[var(--brand-cream)]/40 bg-transparent text-[var(--brand-cream)] hover:bg-white/10 hover:text-[var(--brand-cream)]"
              >
                Explore packages
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center md:px-6 md:py-28">
        <div>
          <p className="text-xs tracking-[0.22em] text-[var(--brand-moss)] uppercase">
            A day in the life
          </p>
          <h2 className="mt-3 font-display text-3xl text-[var(--brand-forest-deep)] md:text-4xl">
            Wildlife plentiful. Air fresh. Hunting pressure low.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--brand-ink)]/80">
            Located just outside Pendleton, the Umatilla River meanders through
            expertly cultivated farmlands. The property offers the perfect mix
            of planted and wild cover for thrilling upland bird hunts.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--brand-ink)]/80">
            Reserve an upland package and let us create a memorable experience
            for your group—clays, fully guided hunts, gourmet meals, and
            evenings at the saloon or fire pit retelling the day.
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
          <Image
            src={images.river}
            alt="River corridor through cultivated Eastern Oregon farmland"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="bg-[var(--brand-forest)] text-[var(--brand-cream)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3 md:px-6 md:py-20">
          {[
            {
              title: "Riverview Lodge",
              copy: "Fully guided packages with gourmet chef meals, sporting clays, and nights by the fire.",
              href: "/hunts",
            },
            {
              title: "Echo Lodge",
              copy: "Downriver lodging for casual guided or custom non-guided groups who want flexibility.",
              href: "/hunts",
            },
            {
              title: "Book online",
              copy: "Browse open hunt slots, reserve your party, and get instant confirmation.",
              href: "/book",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-2xl tracking-wide">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--brand-cream)]/75">
                {item.copy}
              </p>
              <Link
                href={item.href}
                className="mt-5 inline-block text-sm text-[var(--brand-gold)] hover:text-[var(--brand-gold-bright)]"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={images.farmland}
            alt="Golden farmland at dusk"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[var(--brand-forest-deep)]/70" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center md:px-6">
          <h2 className="font-display text-3xl text-[var(--brand-cream)] md:text-4xl">
            Ready for the field?
          </h2>
          <p className="mt-4 text-[var(--brand-cream)]/80">
            {brand.fullAddress} · {brand.phone}
          </p>
          <ButtonLink
            href="/book"
            size="lg"
            className="mt-8 bg-[var(--brand-gold)] text-[var(--brand-ink)] hover:bg-[var(--brand-gold-bright)]"
          >
            See available hunts
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
