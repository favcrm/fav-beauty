/**
 * Domain types for the fav-beauty template.
 *
 * These mirror the shapes the storefront pages consume. The data provider
 * (`provider.ts`) returns them either from seed data (demo mode) or by mapping
 * `@favcrm/sdk` responses (live mode) — so pages never care which is active.
 */

export type Money = {
  amount: number;
  currency: string;
};

export type Category =
  | "skincare"
  | "hair"
  | "body"
  | "nails"
  | "lashes"
  | "tools";

export type Treatment = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: Exclude<Category, "tools" | "skincare">;
  durationMinutes: number;
  price: number;
  currency: string;
  image: string | null;
  /** soft accent hue (0-360) used by the gradient image plate */
  hue: number;
  featured: boolean;
  addons: TreatmentAddon[];
  includes: string[];
};

export type TreatmentAddon = {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
};

export type Stylist = {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  image: string | null;
  hue: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  description: string;
  price: number;
  currency: string;
  stock: number;
  image: string | null;
  hue: number;
  featured: boolean;
};

export type MembershipTier = {
  id: string;
  name: string;
  blurb: string;
  price: number;
  currency: string;
  billing: "free" | "monthly" | "yearly";
  benefits: string[];
  popular: boolean;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  readMinutes: number;
  publishedAt: string;
  hue: number;
};

export type SalonEvent = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  startTime: string;
  location: string;
  price: number;
  currency: string;
  seatsLeft: number;
  hue: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  detail: string;
};

export type TimeSlot = {
  time: string; // "10:30"
  available: boolean;
};

export type Booking = {
  id: string;
  treatmentId: string;
  treatmentName: string;
  stylistId: string;
  stylistName: string;
  date: string; // ISO date
  time: string;
  addonIds: string[];
  total: number;
  currency: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes: string;
  status: "confirmed" | "completed" | "cancelled";
  createdAt: string;
};

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  currency: string;
  hue: number;
  image: string | null;
  quantity: number;
};

export type BrandConfig = {
  name: string;
  tagline: string;
  legalName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  hours: { day: string; range: string }[];
  social: { label: string; href: string }[];
  currency: string;
  demoMode: boolean;
};
