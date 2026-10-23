import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#030032",
        "royal-navy": "#17145B",
        "royal-purple": "#292078",
        "electric-blue": "#0799E8",
        "electric-dark": "#0682C5",
        "ice-blue": "#E7F1FC",
        "cool-mist": "#F2F7FC",
        "accent-navy": "#171542",
        "text-subtle": "#474650",
        primary: "#030032",
        secondary: "#0799E8",
        "secondary-fixed": "#cde5ff",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(23, 20, 91, 0.08)",
        "glass-hover": "0 14px 40px -4px rgba(7, 153, 232, 0.22)",
        "glass-dark": "0 16px 40px 0 rgba(3, 0, 50, 0.45)",
        glow: "0 0 24px -2px rgba(7, 153, 232, 0.45)",
        luminous: "0 10px 30px -5px rgba(7, 153, 232, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
