import { type Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC", // ice-white
        foreground: "#0b1c30",
        primary: {
          DEFAULT: "#0B132B", // polar-midnight-deep
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#0284C7", // azure
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#E2E8F0",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#0EA5E9",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#ba1a1a",
          foreground: "#ffffff",
        },
        border: "#E2E8F0",
        input: "#CBD5E1",
        ring: "#0EA5E9",
        "draft-bg": "#FEF3C7",
        "draft-border": "#F59E0B",
        "draft-text": "#92400E",
        "verified-bg": "#ECFDF5",
        "verified-text": "#065F46",
        "verified-border": "#A7F3D0",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.125rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
