import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { seedStore } from "./seed";
import type {
  Booking,
  BookingStatus,
  BookingWithDetails,
  Hunt,
  HuntStatus,
  Slot,
  SlotStatus,
  SlotWithHunt,
  StoreData,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");
const isVercel = Boolean(process.env.VERCEL);

type GlobalStore = {
  __hcoStore?: StoreData;
  __hcoStoreReady?: Promise<StoreData>;
};

function g(): GlobalStore {
  return globalThis as unknown as GlobalStore;
}

function cloneSeed(): StoreData {
  return structuredClone(seedStore);
}

async function ensureStore(): Promise<StoreData> {
  const global = g();
  if (global.__hcoStore) return global.__hcoStore;

  if (!global.__hcoStoreReady) {
    global.__hcoStoreReady = (async () => {
      if (!isVercel) {
        try {
          await fs.mkdir(DATA_DIR, { recursive: true });
          const raw = await fs.readFile(STORE_PATH, "utf8");
          const parsed = JSON.parse(raw) as StoreData;
          global.__hcoStore = parsed;
          return parsed;
        } catch {
          const seeded = cloneSeed();
          await fs.mkdir(DATA_DIR, { recursive: true });
          await fs.writeFile(STORE_PATH, JSON.stringify(seeded, null, 2));
          global.__hcoStore = seeded;
          return seeded;
        }
      }

      const seeded = cloneSeed();
      global.__hcoStore = seeded;
      return seeded;
    })();
  }

  return global.__hcoStoreReady;
}

async function persist(store: StoreData): Promise<void> {
  g().__hcoStore = store;
  if (!isVercel) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2));
  }
}

function remaining(slot: Slot): number {
  return Math.max(0, slot.capacity - slot.bookedCount);
}

function syncSlotStatus(slot: Slot): Slot {
  if (slot.status === "cancelled") return slot;
  return {
    ...slot,
    status: remaining(slot) <= 0 ? "full" : "open",
  };
}

function confirmationCode(): string {
  return `HCO-${nanoid(6).replace(/[^a-zA-Z0-9]/g, "X").toUpperCase()}`;
}

export async function listHunts(opts?: {
  includeCancelled?: boolean;
}): Promise<Hunt[]> {
  const store = await ensureStore();
  return store.hunts
    .filter((h) => opts?.includeCancelled || h.status !== "cancelled")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getHunt(id: string): Promise<Hunt | null> {
  const store = await ensureStore();
  return store.hunts.find((h) => h.id === id) ?? null;
}

export async function createHunt(
  input: Omit<Hunt, "id" | "createdAt" | "updatedAt" | "status"> & {
    status?: HuntStatus;
  },
): Promise<Hunt> {
  const store = await ensureStore();
  const now = new Date().toISOString();
  const hunt: Hunt = {
    id: `hunt_${nanoid(8)}`,
    title: input.title,
    description: input.description,
    packageType: input.packageType,
    durationHours: input.durationHours,
    maxGuests: input.maxGuests,
    pricePerGuest: input.pricePerGuest,
    status: input.status ?? "active",
    createdAt: now,
    updatedAt: now,
  };
  store.hunts.push(hunt);
  await persist(store);
  return hunt;
}

export async function updateHunt(
  id: string,
  patch: Partial<Omit<Hunt, "id" | "createdAt">>,
): Promise<Hunt | null> {
  const store = await ensureStore();
  const idx = store.hunts.findIndex((h) => h.id === id);
  if (idx < 0) return null;
  const updated: Hunt = {
    ...store.hunts[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  };
  store.hunts[idx] = updated;
  await persist(store);
  return updated;
}

export async function cancelHunt(id: string): Promise<Hunt | null> {
  const store = await ensureStore();
  const hunt = await updateHunt(id, { status: "cancelled" });
  if (!hunt) return null;
  const now = new Date().toISOString();
  store.slots = store.slots.map((s) =>
    s.huntId === id && s.status !== "cancelled"
      ? { ...s, status: "cancelled", updatedAt: now }
      : s,
  );
  await persist(store);
  return hunt;
}

export async function listSlots(opts?: {
  huntId?: string;
  availableOnly?: boolean;
  includeCancelled?: boolean;
}): Promise<SlotWithHunt[]> {
  const store = await ensureStore();
  const hunts = new Map(store.hunts.map((h) => [h.id, h]));
  return store.slots
    .filter((s) => (opts?.huntId ? s.huntId === opts.huntId : true))
    .filter((s) => opts?.includeCancelled || s.status !== "cancelled")
    .filter((s) => (opts?.availableOnly ? s.status === "open" && remaining(s) > 0 : true))
    .map((s) => {
      const hunt = hunts.get(s.huntId);
      if (!hunt) return null;
      return { ...s, hunt, remaining: remaining(s) };
    })
    .filter((s): s is SlotWithHunt => Boolean(s))
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export async function getSlot(id: string): Promise<SlotWithHunt | null> {
  const store = await ensureStore();
  const slot = store.slots.find((s) => s.id === id);
  if (!slot) return null;
  const hunt = store.hunts.find((h) => h.id === slot.huntId);
  if (!hunt) return null;
  return { ...slot, hunt, remaining: remaining(slot) };
}

export async function createSlot(
  input: Omit<Slot, "id" | "createdAt" | "updatedAt" | "bookedCount" | "status"> & {
    bookedCount?: number;
    status?: SlotStatus;
  },
): Promise<Slot> {
  const store = await ensureStore();
  const hunt = store.hunts.find((h) => h.id === input.huntId);
  if (!hunt || hunt.status === "cancelled") {
    throw new Error("Hunt not found or cancelled");
  }
  const now = new Date().toISOString();
  let slot: Slot = {
    id: `slot_${nanoid(8)}`,
    huntId: input.huntId,
    startAt: input.startAt,
    endAt: input.endAt,
    capacity: input.capacity,
    bookedCount: input.bookedCount ?? 0,
    status: input.status ?? "open",
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  };
  slot = syncSlotStatus(slot);
  store.slots.push(slot);
  await persist(store);
  return slot;
}

export async function updateSlot(
  id: string,
  patch: Partial<Omit<Slot, "id" | "createdAt">>,
): Promise<Slot | null> {
  const store = await ensureStore();
  const idx = store.slots.findIndex((s) => s.id === id);
  if (idx < 0) return null;
  let updated: Slot = {
    ...store.slots[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  };
  updated = syncSlotStatus(updated);
  store.slots[idx] = updated;
  await persist(store);
  return updated;
}

export async function cancelSlot(id: string): Promise<Slot | null> {
  return updateSlot(id, { status: "cancelled" });
}

export async function listBookings(opts?: {
  slotId?: string;
  includeCancelled?: boolean;
}): Promise<BookingWithDetails[]> {
  const store = await ensureStore();
  const slots = new Map(store.slots.map((s) => [s.id, s]));
  const hunts = new Map(store.hunts.map((h) => [h.id, h]));
  return store.bookings
    .filter((b) => (opts?.slotId ? b.slotId === opts.slotId : true))
    .filter((b) => opts?.includeCancelled || b.status !== "cancelled")
    .map((b) => {
      const slot = slots.get(b.slotId);
      const hunt = hunts.get(b.huntId);
      if (!slot || !hunt) return null;
      return { ...b, slot, hunt };
    })
    .filter((b): b is BookingWithDetails => Boolean(b))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getBooking(id: string): Promise<BookingWithDetails | null> {
  const store = await ensureStore();
  const booking = store.bookings.find((b) => b.id === id);
  if (!booking) return null;
  const slot = store.slots.find((s) => s.id === booking.slotId);
  const hunt = store.hunts.find((h) => h.id === booking.huntId);
  if (!slot || !hunt) return null;
  return { ...booking, slot, hunt };
}

export async function createBooking(input: {
  slotId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: number;
  notes?: string;
}): Promise<BookingWithDetails> {
  const store = await ensureStore();
  const slotIdx = store.slots.findIndex((s) => s.id === input.slotId);
  if (slotIdx < 0) throw new Error("Slot not found");
  let slot = store.slots[slotIdx];
  if (slot.status === "cancelled") throw new Error("Slot is cancelled");
  if (remaining(slot) < input.partySize) {
    throw new Error("Not enough capacity remaining on this slot");
  }
  const hunt = store.hunts.find((h) => h.id === slot.huntId);
  if (!hunt || hunt.status === "cancelled") throw new Error("Hunt unavailable");
  if (input.partySize < 1 || input.partySize > hunt.maxGuests) {
    throw new Error(`Party size must be between 1 and ${hunt.maxGuests}`);
  }

  const now = new Date().toISOString();
  const booking: Booking = {
    id: `book_${nanoid(10)}`,
    slotId: slot.id,
    huntId: hunt.id,
    guestName: input.guestName.trim(),
    guestEmail: input.guestEmail.trim().toLowerCase(),
    guestPhone: input.guestPhone.trim(),
    partySize: input.partySize,
    notes: input.notes?.trim() || undefined,
    status: "confirmed",
    confirmationCode: confirmationCode(),
    createdAt: now,
    updatedAt: now,
  };

  slot = syncSlotStatus({
    ...slot,
    bookedCount: slot.bookedCount + input.partySize,
    updatedAt: now,
  });
  store.slots[slotIdx] = slot;
  store.bookings.push(booking);
  await persist(store);
  return { ...booking, slot, hunt };
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<BookingWithDetails | null> {
  const store = await ensureStore();
  const idx = store.bookings.findIndex((b) => b.id === id);
  if (idx < 0) return null;
  const booking = store.bookings[idx];
  if (booking.status === status) return getBooking(id);

  const now = new Date().toISOString();
  const slotIdx = store.slots.findIndex((s) => s.id === booking.slotId);

  if (booking.status === "confirmed" && status === "cancelled" && slotIdx >= 0) {
    let slot = store.slots[slotIdx];
    slot = syncSlotStatus({
      ...slot,
      bookedCount: Math.max(0, slot.bookedCount - booking.partySize),
      updatedAt: now,
    });
    store.slots[slotIdx] = slot;
  }

  if (booking.status === "cancelled" && status === "confirmed" && slotIdx >= 0) {
    let slot = store.slots[slotIdx];
    if (remaining(slot) < booking.partySize) {
      throw new Error("Cannot restore booking; slot lacks capacity");
    }
    slot = syncSlotStatus({
      ...slot,
      bookedCount: slot.bookedCount + booking.partySize,
      updatedAt: now,
    });
    store.slots[slotIdx] = slot;
  }

  store.bookings[idx] = { ...booking, status, updatedAt: now };
  await persist(store);
  return getBooking(id);
}

export async function getStoreSnapshot(): Promise<StoreData> {
  return structuredClone(await ensureStore());
}

export async function resetStore(): Promise<StoreData> {
  const seeded = cloneSeed();
  await persist(seeded);
  return seeded;
}
