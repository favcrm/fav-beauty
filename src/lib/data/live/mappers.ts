/**
 * Pure mappers: `@favcrm/sdk` response shapes -> local domain types.
 *
 * The storefront's domain types carry presentation fields the API has no
 * source for (notably `hue`, used to tint gradient image plates). Those are
 * derived deterministically from the entity id so a given record always
 * renders the same accent.
 */
import { mapApiEvent } from "@favcrm/sdk";
import type {
  ApiEvent,
  BlogPost as SdkBlogPost,
  BlogPostListItem,
  BookingService,
  Product as SdkProduct,
  ProductListItem,
  PublicMembershipTier,
  ServiceAddon,
  TimeSlot as SdkTimeSlot,
} from "@favcrm/sdk";
import type {
  BlogPost,
  Category,
  MembershipTier,
  Product,
  SalonEvent,
  TimeSlot,
  Treatment,
  TreatmentAddon,
} from "../types";
import { brand } from "../mock/brand";

/**
 * Deterministic hue in [0, 359] from an id, FNV-1a style. No SDK field maps
 * to `hue`, so the same id always yields the same accent.
 */
export function hueFromId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 360;
}

/** Slice an API time (`"10:30:00"` / `"10:30"`) down to `HH:MM`. */
function toHHMM(time: string): string {
  return time.slice(0, 5);
}

type TreatmentCategory = Treatment["category"];

/** Best-effort map of a free-text category label to the beauty enum. */
function treatmentCategory(label: string | null): TreatmentCategory {
  const l = (label ?? "").toLowerCase();
  if (l.includes("hair")) return "hair";
  if (l.includes("nail")) return "nails";
  if (l.includes("lash") || l.includes("brow")) return "lashes";
  if (l.includes("body") || l.includes("massage")) return "body";
  return "body";
}

/** Best-effort map of a shop category label/slug to the retail enum. */
function productCategory(label: string | null, slug: string | null): Category {
  const l = `${label ?? ""} ${slug ?? ""}`.toLowerCase();
  if (l.includes("hair")) return "hair";
  if (l.includes("nail")) return "nails";
  if (l.includes("lash") || l.includes("brow")) return "lashes";
  if (l.includes("body") || l.includes("massage")) return "body";
  if (l.includes("tool") || l.includes("device") || l.includes("accessor"))
    return "tools";
  return "skincare";
}

function mapAddon(addon: ServiceAddon): TreatmentAddon {
  return {
    id: addon.id,
    name: addon.name,
    price: Number(addon.price),
    durationMinutes: addon.durationMinutes,
  };
}

export function mapBookingService(service: BookingService): Treatment {
  return {
    id: service.id,
    slug: service.id,
    name: service.name,
    tagline: service.categoryName ?? "",
    description: service.description ?? "",
    category: treatmentCategory(service.categoryName),
    durationMinutes: service.durationMinutes,
    price: Number(service.price),
    currency: service.currency,
    image: service.coverImage,
    hue: hueFromId(service.id),
    featured: false,
    addons: (service.addons ?? []).map(mapAddon),
    includes: [],
  };
}

export function mapProductListItem(item: ProductListItem): Product {
  const id = String(item.id);
  return {
    id,
    slug: item.slug ?? id,
    name: item.name,
    brand: item.brand?.name ?? "",
    category: productCategory(item.categoryName, item.categorySlug),
    description: item.description ?? "",
    price: item.discountPrice ?? item.price ?? 0,
    currency: brand.currency,
    stock: item.stockStatus === "in_stock" ? 99 : 0,
    image: item.image,
    hue: hueFromId(id),
    featured: item.isFeatured,
  };
}

export function mapProduct(product: SdkProduct): Product {
  const id = String(product.id);
  const primaryCategory = product.categories[0] ?? null;
  return {
    id,
    slug: product.slug ?? id,
    name: product.name,
    brand: product.brand?.name ?? "",
    category: productCategory(
      primaryCategory?.name ?? null,
      primaryCategory?.slug ?? null,
    ),
    description: product.description ?? "",
    price: product.discountPrice ?? product.price ?? 0,
    currency: brand.currency,
    stock: product.stockStatus === "in_stock" ? 99 : 0,
    image:
      product.images.find((img) => img.isPrimary)?.src ??
      product.images[0]?.src ??
      null,
    hue: hueFromId(id),
    featured: product.isFeatured,
  };
}

/** A tier's billing cadence from its price and validity period. */
function tierBilling(tier: PublicMembershipTier): MembershipTier["billing"] {
  if (tier.price === 0) return "free";
  if (tier.validPeriodUnit === "YEARS") return "yearly";
  return "monthly";
}

export function mapMembershipTier(tier: PublicMembershipTier): MembershipTier {
  return {
    id: tier.id,
    name: tier.name,
    blurb: tier.description ?? "",
    price: tier.price,
    currency: brand.currency,
    billing: tierBilling(tier),
    benefits: tier.benefits,
    popular: tier.isPopular,
  };
}

export function mapBlogPostListItem(item: BlogPostListItem): BlogPost {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt ?? "",
    body: "",
    category: item.categories[0]?.name ?? "",
    author: "",
    readMinutes: 4,
    publishedAt: item.publishedAt ?? item.createdAt,
    hue: hueFromId(item.id),
  };
}

export function mapBlogPost(post: SdkBlogPost): BlogPost {
  // The SDK exposes content as `blocks` (a JSON content-block string). There
  // is no plain-text/HTML body field, so we fall back to the excerpt.
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    body: post.excerpt ?? "",
    category: post.categories[0]?.name ?? "",
    author: "",
    readMinutes: 4,
    publishedAt: post.publishedAt ?? post.createdAt,
    hue: hueFromId(post.id),
  };
}

export function mapEvent(apiEvent: ApiEvent): SalonEvent {
  const event = mapApiEvent(apiEvent);
  const start = event.startDate ?? event.dates[0]?.startTime ?? "";
  const startDate = start ? start.slice(0, 10) : "";
  const startTime = start.length > 10 ? toHHMM(start.slice(11)) : "";
  return {
    slug: event.slug,
    title: event.title,
    summary: event.description,
    date: startDate,
    startTime,
    location: event.location ?? "",
    price: event.price,
    currency: event.currency,
    seatsLeft: event.remainingQuota ?? 0,
    hue: hueFromId(event.id),
  };
}

export function mapTimeSlot(slot: SdkTimeSlot): TimeSlot {
  return {
    time: toHHMM(slot.startTime),
    available: slot.available,
  };
}
