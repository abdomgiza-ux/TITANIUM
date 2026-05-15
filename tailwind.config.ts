import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        titanium: {
          50: "#f4f7fb",
          100: "#dfe7f1",
          200: "#b4c3d5",
          300: "#8497ad",
          400: "#536273",
          500: "#333c48",
          600: "#242b35",
          700: "#171d25",
          800: "#0f141b",
          900: "#080b10",
          950: "#030508"
        },
        electric: {
          300: "#7bd9ff",
          400: "#36c4ff",
          500: "#009dff",
          600: "#0070d8"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 45px rgba(0, 157, 255, 0.26)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 20% 10%, rgba(0,157,255,.22), transparent 34%), radial-gradient(circle at 82% 20%, rgba(123,217,255,.16), transparent 28%), linear-gradient(180deg, #030508 0%, #080b10 45%, #0f141b 100%)"
      }
    }
  },
  plugins: []
};

export default config;
