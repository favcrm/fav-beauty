import type { Treatment } from "../types";

/** Seed booking services — the beauty equivalent of FavCRM `BookingService`. */
export const treatments: Treatment[] = [
  {
    id: "trt-radiance-facial",
    slug: "radiance-ritual-facial",
    name: "Radiance Ritual Facial",
    tagline: "A 70-minute reset for tired, dimmed skin.",
    description:
      "Our signature facial layers a double cleanse, enzymatic resurfacing and a cooling jade massage to leave skin luminous and calm. Finished with a bespoke serum cocktail chosen for your skin on the day.",
    category: "body",
    durationMinutes: 70,
    price: 1280,
    currency: "HKD",
    image: "/img/treatments/radiance-ritual-facial.webp",
    hue: 18,
    featured: true,
    includes: [
      "Skin reading & consultation",
      "Enzyme resurfacing",
      "Jade lymphatic massage",
      "Bespoke serum finish",
    ],
    addons: [
      {
        id: "add-led",
        name: "LED light therapy",
        price: 280,
        durationMinutes: 15,
      },
      {
        id: "add-eye",
        name: "Cryo eye treatment",
        price: 220,
        durationMinutes: 10,
      },
    ],
  },
  {
    id: "trt-glass-skin",
    slug: "glass-skin-deep-treatment",
    name: "Glass-Skin Deep Treatment",
    tagline: "Intensive hydration and barrier repair.",
    description:
      "A clinical-grade treatment built around layered hyaluronic infusion and a micro-current lift. Designed for dehydrated, reactive skin that needs to be brought back to balance.",
    category: "body",
    durationMinutes: 90,
    price: 1680,
    currency: "HKD",
    image: "/img/treatments/glass-skin-deep-treatment.webp",
    hue: 32,
    featured: true,
    includes: [
      "Barrier diagnostics",
      "Hyaluronic infusion",
      "Micro-current lift",
      "Sheet mask & SPF seal",
    ],
    addons: [
      {
        id: "add-led",
        name: "LED light therapy",
        price: 280,
        durationMinutes: 15,
      },
      {
        id: "add-neck",
        name: "Neck & décolleté extension",
        price: 320,
        durationMinutes: 20,
      },
    ],
  },
  {
    id: "trt-colour-craft",
    slug: "colour-craft-session",
    name: "Colour Craft Session",
    tagline: "Dimensional colour, painted by hand.",
    description:
      "A consultation-led colour service — balayage, gloss or a full tonal shift. Includes a bond-building treatment and a finishing blow-dry so you leave camera-ready.",
    category: "hair",
    durationMinutes: 150,
    price: 2200,
    currency: "HKD",
    image: "/img/treatments/colour-craft-session.webp",
    hue: 8,
    featured: true,
    includes: [
      "Colour consultation",
      "Hand-painted application",
      "Bond treatment",
      "Finishing blow-dry",
    ],
    addons: [
      {
        id: "add-gloss",
        name: "Shine gloss top-up",
        price: 380,
        durationMinutes: 20,
      },
      {
        id: "add-trim",
        name: "Precision trim",
        price: 280,
        durationMinutes: 20,
      },
    ],
  },
  {
    id: "trt-sculpt-massage",
    slug: "contour-sculpt-massage",
    name: "Contour Sculpt Massage",
    tagline: "Deep, draining bodywork that resets posture.",
    description:
      "A 60-minute body treatment combining lymphatic drainage with deep-tissue release across the back, shoulders and legs. Leaves the body lighter and the mind quiet.",
    category: "body",
    durationMinutes: 60,
    price: 980,
    currency: "HKD",
    image: "/img/treatments/contour-sculpt-massage.webp",
    hue: 150,
    featured: false,
    includes: [
      "Posture reading",
      "Lymphatic drainage",
      "Deep-tissue release",
      "Warm oil finish",
    ],
    addons: [
      {
        id: "add-scalp",
        name: "Scalp & temple ritual",
        price: 240,
        durationMinutes: 15,
      },
    ],
  },
  {
    id: "trt-lash-couture",
    slug: "lash-couture-set",
    name: "Lash Couture Set",
    tagline: "A weightless, hand-mapped lash design.",
    description:
      "Individually mapped lash extensions in a wispy, lifted style tailored to your eye shape. Soft enough for everyday, refined enough for the front row.",
    category: "lashes",
    durationMinutes: 110,
    price: 880,
    currency: "HKD",
    image: "/img/treatments/lash-couture-set.webp",
    hue: 280,
    featured: false,
    includes: ["Eye-shape mapping", "Hand-applied extensions", "Aftercare kit"],
    addons: [
      {
        id: "add-tint",
        name: "Brow tint & shape",
        price: 220,
        durationMinutes: 20,
      },
    ],
  },
  {
    id: "trt-atelier-mani",
    slug: "atelier-manicure",
    name: "Atelier Manicure",
    tagline: "Considered nail care, beautifully finished.",
    description:
      "An unhurried manicure with cuticle work, a nourishing hand massage and a flawless gel or natural finish in the season's palette.",
    category: "nails",
    durationMinutes: 55,
    price: 480,
    currency: "HKD",
    image: "/img/treatments/atelier-manicure.webp",
    hue: 340,
    featured: false,
    includes: [
      "Nail shaping",
      "Cuticle ritual",
      "Hand massage",
      "Gel or natural finish",
    ],
    addons: [
      {
        id: "add-paraffin",
        name: "Warm paraffin treatment",
        price: 180,
        durationMinutes: 15,
      },
    ],
  },
];

export function findTreatment(idOrSlug: string): Treatment | undefined {
  return treatments.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
}
