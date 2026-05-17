/**
 * Data provider — the single seam between the storefront UI and its data.
 *
 * Demo mode (default): serves the seed data in `./mock`. The template runs and
 * deploys with zero configuration.
 *
 * Live mode: when `VITE_FAVCRM_COMPANY_ID` is set these functions map
 * `@favcrm/sdk` responses for that workspace. The UI depends only on this
 * module, so the demo/live choice is fully contained here.
 *
 * Most data functions are `async` (the SDK is `fetch`-based) and accept an
 * optional `fetchFn` as their last argument so SvelteKit `load` functions can
 * pass `event.fetch`. `getBrand()` and `listTestimonials()` stay synchronous —
 * they have no SDK source and are always served statically.
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
import { isLiveConfigured } from "./config";
import { getClient } from "./live/client";
import {
  hueFromId,
  mapBlogPost,
  mapBlogPostListItem,
  mapBookingService,
  mapEvent,
  mapMembershipTier,
  mapProduct,
  mapProductListItem,
  mapTimeSlot,
} from "./live/mappers";

/** Whether the data functions are serving live FavCRM data. */
export function isLiveMode(): boolean {
  return isLiveConfigured();
}

export function getBrand(): BrandConfig {
  return { ...brand, demoMode: !isLiveMode() };
}

/* ── Treatments / booking services ─────────────────────────────── */

export async function listTreatments(
  fetchFn: typeof fetch = globalThis.fetch,
): Promise<Treatment[]> {
  if (!isLiveConfigured()) return treatments;
  const services = await getClient(fetchFn).bookings.listServices();
  return services.map(mapBookingService);
}

export async function getTreatment(
  idOrSlug: string,
  fetchFn: typeof fetch = globalThis.fetch,
): Promise<Treatment | undefined> {
  if (!isLiveConfigured()) return findTreatment(idOrSlug);
  try {
    const service = await getClient(fetchFn).bookings.getService(idOrSlug);
    return mapBookingService(service);
  } catch {
    return undefined;
  }
}

export async function featuredTreatments(
  fetchFn: typeof fetch = globalThis.fetch,
): Promise<Treatment[]> {
  if (!isLiveConfigured()) return treatments.filter((t) => t.featured);
  return (await listTreatments(fetchFn)).slice(0, 3);
}

/* ── Stylists / staff ──────────────────────────────────────────── */

export async function listStylists(
  fetchFn: typeof fetch = globalThis.fetch,
): Promise<Stylist[]> {
  if (!isLiveConfigured()) return stylists;
  const client = getClient(fetchFn);
  const services = await client.bookings.listServices();
  const staffLists = await Promise.all(
    services.map((s) => client.bookings.getStaff(s.id)),
  );
  const seen = new Map<string, Stylist>();
  for (const staff of staffLists.flat()) {
    if (seen.has(staff.memberId)) continue;
    seen.set(staff.memberId, {
      id: staff.memberId,
      name: staff.memberName,
      title: "Stylist",
      bio: "",
      specialties: [],
      image: null,
      hue: hueFromId(staff.memberId),
    });
  }
  return [...seen.values()];
}

export async function getStylist(
  id: string,
  fetchFn: typeof fetch = globalThis.fetch,
): Promise<Stylist | undefined> {
  if (!isLiveConfigured()) return findStylist(id);
  return (await listStylists(fetchFn)).find((s) => s.id === id);
}

/* ── Products / retail ─────────────────────────────────────────── */

export async function listProducts(
  opts?: { category?: Category },
  fetchFn: typeof fetch = globalThis.fetch,
): Promise<Product[]> {
  if (!isLiveConfigured()) {
    if (opts?.category)
      return products.filter((p) => p.category === opts.category);
    return products;
  }
  const items = await getClient(fetchFn).shop.listProducts();
  const mapped = items.map(mapProductListItem);
  if (opts?.category) return mapped.filter((p) => p.category === opts.category);
  return mapped;
}

export async function getProduct(
  idOrSlug: string,
  fetchFn: typeof fetch = globalThis.fetch,
): Promise<Product | undefined> {
  if (!isLiveConfigured()) return findProduct(idOrSlug);
  try {
    const product = await getClient(fetchFn).shop.getProduct(idOrSlug);
    return mapProduct(product);
  } catch {
    return undefined;
  }
}

export async function featuredProducts(
  fetchFn: typeof fetch = globalThis.fetch,
): Promise<Product[]> {
  if (!isLiveConfigured()) return products.filter((p) => p.featured);
  return (await listProducts(undefined, fetchFn)).filter((p) => p.featured);
}

export async function productCategories(
  fetchFn: typeof fetch = globalThis.fetch,
): Promise<Category[]> {
  if (!isLiveConfigured()) return [...new Set(products.map((p) => p.category))];
  const all = await listProducts(undefined, fetchFn);
  return [...new Set(all.map((p) => p.category))];
}

/* ── Membership ────────────────────────────────────────────────── */

export async function listTiers(
  fetchFn: typeof fetch = globalThis.fetch,
): Promise<MembershipTier[]> {
  if (!isLiveConfigured()) return tiers;
  const list = await getClient(fetchFn).tiers.list();
  return list.map(mapMembershipTier);
}

export async function getTier(
  id: string,
  fetchFn: typeof fetch = globalThis.fetch,
): Promise<MembershipTier | undefined> {
  if (!isLiveConfigured()) return findTier(id);
  return (await listTiers(fetchFn)).find((t) => t.id === id);
}

/* ── Journal / events / testimonials ───────────────────────────── */

export async function listPosts(fetchFn: typeof fetch = globalThis.fetch) {
  if (!isLiveConfigured()) return posts;
  const result = await getClient(fetchFn).blog.list();
  return result.items.map(mapBlogPostListItem);
}

export async function getPost(
  slug: string,
  fetchFn: typeof fetch = globalThis.fetch,
) {
  if (!isLiveConfigured()) return findPost(slug);
  try {
    const post = await getClient(fetchFn).blog.getBySlug(slug);
    return mapBlogPost(post);
  } catch {
    return undefined;
  }
}

export async function listEvents(fetchFn: typeof fetch = globalThis.fetch) {
  if (!isLiveConfigured()) return events;
  const list = await getClient(fetchFn).events.list();
  return list.map(mapEvent);
}

export async function getEvent(
  slug: string,
  fetchFn: typeof fetch = globalThis.fetch,
) {
  if (!isLiveConfigured()) return findEvent(slug);
  try {
    const event = await getClient(fetchFn).events.get(slug);
    return mapEvent(event);
  } catch {
    return undefined;
  }
}

/** Static brand voice — no SDK source, always served from seed data. */
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
 * Time slots for a treatment on a date.
 *
 * In demo mode these are generated deterministically (the `treatmentId` and
 * `stylistId` only seed the pseudo-random roll). In live mode they come from
 * `bookings.getTimeSlots`, optionally scoped to a staff member.
 */
export async function getTimeSlots(
  treatmentId: string,
  dateISO: string,
  stylistId?: string,
  fetchFn: typeof fetch = globalThis.fetch,
): Promise<TimeSlot[]> {
  if (isLiveConfigured()) {
    const response = await getClient(fetchFn).bookings.getTimeSlots(
      treatmentId,
      { date: dateISO, staffId: stylistId },
    );
    return response.slots.map(mapTimeSlot);
  }
  const slots: TimeSlot[] = [];
  const seed = stylistId ?? treatmentId;
  for (let hour = 10; hour < 19; hour++) {
    for (const minute of [0, 30]) {
      const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const roll = seeded(`${seed}|${dateISO}|${time}`);
      slots.push({ time, available: roll > 0.42 });
    }
  }
  return slots;
}
