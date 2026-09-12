import { format } from "date-fns";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { getBooking } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking || booking.status === "cancelled") notFound();

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        <p className="text-xs tracking-[0.22em] text-[var(--brand-moss)] uppercase">
          Confirmed
        </p>
        <h1 className="mt-3 font-display text-4xl text-[var(--brand-forest-deep)]">
          You’re on the schedule
        </h1>
        <p className="mt-4 text-[var(--brand-ink)]/75">
          Save your confirmation code. We’ll also keep this booking in the lodge
          schedule for arrival day.
        </p>

        <div className="mt-10 space-y-4 border border-[var(--brand-forest)]/15 bg-[var(--brand-cream)]/70 p-6">
          <div>
            <p className="text-xs tracking-[0.16em] text-[var(--brand-moss)] uppercase">
              Confirmation
            </p>
            <p className="mt-1 font-display text-3xl tracking-wide text-[var(--brand-forest)]">
              {booking.confirmationCode}
            </p>
          </div>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <p>
              <span className="text-[var(--brand-ink)]/55">Hunt</span>
              <br />
              {booking.hunt.title}
            </p>
            <p>
              <span className="text-[var(--brand-ink)]/55">When</span>
              <br />
              {format(new Date(booking.slot.startAt), "EEEE, MMM d · h:mm a")}
            </p>
            <p>
              <span className="text-[var(--brand-ink)]/55">Guest</span>
              <br />
              {booking.guestName}
            </p>
            <p>
              <span className="text-[var(--brand-ink)]/55">Party size</span>
              <br />
              {booking.partySize}
            </p>
            <p>
              <span className="text-[var(--brand-ink)]/55">Email</span>
              <br />
              {booking.guestEmail}
            </p>
            <p>
              <span className="text-[var(--brand-ink)]/55">Phone</span>
              <br />
              {booking.guestPhone}
            </p>
          </div>
          {booking.notes ? (
            <p className="text-sm">
              <span className="text-[var(--brand-ink)]/55">Notes</span>
              <br />
              {booking.notes}
            </p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink
            href="/book"
            className="bg-[var(--brand-forest)] text-[var(--brand-cream)]"
          >
            Book another hunt
          </ButtonLink>
          <ButtonLink href="/" variant="outline">
            Back home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
