"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SlotWithHunt } from "@/lib/types";
import { cn } from "@/lib/utils";

function BookPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const huntFilter = searchParams.get("hunt");

  const [slots, setSlots] = useState<SlotWithHunt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ availableOnly: "true" });
      if (huntFilter) params.set("huntId", huntFilter);
      const res = await fetch(`/api/slots?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load slots");
      setSlots(data.slots);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load slots");
    } finally {
      setLoading(false);
    }
  }, [huntFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = useMemo(
    () => slots.find((s) => s.id === selectedId) ?? null,
    [slots, selectedId],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) {
      setFormError("Select a hunt slot first.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selected.id,
          guestName: String(data.get("guestName") || ""),
          guestEmail: String(data.get("guestEmail") || ""),
          guestPhone: String(data.get("guestPhone") || ""),
          partySize: Number(data.get("partySize") || 1),
          notes: String(data.get("notes") || "") || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Booking failed");
      router.push(`/book/confirmation/${json.booking.id}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Booking failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <p className="text-xs tracking-[0.22em] text-[var(--brand-moss)] uppercase">
          Schedule
        </p>
        <h1 className="mt-3 font-display text-4xl text-[var(--brand-forest-deep)] md:text-5xl">
          Book a hunt
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--brand-ink)]/75">
          Choose an open slot, tell us who is coming, and get an instant
          confirmation code for your party.
        </p>

        {huntFilter ? (
          <p className="mt-4 text-sm text-[var(--brand-moss)]">
            Showing slots for one package.{" "}
            <Link href="/book" className="underline underline-offset-2">
              View all packages
            </Link>
          </p>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse bg-[var(--brand-stone)]/50"
                  />
                ))}
              </div>
            ) : null}

            {error ? (
              <Alert variant="destructive">
                <AlertTitle>Couldn’t load availability</AlertTitle>
                <AlertDescription className="flex flex-col gap-3">
                  <span>{error}</span>
                  <Button variant="outline" onClick={() => void load()}>
                    Try again
                  </Button>
                </AlertDescription>
              </Alert>
            ) : null}

            {!loading && !error && slots.length === 0 ? (
              <Alert>
                <AlertTitle>No open slots right now</AlertTitle>
                <AlertDescription>
                  Check back soon, or{" "}
                  <Link href="/contact" className="underline">
                    contact the lodge
                  </Link>{" "}
                  for a custom date.
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-3">
              {slots.map((slot) => {
                const active = selectedId === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedId(slot.id)}
                    className={cn(
                      "w-full border px-5 py-4 text-left transition",
                      active
                        ? "border-[var(--brand-forest)] bg-[var(--brand-forest)] text-[var(--brand-cream)]"
                        : "border-[var(--brand-forest)]/20 bg-[var(--brand-cream)]/50 hover:border-[var(--brand-forest)]/45",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-xl">{slot.hunt.title}</p>
                        <p
                          className={cn(
                            "mt-1 text-sm",
                            active
                              ? "text-[var(--brand-cream)]/75"
                              : "text-[var(--brand-ink)]/70",
                          )}
                        >
                          {format(new Date(slot.startAt), "EEE, MMM d · h:mm a")}{" "}
                          – {format(new Date(slot.endAt), "h:mm a")}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          active
                            ? "bg-[var(--brand-gold)] text-[var(--brand-ink)]"
                            : ""
                        }
                      >
                        {slot.remaining} open
                      </Badge>
                    </div>
                    <p
                      className={cn(
                        "mt-3 text-sm",
                        active
                          ? "text-[var(--brand-cream)]/80"
                          : "text-[var(--brand-ink)]/70",
                      )}
                    >
                      ${slot.hunt.pricePerGuest}/guest · up to{" "}
                      {slot.hunt.maxGuests} guests
                      {slot.notes ? ` · ${slot.notes}` : ""}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="h-fit space-y-4 border border-[var(--brand-forest)]/15 bg-white/70 p-6"
          >
            <h2 className="font-display text-2xl text-[var(--brand-forest-deep)]">
              Guest details
            </h2>
            {selected ? (
              <p className="text-sm text-[var(--brand-ink)]/70">
                Booking: {selected.hunt.title} on{" "}
                {format(new Date(selected.startAt), "MMM d, yyyy")}
              </p>
            ) : (
              <p className="text-sm text-[var(--brand-ink)]/70">
                Select a slot to continue.
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="guestName">Full name</Label>
              <Input id="guestName" name="guestName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email</Label>
              <Input id="guestEmail" name="guestEmail" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestPhone">Phone</Label>
              <Input id="guestPhone" name="guestPhone" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partySize">Party size</Label>
              <Input
                id="partySize"
                name="partySize"
                type="number"
                min={1}
                max={selected?.remaining ?? selected?.hunt.maxGuests ?? 12}
                defaultValue={1}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" name="notes" rows={3} />
            </div>
            {formError ? (
              <Alert variant="destructive">
                <AlertTitle>Booking issue</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}
            <Button
              type="submit"
              disabled={!selected || submitting}
              className="w-full bg-[var(--brand-gold)] text-[var(--brand-ink)] hover:bg-[var(--brand-gold-bright)]"
            >
              {submitting ? "Confirming…" : "Confirm booking"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 pt-32 text-[var(--brand-ink)]/70">
          Loading availability…
        </div>
      }
    >
      <BookPageInner />
    </Suspense>
  );
}
