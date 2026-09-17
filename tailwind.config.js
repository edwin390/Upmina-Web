/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0a0a0a",
          surface: "#141414",
          elevated: "#1e1e1e",
        },
        border: {
          subtle: "#2a2a2a",
          strong: "#3a3a3a",
        },
        accent: {
          primary: "#ff2d95",
          secondary: "#00f0ff",
          live: "#ff0033",
          success: "#00ff88",
          warning: "#ffb800",
        },
        text: {
          primary: "#f5f5f5",
          secondary: "#a0a0a0",
          muted: "#666666",
          inverse: "#0a0a0a",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(255, 45, 149, 0.5)",
        "glow-secondary": "0 0 20px rgba(0, 240, 255, 0.5)",
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(90deg, #ff2d95 0%, #00f0ff 100%)",
      },
    },
  },
  plugins: [],
};
