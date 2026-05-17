import type { Stylist } from "../types";

/** Seed staff / resources for the booking flow. */
export const stylists: Stylist[] = [
  {
    id: "stf-noor",
    name: "Noor Halabi",
    title: "Lead Facialist & Atelier Director",
    bio: "Fifteen years between London and Hong Kong studios. Noor reads skin like a text and is known for calm, methodical treatments.",
    specialties: ["Facials", "Barrier repair", "Skin coaching"],
    image: "/img/stylists/noor.webp",
    hue: 22,
  },
  {
    id: "stf-rui",
    name: "Rui Tanaka",
    title: "Senior Colourist",
    bio: "A painter before a colourist — Rui builds dimensional, lived-in colour and natural grow-out.",
    specialties: ["Balayage", "Tonal colour", "Gloss"],
    image: "/img/stylists/rui.webp",
    hue: 8,
  },
  {
    id: "stf-amara",
    name: "Amara Okonkwo",
    title: "Bodywork & Massage Therapist",
    bio: "Trained in lymphatic and deep-tissue practice, Amara's sessions are equal parts release and restoration.",
    specialties: ["Lymphatic drainage", "Deep tissue", "Pre-natal"],
    image: "/img/stylists/amara.webp",
    hue: 150,
  },
  {
    id: "stf-celine",
    name: "Céline Marchetti",
    title: "Lash & Nail Artist",
    bio: "Detail-obsessed and quietly precise. Céline designs lash and nail work that looks effortless.",
    specialties: ["Lash couture", "Gel artistry", "Brow design"],
    image: "/img/stylists/celine.webp",
    hue: 320,
  },
];

export function findStylist(id: string): Stylist | undefined {
  return stylists.find((s) => s.id === id);
}
