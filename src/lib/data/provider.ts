/**
 * Data provider — the single seam between the storefront UI and its data.
 *
 * Demo mode (default): serves the seed data in `./mock`. The template runs and
 * deploys with zero configuration.
 *
 * Live mode: when a workspace is available — resolved from the deployment's
 * hostname, or from `VITE_FAVCRM_COMPANY_ID` as a fallback — these functions
 * map `@favcrm/sdk` responses for that workspace. The UI depends only on this
 * module, so the demo/live choice is fully contained here.
 *
 * Most data functions are `async` (the SDK is `fetch`-based) and accept an
 * optional `ProviderContext` as their last argument. `load` functions pass
 * `{ fetch, companyId }` so requests correlate with the render and target the
 * resolved workspace. `getBrand()` and `listTestimonials()` stay synchronous —
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
import { isLive, type ProviderContext } from "./config";
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

/** Whether the data functions are serving live FavCRM data for this request. */
export function isLiveMode(ctx?: ProviderContext): boolean {
  return isLive(ctx);
}

export function getBrand(ctx?: ProviderContext): BrandConfig {
  return { ...brand, demoMode: !isLive(ctx) };
}

/* ── Treatments / booking services ─────────────────────────────── */

export async function listTreatments(
  ctx?: ProviderContext,
): Promise<Treatment[]> {
  if (!isLive(ctx)) return treatments;
  const services = await getClient(ctx).bookings.listServices();
  return services.map(mapBookingService);
}

export async function getTreatment(
  idOrSlug: string,
  ctx?: ProviderContext,
): Promise<Treatment | undefined> {
  if (!isLive(ctx)) return findTreatment(idOrSlug);
  try {
    const service = await getClient(ctx).bookings.getService(idOrSlug);
    return mapBookingService(service);
  } catch {
    return undefined;
  }
}

export async function featuredTreatments(
  ctx?: ProviderContext,
): Promise<Treatment[]> {
  if (!isLive(ctx)) return treatments.filter((t) => t.featured);
  return (await listTreatments(ctx)).slice(0, 3);
}

/* ── Stylists / staff ──────────────────────────────────────────── */

export async function listStylists(ctx?: ProviderContext): Promise<Stylist[]> {
  if (!isLive(ctx)) return stylists;
  const client = getClient(ctx);
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
  ctx?: ProviderContext,
): Promise<Stylist | undefined> {
  if (!isLive(ctx)) return findStylist(id);
  return (await listStylists(ctx)).find((s) => s.id === id);
}

/* ── Products / retail ─────────────────────────────────────────── */

export async function listProducts(
  opts?: { category?: Category },
  ctx?: ProviderContext,
): Promise<Product[]> {
  if (!isLive(ctx)) {
    if (opts?.category)
      return products.filter((p) => p.category === opts.category);
    return products;
  }
  const items = await getClient(ctx).shop.listProducts();
  const mapped = items.map(mapProductListItem);
  if (opts?.category) return mapped.filter((p) => p.category === opts.category);
  return mapped;
}

export async function getProduct(
  idOrSlug: string,
  ctx?: ProviderContext,
): Promise<Product | undefined> {
  if (!isLive(ctx)) return findProduct(idOrSlug);
  try {
    const product = await getClient(ctx).shop.getProduct(idOrSlug);
    return mapProduct(product);
  } catch {
    return undefined;
  }
}

export async function featuredProducts(
  ctx?: ProviderContext,
): Promise<Product[]> {
  if (!isLive(ctx)) return products.filter((p) => p.featured);
  return (await listProducts(undefined, ctx)).filter((p) => p.featured);
}

export async function productCategories(
  ctx?: ProviderContext,
): Promise<Category[]> {
  if (!isLive(ctx)) return [...new Set(products.map((p) => p.category))];
  const all = await listProducts(undefined, ctx);
  return [...new Set(all.map((p) => p.category))];
}

/* ── Membership ────────────────────────────────────────────────── */

export async function listTiers(
  ctx?: ProviderContext,
): Promise<MembershipTier[]> {
  if (!isLive(ctx)) return tiers;
  const list = await getClient(ctx).tiers.list();
  return list.map(mapMembershipTier);
}

export async function getTier(
  id: string,
  ctx?: ProviderContext,
): Promise<MembershipTier | undefined> {
  if (!isLive(ctx)) return findTier(id);
  return (await listTiers(ctx)).find((t) => t.id === id);
}

/* ── Journal / events / testimonials ───────────────────────────── */

export async function listPosts(ctx?: ProviderContext) {
  if (!isLive(ctx)) return posts;
  const result = await getClient(ctx).blog.list();
  return result.items.map(mapBlogPostListItem);
}

export async function getPost(slug: string, ctx?: ProviderContext) {
  if (!isLive(ctx)) return findPost(slug);
  try {
    const post = await getClient(ctx).blog.getBySlug(slug);
    return mapBlogPost(post);
  } catch {
    return undefined;
  }
}

export async function listEvents(ctx?: ProviderContext) {
  if (!isLive(ctx)) return events;
  const list = await getClient(ctx).events.list();
  return list.map(mapEvent);
}

export async function getEvent(slug: string, ctx?: ProviderContext) {
  if (!isLive(ctx)) return findEvent(slug);
  try {
    const event = await getClient(ctx).events.get(slug);
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
  ctx?: ProviderContext,
): Promise<TimeSlot[]> {
  if (isLive(ctx)) {
    const response = await getClient(ctx).bookings.getTimeSlots(treatmentId, {
      date: dateISO,
      staffId: stylistId,
    });
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
