"use client";

import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  Hunt,
  HuntPackage,
  HuntStatus,
  SlotStatus,
  SlotWithHunt,
} from "@/lib/types";
import { formatUsd } from "@/lib/utils";

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminHuntsPage() {
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [slots, setSlots] = useState<SlotWithHunt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editingHuntId, setEditingHuntId] = useState<string | null>(null);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
    setError(null);
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
    setMessage(`Created hunt “${json.hunt.title}”.`);
    e.currentTarget.reset();
    await load();
  }

  async function saveHunt(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/hunts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(data.get("title")),
          description: String(data.get("description")),
          packageType: String(data.get("packageType")) as HuntPackage,
          durationHours: Number(data.get("durationHours")),
          maxGuests: Number(data.get("maxGuests")),
          pricePerGuest: Number(data.get("pricePerGuest")),
          status: String(data.get("status")) as HuntStatus,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not update hunt");
      setMessage(`Saved hunt “${json.hunt.title}”.`);
      setEditingHuntId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update hunt");
    } finally {
      setSaving(false);
    }
  }

  async function createSlot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const data = new FormData(e.currentTarget);
    const res = await fetch("/api/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        huntId: String(data.get("huntId")),
        startAt: new Date(String(data.get("startAt"))).toISOString(),
        endAt: new Date(String(data.get("endAt"))).toISOString(),
        capacity: Number(data.get("capacity")),
        notes: String(data.get("notes") || "") || undefined,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Could not create slot");
      return;
    }
    setMessage(`Created slot ${json.slot.id}.`);
    e.currentTarget.reset();
    await load();
  }

  async function saveSlot(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/slots/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          huntId: String(data.get("huntId")),
          startAt: new Date(String(data.get("startAt"))).toISOString(),
          endAt: new Date(String(data.get("endAt"))).toISOString(),
          capacity: Number(data.get("capacity")),
          notes: String(data.get("notes") || "") || undefined,
          status: String(data.get("status")) as SlotStatus,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not update slot");
      setMessage(`Saved slot ${json.slot.id}.`);
      setEditingSlotId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update slot");
    } finally {
      setSaving(false);
    }
  }

  async function cancelHunt(id: string) {
    setError(null);
    const res = await fetch(`/api/hunts/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Could not cancel hunt");
      return;
    }
    setMessage("Hunt cancelled (related open slots cancelled).");
    if (editingHuntId === id) setEditingHuntId(null);
    await load();
  }

  async function cancelSlot(id: string) {
    setError(null);
    const res = await fetch(`/api/slots/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Could not cancel slot");
      return;
    }
    setMessage("Slot cancelled.");
    if (editingSlotId === id) setEditingSlotId(null);
    await load();
  }

  const activeHunts = hunts.filter((h) => h.status === "active");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl text-[var(--brand-forest-deep)]">
          Hunts & slots
        </h1>
        <p className="mt-2 text-[var(--brand-ink)]/70">
          Create packages, open calendar capacity, and edit existing hunts or
          slots (price, dates, capacity, status).
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              <Label htmlFor="pricePerGuest">Price / guest</Label>
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
              {activeHunts.map((h) => (
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
            <Input
              id="capacity"
              name="capacity"
              type="number"
              defaultValue={6}
              required
            />
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
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-2xl">Packages</h2>
          <p className="text-sm text-[var(--brand-ink)]/55">
            Tap Edit to change price, capacity, copy, or status.
          </p>
        </div>
        {hunts.length === 0 && !loading ? (
          <p className="text-sm text-[var(--brand-ink)]/60">No hunts yet.</p>
        ) : null}
        {hunts.map((hunt) => {
          const editing = editingHuntId === hunt.id;
          return (
            <div
              key={hunt.id}
              className="border border-[var(--brand-forest)]/10 bg-[var(--brand-cream)]/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{hunt.title}</p>
                  <p className="text-sm text-[var(--brand-ink)]/65">
                    {formatUsd(hunt.pricePerGuest)}/guest · max {hunt.maxGuests}{" "}
                    · {hunt.packageType} · {hunt.durationHours}h
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={hunt.status === "active" ? "default" : "secondary"}
                  >
                    {hunt.status}
                  </Badge>
                  <Button
                    variant={editing ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setEditingHuntId(editing ? null : hunt.id);
                      setEditingSlotId(null);
                    }}
                  >
                    {editing ? "Close" : "Edit"}
                  </Button>
                  {hunt.status === "active" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void cancelHunt(hunt.id)}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </div>
              {editing ? (
                <form
                  onSubmit={(e) => void saveHunt(e, hunt.id)}
                  className="space-y-3 border-t border-[var(--brand-forest)]/10 bg-white/80 p-4"
                >
                  <p className="text-xs tracking-[0.14em] text-[var(--brand-moss)] uppercase">
                    Edit hunt
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor={`hunt-title-${hunt.id}`}>Title</Label>
                    <Input
                      id={`hunt-title-${hunt.id}`}
                      name="title"
                      defaultValue={hunt.title}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hunt-desc-${hunt.id}`}>Description</Label>
                    <Textarea
                      id={`hunt-desc-${hunt.id}`}
                      name="description"
                      defaultValue={hunt.description}
                      required
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`hunt-pkg-${hunt.id}`}>Package type</Label>
                      <select
                        id={`hunt-pkg-${hunt.id}`}
                        name="packageType"
                        defaultValue={hunt.packageType}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                      >
                        <option value="upland">Upland</option>
                        <option value="echo">Echo</option>
                        <option value="clays">Clays</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`hunt-status-${hunt.id}`}>Status</Label>
                      <select
                        id={`hunt-status-${hunt.id}`}
                        name="status"
                        defaultValue={hunt.status}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor={`hunt-hours-${hunt.id}`}>Hours</Label>
                      <Input
                        id={`hunt-hours-${hunt.id}`}
                        name="durationHours"
                        type="number"
                        defaultValue={hunt.durationHours}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`hunt-max-${hunt.id}`}>Max guests</Label>
                      <Input
                        id={`hunt-max-${hunt.id}`}
                        name="maxGuests"
                        type="number"
                        defaultValue={hunt.maxGuests}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`hunt-price-${hunt.id}`}>
                        Price / guest
                      </Label>
                      <Input
                        id={`hunt-price-${hunt.id}`}
                        name="pricePerGuest"
                        type="number"
                        defaultValue={hunt.pricePerGuest}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-[var(--brand-forest)] text-[var(--brand-cream)]"
                    >
                      {saving ? "Saving…" : "Save hunt"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingHuntId(null)}
                    >
                      Discard
                    </Button>
                  </div>
                </form>
              ) : null}
            </div>
          );
        })}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-2xl">Slots</h2>
          <p className="text-sm text-[var(--brand-ink)]/55">
            Tap Edit to change dates, capacity, linked hunt, or status.
          </p>
        </div>
        {slots.length === 0 && !loading ? (
          <p className="text-sm text-[var(--brand-ink)]/60">No slots yet.</p>
        ) : null}
        {slots.map((slot) => {
          const editing = editingSlotId === slot.id;
          return (
            <div
              key={slot.id}
              className="border border-[var(--brand-forest)]/10 bg-[var(--brand-cream)]/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{slot.hunt.title}</p>
                  <p className="text-sm text-[var(--brand-ink)]/65">
                    {format(new Date(slot.startAt), "MMM d, yyyy · h:mm a")} –{" "}
                    {format(new Date(slot.endAt), "h:mm a")} ·{" "}
                    {slot.bookedCount}/{slot.capacity} booked
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{slot.status}</Badge>
                  <Button
                    variant={editing ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setEditingSlotId(editing ? null : slot.id);
                      setEditingHuntId(null);
                    }}
                  >
                    {editing ? "Close" : "Edit"}
                  </Button>
                  {slot.status !== "cancelled" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void cancelSlot(slot.id)}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </div>
              {editing ? (
                <form
                  onSubmit={(e) => void saveSlot(e, slot.id)}
                  className="space-y-3 border-t border-[var(--brand-forest)]/10 bg-white/80 p-4"
                >
                  <p className="text-xs tracking-[0.14em] text-[var(--brand-moss)] uppercase">
                    Edit slot
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor={`slot-hunt-${slot.id}`}>Linked hunt</Label>
                    <select
                      id={`slot-hunt-${slot.id}`}
                      name="huntId"
                      defaultValue={slot.huntId}
                      required
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      {hunts.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.title}
                          {h.status === "cancelled" ? " (cancelled)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`slot-start-${slot.id}`}>Start</Label>
                      <Input
                        id={`slot-start-${slot.id}`}
                        name="startAt"
                        type="datetime-local"
                        defaultValue={toLocalInput(slot.startAt)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`slot-end-${slot.id}`}>End</Label>
                      <Input
                        id={`slot-end-${slot.id}`}
                        name="endAt"
                        type="datetime-local"
                        defaultValue={toLocalInput(slot.endAt)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`slot-cap-${slot.id}`}>Capacity</Label>
                      <Input
                        id={`slot-cap-${slot.id}`}
                        name="capacity"
                        type="number"
                        min={Math.max(1, slot.bookedCount)}
                        defaultValue={slot.capacity}
                        required
                      />
                      <p className="text-xs text-[var(--brand-ink)]/55">
                        {slot.bookedCount} already booked — capacity cannot go
                        below that.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`slot-status-${slot.id}`}>Status</Label>
                      <select
                        id={`slot-status-${slot.id}`}
                        name="status"
                        defaultValue={slot.status}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                      >
                        <option value="open">Open</option>
                        <option value="full">Full</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`slot-notes-${slot.id}`}>Notes</Label>
                    <Input
                      id={`slot-notes-${slot.id}`}
                      name="notes"
                      defaultValue={slot.notes ?? ""}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-[var(--brand-forest)] text-[var(--brand-cream)]"
                    >
                      {saving ? "Saving…" : "Save slot"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingSlotId(null)}
                    >
                      Discard
                    </Button>
                  </div>
                </form>
              ) : null}
            </div>
          );
        })}
      </section>
    </div>
  );
}
