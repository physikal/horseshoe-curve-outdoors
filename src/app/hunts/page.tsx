import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { images } from "@/lib/brand";
import { listHunts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HuntsPage() {
  const hunts = await listHunts();

  return (
    <div className="pt-24">
      <section className="relative min-h-[50vh] overflow-hidden">
        <Image
          src={images.dogs}
          alt="Working dog ready for an upland hunt"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-[var(--brand-forest-deep)]/65" />
        <div className="relative mx-auto flex min-h-[50vh] max-w-6xl items-end px-4 pb-12 md:px-6">
          <div>
            <p className="text-xs tracking-[0.22em] text-[var(--brand-gold)] uppercase">
              The Hunts
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl text-[var(--brand-cream)] md:text-5xl">
              Packages shaped for your group and your pace
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <p className="max-w-3xl text-lg leading-relaxed text-[var(--brand-ink)]/80">
          Enjoy a round of shooting clays and fully guided hunts with expert
          staff and top-notch dogs. Between hunts, Riverview Lodge serves
          gourmet meals from our chef. Echo Lodge, downriver, is ideal for more
          casual guided or non-guided groups.
        </p>

        <div className="mt-12 space-y-10">
          {hunts.map((hunt) => (
            <article
              key={hunt.id}
              className="grid gap-6 border-t border-[var(--brand-forest)]/15 pt-10 md:grid-cols-[1.4fr_1fr] md:items-start"
            >
              <div>
                <p className="text-xs tracking-[0.18em] text-[var(--brand-moss)] uppercase">
                  {hunt.packageType}
                </p>
                <h2 className="mt-2 font-display text-3xl text-[var(--brand-forest-deep)]">
                  {hunt.title}
                </h2>
                <p className="mt-4 leading-relaxed text-[var(--brand-ink)]/80">
                  {hunt.description}
                </p>
              </div>
              <div className="bg-[var(--brand-forest)] px-6 py-6 text-[var(--brand-cream)]">
                <p className="text-sm text-[var(--brand-cream)]/70">
                  From ${hunt.pricePerGuest} / guest · {hunt.durationHours} hours ·
                  up to {hunt.maxGuests} guests
                </p>
                <ButtonLink
                  href={`/book?hunt=${hunt.id}`}
                  className="mt-5 bg-[var(--brand-gold)] text-[var(--brand-ink)] hover:bg-[var(--brand-gold-bright)]"
                >
                  View open slots
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
