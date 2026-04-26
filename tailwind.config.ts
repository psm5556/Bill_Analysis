import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: "#dc2626",
        warning: "#d97706",
        safe: "#16a34a",
        card: "#1e293b",
        base: "#0f172a",
      },
    },
  },
  plugins: [],
};
export default config;
