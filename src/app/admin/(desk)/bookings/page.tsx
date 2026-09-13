"use client";

import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BookingWithDetails } from "@/lib/types";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings?includeCancelled=true");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load bookings");
      setBookings(json.bookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(id: string, status: "confirmed" | "cancelled") {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Update failed");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[var(--brand-forest-deep)]">
          Bookings
        </h1>
        <p className="mt-2 text-[var(--brand-ink)]/70">
          Confirmations and cancellations update slot capacity automatically.
        </p>
      </div>

      {loading ? (
        <p className="text-[var(--brand-ink)]/60">Loading bookings…</p>
      ) : null}
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {!loading && bookings.length === 0 ? (
        <Alert>
          <AlertTitle>No bookings yet</AlertTitle>
          <AlertDescription>
            When guests reserve slots, they will appear here.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="border border-[var(--brand-forest)]/10 bg-white/70 px-4 py-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl">{booking.guestName}</p>
                <p className="mt-1 text-sm text-[var(--brand-ink)]/70">
                  {booking.hunt.title} ·{" "}
                  {format(new Date(booking.slot.startAt), "MMM d, yyyy · h:mm a")}
                </p>
                <p className="mt-1 text-sm text-[var(--brand-ink)]/70">
                  Party of {booking.partySize} · {booking.guestEmail} ·{" "}
                  {booking.guestPhone}
                </p>
                <p className="mt-2 text-xs tracking-[0.14em] text-[var(--brand-moss)] uppercase">
                  {booking.confirmationCode}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    booking.status === "confirmed" ? "default" : "secondary"
                  }
                >
                  {booking.status}
                </Badge>
                {booking.status === "confirmed" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void setStatus(booking.id, "cancelled")}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void setStatus(booking.id, "confirmed")}
                  >
                    Restore
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
