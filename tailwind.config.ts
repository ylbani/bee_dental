import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00685f",
          container: "#008378",
          fixed: "#89f5e7",
          "fixed-dim": "#6bd8cb",
        },
        secondary: {
          DEFAULT: "#565e74",
          container: "#dae2fd",
          fixed: "#dae2fd",
        },
        tertiary: {
          DEFAULT: "#8d4b00",
          container: "#b15f00",
          fixed: "#ffdcc3",
        },
        surface: {
          DEFAULT: "#f8f9ff",
          dim: "#cbdbf5",
          container: "#e5eeff",
          "container-low": "#eff4ff",
          "container-lowest": "#ffffff",
          "container-high": "#dce9ff",
          "container-highest": "#d3e4fe",
        },
        "on-surface": "#0b1c30",
        "on-surface-variant": "#3d4947",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

