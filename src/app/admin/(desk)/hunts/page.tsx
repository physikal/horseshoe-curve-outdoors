"use client";

import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Hunt, SlotWithHunt } from "@/lib/types";

export default function AdminHuntsPage() {
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [slots, setSlots] = useState<SlotWithHunt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [huntsRes, slotsRes] = await Promise.all([
        fetch("/api/hunts?includeCancelled=true"),
        fetch("/api/slots?includeCancelled=true"),
      ]);
      const huntsJson = await huntsRes.json();
      const slotsJson = await slotsRes.json();
      if (!huntsRes.ok) throw new Error(huntsJson.error || "Failed to load hunts");
      if (!slotsRes.ok) throw new Error(slotsJson.error || "Failed to load slots");
      setHunts(huntsJson.hunts);
      setSlots(slotsJson.slots);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createHunt(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const data = new FormData(e.currentTarget);
    const res = await fetch("/api/hunts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(data.get("title")),
        description: String(data.get("description")),
        packageType: String(data.get("packageType")),
        durationHours: Number(data.get("durationHours")),
        maxGuests: Number(data.get("maxGuests")),
        pricePerGuest: Number(data.get("pricePerGuest")),
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Could not create hunt");
      return;
    }
    setMessage(`Created hunt ${json.hunt.title}`);
    e.currentTarget.reset();
    await load();
  }

  async function createSlot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const data = new FormData(e.currentTarget);
    const startLocal = String(data.get("startAt"));
    const endLocal = String(data.get("endAt"));
    const res = await fetch("/api/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        huntId: String(data.get("huntId")),
        startAt: new Date(startLocal).toISOString(),
        endAt: new Date(endLocal).toISOString(),
        capacity: Number(data.get("capacity")),
        notes: String(data.get("notes") || "") || undefined,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Could not create slot");
      return;
    }
    setMessage(`Created slot ${json.slot.id}`);
    e.currentTarget.reset();
    await load();
  }

  async function cancelHunt(id: string) {
    const res = await fetch(`/api/hunts/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Could not cancel hunt");
      return;
    }
    setMessage("Hunt cancelled (related open slots cancelled).");
    await load();
  }

  async function cancelSlot(id: string) {
    const res = await fetch(`/api/slots/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Could not cancel slot");
      return;
    }
    setMessage("Slot cancelled.");
    await load();
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl text-[var(--brand-forest-deep)]">
          Hunts & slots
        </h1>
        <p className="mt-2 text-[var(--brand-ink)]/70">
          Create packages and open calendar capacity for guests and agents.
        </p>
      </div>

      {loading ? (
        <p className="text-[var(--brand-ink)]/60">Loading schedule…</p>
      ) : null}
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {message ? (
        <Alert>
          <AlertTitle>Updated</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={createHunt}
          className="space-y-3 border border-[var(--brand-forest)]/15 bg-white/70 p-5"
        >
          <h2 className="font-display text-xl">New hunt package</h2>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="packageType">Package type</Label>
            <select
              id="packageType"
              name="packageType"
              defaultValue="upland"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="upland">Upland</option>
              <option value="echo">Echo</option>
              <option value="clays">Clays</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="durationHours">Hours</Label>
              <Input
                id="durationHours"
                name="durationHours"
                type="number"
                defaultValue={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxGuests">Max guests</Label>
              <Input
                id="maxGuests"
                name="maxGuests"
                type="number"
                defaultValue={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerGuest">Price</Label>
              <Input
                id="pricePerGuest"
                name="pricePerGuest"
                type="number"
                defaultValue={400}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="bg-[var(--brand-forest)] text-[var(--brand-cream)]"
          >
            Create hunt
          </Button>
        </form>

        <form
          onSubmit={createSlot}
          className="space-y-3 border border-[var(--brand-forest)]/15 bg-white/70 p-5"
        >
          <h2 className="font-display text-xl">New availability slot</h2>
          <div className="space-y-2">
            <Label htmlFor="huntId">Hunt</Label>
            <select
              id="huntId"
              name="huntId"
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {hunts
                .filter((h) => h.status === "active")
                .map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.title}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startAt">Start</Label>
              <Input id="startAt" name="startAt" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endAt">End</Label>
              <Input id="endAt" name="endAt" type="datetime-local" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" name="capacity" type="number" defaultValue={6} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" name="notes" />
          </div>
          <Button
            type="submit"
            className="bg-[var(--brand-forest)] text-[var(--brand-cream)]"
          >
            Create slot
          </Button>
        </form>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Packages</h2>
        {hunts.map((hunt) => (
          <div
            key={hunt.id}
            className="flex flex-wrap items-center justify-between gap-3 border border-[var(--brand-forest)]/10 bg-[var(--brand-cream)]/50 px-4 py-3"
          >
            <div>
              <p className="font-medium">{hunt.title}</p>
              <p className="text-sm text-[var(--brand-ink)]/65">
                ${hunt.pricePerGuest}/guest · {hunt.packageType} · {hunt.id}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={hunt.status === "active" ? "default" : "secondary"}>
                {hunt.status}
              </Badge>
              {hunt.status === "active" ? (
                <Button variant="outline" size="sm" onClick={() => void cancelHunt(hunt.id)}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Slots</h2>
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="flex flex-wrap items-center justify-between gap-3 border border-[var(--brand-forest)]/10 bg-[var(--brand-cream)]/50 px-4 py-3"
          >
            <div>
              <p className="font-medium">{slot.hunt.title}</p>
              <p className="text-sm text-[var(--brand-ink)]/65">
                {format(new Date(slot.startAt), "MMM d, yyyy · h:mm a")} ·{" "}
                {slot.bookedCount}/{slot.capacity} booked
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{slot.status}</Badge>
              {slot.status !== "cancelled" ? (
                <Button variant="outline" size="sm" onClick={() => void cancelSlot(slot.id)}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
