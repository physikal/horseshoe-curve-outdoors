import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { listBookings, listHunts, listSlots } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [hunts, slots, bookings] = await Promise.all([
    listHunts({ includeCancelled: true }),
    listSlots({ includeCancelled: true }),
    listBookings({ includeCancelled: true }),
  ]);

  const openSlots = slots.filter((s) => s.status === "open").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[var(--brand-forest-deep)]">
          Overview
        </h1>
        <p className="mt-2 text-[var(--brand-ink)]/70">
          Manage hunt packages, availability slots, and guest bookings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Active hunts", value: hunts.filter((h) => h.status === "active").length },
          { label: "Open slots", value: openSlots },
          { label: "Confirmed bookings", value: confirmed },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border border-[var(--brand-forest)]/15 bg-white/70 px-5 py-4"
          >
            <p className="text-xs tracking-[0.16em] text-[var(--brand-moss)] uppercase">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-4xl text-[var(--brand-forest)]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Upcoming slots</h2>
            <Link href="/admin/hunts" className="text-sm text-[var(--brand-moss)]">
              Manage →
            </Link>
          </div>
          <div className="space-y-2">
            {slots
              .filter((s) => s.status !== "cancelled")
              .slice(0, 6)
              .map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between gap-3 border border-[var(--brand-forest)]/10 bg-[var(--brand-cream)]/50 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{slot.hunt.title}</p>
                    <p className="text-[var(--brand-ink)]/65">
                      {format(new Date(slot.startAt), "MMM d · h:mm a")}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {slot.bookedCount}/{slot.capacity}
                  </Badge>
                </div>
              ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Recent bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-sm text-[var(--brand-moss)]"
            >
              Manage →
            </Link>
          </div>
          <div className="space-y-2">
            {bookings.slice(0, 6).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between gap-3 border border-[var(--brand-forest)]/10 bg-[var(--brand-cream)]/50 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{booking.guestName}</p>
                  <p className="text-[var(--brand-ink)]/65">
                    {booking.hunt.title} · {booking.confirmationCode}
                  </p>
                </div>
                <Badge
                  variant={
                    booking.status === "confirmed" ? "default" : "secondary"
                  }
                >
                  {booking.status}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
