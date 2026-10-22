export type HuntPackage = "upland" | "echo" | "clays" | "custom";
export type HuntStatus = "active" | "cancelled";
export type SlotStatus = "open" | "full" | "cancelled";
export type BookingStatus = "confirmed" | "cancelled";

export interface Hunt {
  id: string;
  title: string;
  description: string;
  packageType: HuntPackage;
  durationHours: number;
  maxGuests: number;
  pricePerGuest: number;
  status: HuntStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  id: string;
  huntId: string;
  startAt: string;
  endAt: string;
  capacity: number;
  bookedCount: number;
  status: SlotStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  slotId: string;
  huntId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: number;
  notes?: string;
  status: BookingStatus;
  confirmationCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreData {
  hunts: Hunt[];
  slots: Slot[];
  bookings: Booking[];
}

export interface SlotWithHunt extends Slot {
  hunt: Hunt;
  remaining: number;
}

export interface BookingWithDetails extends Booking {
  slot: Slot;
  hunt: Hunt;
}
