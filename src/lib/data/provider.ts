/**
 * Data provider — the single seam between the storefront UI and its data.
 *
 * Demo mode (default): serves the seed data in `./mock`. The template runs and
 * deploys with zero configuration.
 *
 * Live mode (phase 2): when `VITE_FAVCRM_COMPANY_ID` is set the same functions
 * will map `@favcrm/sdk` responses. The UI already depends only on this module,
 * so wiring the SDK is a contained change behind these exports.
 */
import type {
  BrandConfig,
  Category,
  MembershipTier,
  Product,
  Stylist,
  TimeSlot,
  Treatment,
} from "./types";
import { brand } from "./mock/brand";
import { treatments, findTreatment } from "./mock/treatments";
import { stylists, findStylist } from "./mock/stylists";
import { products, findProduct } from "./mock/products";
import { tiers, findTier } from "./mock/tiers";
import {
  posts,
  findPost,
  events,
  findEvent,
  testimonials,
} from "./mock/content";

const LIVE_COMPANY_ID = import.meta.env.VITE_FAVCRM_COMPANY_ID as
  | string
  | undefined;

/** True once a workspace UUID has been supplied via env. */
const workspaceConfigured = Boolean(LIVE_COMPANY_ID && LIVE_COMPANY_ID.trim());

/**
 * Whether the data functions are serving live FavCRM data.
 *
 * Phase 1 ships demo mode only — the `@favcrm/sdk` mapping is not wired yet, so
 * this is always `false`. If a workspace is configured we warn loudly rather
 * than silently serving mock data while pretending to be live.
 */
export function isLiveMode(): boolean {
  if (workspaceConfigured && typeof console !== "undefined") {
    console.warn(
      "[fav-beauty] VITE_FAVCRM_COMPANY_ID is set, but live-mode SDK wiring " +
        "is not yet implemented (phase 2). Still serving demo data.",
    );
  }
  return false;
}

export function getBrand(): BrandConfig {
  return { ...brand, demoMode: !isLiveMode() };
}

/* ── Treatments / booking services ─────────────────────────────── */

export function listTreatments(): Treatment[] {
  return treatments;
}

export function getTreatment(idOrSlug: string): Treatment | undefined {
  return findTreatment(idOrSlug);
}

export function featuredTreatments(): Treatment[] {
  return treatments.filter((t) => t.featured);
}

/* ── Stylists / staff ──────────────────────────────────────────── */

export function listStylists(): Stylist[] {
  return stylists;
}

export function getStylist(id: string): Stylist | undefined {
  return findStylist(id);
}

/* ── Products / retail ─────────────────────────────────────────── */

export function listProducts(opts?: { category?: Category }): Product[] {
  if (opts?.category)
    return products.filter((p) => p.category === opts.category);
  return products;
}

export function getProduct(idOrSlug: string): Product | undefined {
  return findProduct(idOrSlug);
}

export function featuredProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function productCategories(): Category[] {
  return [...new Set(products.map((p) => p.category))];
}

/* ── Membership ────────────────────────────────────────────────── */

export function listTiers(): MembershipTier[] {
  return tiers;
}

export function getTier(id: string): MembershipTier | undefined {
  return findTier(id);
}

/* ── Journal / events / testimonials ───────────────────────────── */

export function listPosts() {
  return posts;
}

export function getPost(slug: string) {
  return findPost(slug);
}

export function listEvents() {
  return events;
}

export function getEvent(slug: string) {
  return findEvent(slug);
}

export function listTestimonials() {
  return testimonials;
}

/* ── Availability ──────────────────────────────────────────────── */

/** Deterministic pseudo-random in [0,1) from a string — keeps slots stable. */
function seeded(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

/**
 * Time slots for a stylist on a date. In demo mode these are generated
 * deterministically so a given day always shows the same availability.
 */
export function getTimeSlots(stylistId: string, dateISO: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = 10; hour < 19; hour++) {
    for (const minute of [0, 30]) {
      const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const roll = seeded(`${stylistId}|${dateISO}|${time}`);
      slots.push({ time, available: roll > 0.42 });
    }
  }
  return slots;
}
