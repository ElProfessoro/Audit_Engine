import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces (warm cream paper)
        surface: "#fbf9fc",
        "surface-low": "#f5f3f6",
        "surface-container": "#efedf0",
        "surface-high": "#e9e7eb",

        // Text
        "on-surface": "#1b1b1e",
        "on-surface-variant": "#44474e",
        outline: "#75777f",
        "outline-variant": "#c5c6cf",

        // Brand
        primary: "#0f2444",
        "primary-deep": "#000e27",
        "on-primary": "#ffffff",
        "primary-light": "#b4c7ef",

        // Accent (CNIL alert / brick red)
        secondary: "#b02d1d",
        "secondary-bright": "#fd644e",
        "on-secondary": "#ffffff",

        // Status
        success: "#2e7d32",
        warning: "#c97a18",
        "tertiary-warm": "#b08259",

        // Lines
        line: "rgba(15, 36, 68, 0.18)",
        "line-strong": "rgba(15, 36, 68, 0.4)",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      fontSize: {
        // Display (Fraunces)
        "display-xl": ["64px", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "800" }],
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],

        // Body (Manrope)
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],

        // Technical (IBM Plex Mono)
        "tech-md": ["13px", { lineHeight: "1.4", fontWeight: "450" }],
        "tech-sm": ["11px", { lineHeight: "1.4", fontWeight: "450" }],

        // Labels (Manrope all-caps)
        "label-md": ["12px", { lineHeight: "1", letterSpacing: "0.18em", fontWeight: "700" }],
        "label-sm": ["10px", { lineHeight: "1", letterSpacing: "0.18em", fontWeight: "700" }],
      },
      borderRadius: {
        none: "0px",
        DEFAULT: "0px",
        full: "9999px",
      },
      borderWidth: {
        DEFAULT: "0.5px",
        hairline: "0.5px",
        thin: "1px",
      },
      animation: {
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "pulse-soft": "pulse 1.6s ease-in-out infinite",
        "blink": "blink 1s steps(2) infinite",
        "sweep": "sweep 4s linear infinite",
      },
      keyframes: {
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        sweep: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
