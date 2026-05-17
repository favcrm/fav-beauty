import { derived } from "svelte/store";
import type { CartLine, Product } from "$lib/data/types";
import { persisted } from "./persisted";

export const cart = persisted<CartLine[]>("lueur.cart", []);

export function addToCart(product: Product, quantity = 1) {
  cart.update((lines) => {
    const existing = lines.find((l) => l.productId === product.id);
    if (existing) {
      return lines.map((l) =>
        l.productId === product.id
          ? { ...l, quantity: Math.min(l.quantity + quantity, product.stock) }
          : l,
      );
    }
    return [
      ...lines,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        hue: product.hue,
        image: product.image,
        quantity,
      },
    ];
  });
}

export function setQuantity(productId: string, quantity: number) {
  cart.update((lines) =>
    quantity <= 0
      ? lines.filter((l) => l.productId !== productId)
      : lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
  );
}

export function removeFromCart(productId: string) {
  cart.update((lines) => lines.filter((l) => l.productId !== productId));
}

export function clearCart() {
  cart.set([]);
}

export const cartCount = derived(cart, ($cart) =>
  $cart.reduce((sum, l) => sum + l.quantity, 0),
);

export const cartTotal = derived(cart, ($cart) =>
  $cart.reduce((sum, l) => sum + l.price * l.quantity, 0),
);
