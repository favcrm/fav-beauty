import type { BrandConfig } from "../types";

/**
 * Brand / company profile. In live mode this is replaced by the FavCRM
 * workspace profile; agencies edit this file to rebrand the template.
 */
export const brand: BrandConfig = {
  name: "Lueur",
  tagline: "Beauty Atelier",
  legalName: "Lueur Atelier Ltd.",
  email: "atelier@lueur.example",
  phone: "+852 3000 2200",
  address: "11F, The Conservatory, 8 Pottinger Street",
  city: "Central, Hong Kong",
  currency: "HKD",
  demoMode: true,
  hours: [
    { day: "Tuesday — Friday", range: "10:00 — 20:00" },
    { day: "Saturday", range: "09:00 — 19:00" },
    { day: "Sunday", range: "10:00 — 17:00" },
    { day: "Monday", range: "Closed" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Threads", href: "https://threads.net" },
    { label: "Pinterest", href: "https://pinterest.com" },
  ],
};
