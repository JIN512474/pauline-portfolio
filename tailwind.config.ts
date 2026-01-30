import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      letterSpacing: {
        wide2: "0.18em",
      },
      boxShadow: {
        soft: "0 18px 70px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
