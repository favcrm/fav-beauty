import type { MembershipTier } from "../types";

/** Seed membership tiers — maps to FavCRM `PublicMembershipTier` in live mode. */
export const tiers: MembershipTier[] = [
  {
    id: "tier-essential",
    name: "Essential",
    blurb: "Join the house. Save your details, history and preferences.",
    price: 0,
    currency: "HKD",
    billing: "free",
    popular: false,
    benefits: [
      "Online booking & rescheduling",
      "Treatment history saved",
      "Birthday treatment offer",
      "First access to journal stories",
    ],
  },
  {
    id: "tier-glow",
    name: "Glow",
    blurb:
      "For the regular ritual — a monthly membership that pays for itself.",
    price: 480,
    currency: "HKD",
    billing: "monthly",
    popular: true,
    benefits: [
      "Everything in Essential",
      "10% off all treatments & retail",
      "One LED add-on each month, complimentary",
      "Priority weekend booking windows",
      "Members-only seasonal events",
    ],
  },
  {
    id: "tier-maison",
    name: "Maison",
    blurb:
      "The full atelier membership for those who treat beauty as practice.",
    price: 4800,
    currency: "HKD",
    billing: "yearly",
    popular: false,
    benefits: [
      "Everything in Glow",
      "15% off all treatments & retail",
      "Quarterly signature facial included",
      "Dedicated stylist & annual skin plan",
      "Guest passes for two each year",
    ],
  },
];

export function findTier(id: string): MembershipTier | undefined {
  return tiers.find((t) => t.id === id);
}
