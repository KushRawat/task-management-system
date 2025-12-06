import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Inter", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: "#3b82f6",
        success: "#16a34a",
        danger: "#ef4444",
        neutral: {
          50: "#f7f8fb",
          100: "#eef1f6",
          200: "#e3e7ef",
          300: "#cfd6e4",
          400: "#a7b3c8",
          500: "#7b86a2",
          600: "#5f6785",
          700: "#4c5269",
          800: "#3c4254",
          900: "#2c2f3f",
        },
      },
      boxShadow: {
        card: "0 20px 50px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
