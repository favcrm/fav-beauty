import type { CartLine } from "$lib/data/types";
import { persisted } from "./persisted";

export type Order = {
  id: string;
  lines: CartLine[];
  total: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  placedAt: string;
};

/** Client-side order history — demo persistence for the checkout flow. */
export const orders = persisted<Order[]>("lueur.orders", []);

export function placeOrder(input: Omit<Order, "id" | "placedAt">): Order {
  const order: Order = {
    ...input,
    id: `LR-${Date.now().toString(36).toUpperCase()}`,
    placedAt: new Date().toISOString(),
  };
  orders.update((list) => [order, ...list]);
  return order;
}
