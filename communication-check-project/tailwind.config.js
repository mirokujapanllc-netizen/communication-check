/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F8F5F2",
        rose: "#E96A8D",
        "rose-deep": "#B23A5C",
        ink: "#222222",
        sand: "#EAE3DD",
        sage: "#4C9A6A",
        gold: "#D9A441",
        brick: "#C94F4F",
      },
      fontFamily: {
        display: ["'Shippori Mincho'", "serif"],
        body: ["'Zen Kaku Gothic New'", "sans-serif"],
        hand: ["'Yomogi'", "'Shippori Mincho'", "sans-serif"],
      },
      borderRadius: {
        salon: "16px",
      },
      boxShadow: {
        salon: "0 8px 30px -12px rgba(34,34,34,0.15)",
        "salon-lg": "0 20px 50px -20px rgba(233,106,141,0.35)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
