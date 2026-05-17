import type { Booking } from "$lib/data/types";
import { persisted } from "./persisted";

/** Client-side booking history — demo persistence for the booking flow. */
export const bookings = persisted<Booking[]>("lueur.bookings", []);

export function createBooking(
  input: Omit<Booking, "id" | "status" | "createdAt">,
): Booking {
  const booking: Booking = {
    ...input,
    id: `bk-${Date.now().toString(36)}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  bookings.update((list) => [booking, ...list]);
  return booking;
}

export function cancelBooking(id: string) {
  bookings.update((list) =>
    list.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
  );
}
