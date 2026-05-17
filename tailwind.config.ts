import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        bone: "var(--bone)",
        shell: "var(--shell)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-faint": "var(--ink-faint)",
        clay: "var(--clay)",
        blush: "var(--blush)",
        rose: "var(--rose)",
        accent: "var(--accent)",
        "accent-deep": "var(--accent-deep)",
        gilt: "var(--gilt)",
        line: "var(--line)",
      },
      fontFamily: {
        display: ['"Cormorant"', "Georgia", "serif"],
        sans: ['"Hanken Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(3.2rem, 9vw, 7.5rem)",
          { lineHeight: "0.98", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2.6rem, 6vw, 5rem)",
          { lineHeight: "1.02", letterSpacing: "-0.015em" },
        ],
        "display-md": [
          "clamp(2rem, 4vw, 3.2rem)",
          { lineHeight: "1.08", letterSpacing: "-0.01em" },
        ],
      },
      letterSpacing: {
        eyebrow: "0.34em",
        wide: "0.18em",
      },
      maxWidth: {
        shell: "82rem",
      },
      borderRadius: {
        petal: "1.5rem",
        bloom: "2.25rem",
      },
      boxShadow: {
        soft: "0 26px 60px -34px rgba(110, 47, 60, 0.4)",
        lift: "0 40px 90px -44px rgba(110, 47, 60, 0.5)",
        glow: "0 18px 44px -20px rgba(158, 74, 85, 0.5)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.9s var(--ease) both",
        "fade-in": "fade-in 1.1s ease both",
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [forms],
} satisfies Config;
