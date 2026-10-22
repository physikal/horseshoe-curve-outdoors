import type { StoreData } from "./types";

function daysFromNow(days: number, hour = 8): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

function endOf(startIso: string, hours: number): string {
  const d = new Date(startIso);
  d.setUTCHours(d.getUTCHours() + hours);
  return d.toISOString();
}

const now = new Date().toISOString();

export const seedStore: StoreData = {
  hunts: [
    {
      id: "hunt_upland",
      title: "Fully Guided Upland Package",
      description:
        "Expert guides, top-notch dogs, and thrilling upland bird hunts across planted and wild cover along the Umatilla River. Includes clay shooting and gourmet meals at Riverview Lodge.",
      packageType: "upland",
      durationHours: 8,
      maxGuests: 6,
      pricePerGuest: 650,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "hunt_echo",
      title: "Echo Lodge Guided Hunt",
      description:
        "A more casual guided hunt from Echo Lodge downriver. Comfortable lodging and flexible pacing for groups who want expert local knowledge without the full Riverview package.",
      packageType: "echo",
      durationHours: 6,
      maxGuests: 8,
      pricePerGuest: 425,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "hunt_clays",
      title: "Clays & Cover Half Day",
      description:
        "Warm up with a round of sporting clays, then step into the cover for a half-day bird hunt. Ideal for introducing new hunters or tightening the team before a full package.",
      packageType: "clays",
      durationHours: 4,
      maxGuests: 10,
      pricePerGuest: 275,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "hunt_custom",
      title: "Custom Echo Non-Guided Day",
      description:
        "Tailor your own day at Echo Lodge with well-stocked lodging and access to cultivated farmland cover. Perfect for experienced groups who know the ground.",
      packageType: "custom",
      durationHours: 8,
      maxGuests: 12,
      pricePerGuest: 195,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ],
  slots: [
    {
      id: "slot_1",
      huntId: "hunt_upland",
      startAt: daysFromNow(7, 7),
      endAt: endOf(daysFromNow(7, 7), 8),
      capacity: 6,
      bookedCount: 2,
      status: "open",
      notes: "Riverview Lodge lodging available",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_2",
      huntId: "hunt_upland",
      startAt: daysFromNow(14, 7),
      endAt: endOf(daysFromNow(14, 7), 8),
      capacity: 6,
      bookedCount: 0,
      status: "open",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_3",
      huntId: "hunt_echo",
      startAt: daysFromNow(5, 8),
      endAt: endOf(daysFromNow(5, 8), 6),
      capacity: 8,
      bookedCount: 3,
      status: "open",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_4",
      huntId: "hunt_echo",
      startAt: daysFromNow(12, 8),
      endAt: endOf(daysFromNow(12, 8), 6),
      capacity: 8,
      bookedCount: 8,
      status: "full",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_5",
      huntId: "hunt_clays",
      startAt: daysFromNow(3, 9),
      endAt: endOf(daysFromNow(3, 9), 4),
      capacity: 10,
      bookedCount: 1,
      status: "open",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_6",
      huntId: "hunt_clays",
      startAt: daysFromNow(10, 9),
      endAt: endOf(daysFromNow(10, 9), 4),
      capacity: 10,
      bookedCount: 0,
      status: "open",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_7",
      huntId: "hunt_custom",
      startAt: daysFromNow(9, 7),
      endAt: endOf(daysFromNow(9, 7), 8),
      capacity: 12,
      bookedCount: 4,
      status: "open",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "slot_8",
      huntId: "hunt_upland",
      startAt: daysFromNow(21, 7),
      endAt: endOf(daysFromNow(21, 7), 8),
      capacity: 4,
      bookedCount: 0,
      status: "open",
      notes: "Small-group exclusive weekend",
      createdAt: now,
      updatedAt: now,
    },
  ],
  bookings: [
    {
      id: "book_demo",
      slotId: "slot_1",
      huntId: "hunt_upland",
      guestName: "Jordan Hale",
      guestEmail: "jordan.hale@example.com",
      guestPhone: "(541) 555-0142",
      partySize: 2,
      notes: "Celebrating a birthday hunt",
      status: "confirmed",
      confirmationCode: "HCO-DEMO01",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "book_demo2",
      slotId: "slot_3",
      huntId: "hunt_echo",
      guestName: "Sam Rivera",
      guestEmail: "sam.rivera@example.com",
      guestPhone: "(541) 555-0198",
      partySize: 3,
      status: "confirmed",
      confirmationCode: "HCO-DEMO02",
      createdAt: now,
      updatedAt: now,
    },
  ],
};
