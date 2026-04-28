import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        panel: "hsl(var(--panel))",
        accent: {
          DEFAULT: "#78e8ff",
          warm: "#ffb26b",
          alert: "#ff6b5e"
        }
      },
      boxShadow: {
        panel: "0 20px 60px rgba(4, 12, 24, 0.45)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(120, 232, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(120, 232, 255, 0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;