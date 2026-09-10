/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 公式ブランドカラー（クラシックハワイ×ラグジュアリー）
        cream: "#F5F0E4",       // 背景：白ではなく温かみのあるアイボリーサンド
        rose: "#FF8DA1",        // Plumeria Pink（メインアクセント）
        "rose-deep": "#D9536F", // Plumeria Pink（濃・ホバー用）
        ink: "#111111",         // Deep Black
        sand: "#E6DCC3",        // ボーダー・区切り（温かみのあるサンドベージュ）
        ocean: "#44C1BE",       // Ocean Blue
        purple: "#B48BC7",      // Hawaiian Purple
        sage: "#4C9A6A",
        gold: "#C9A66B",        // ラグジュアリーゴールド
        brick: "#C94F4F",
      },
      fontFamily: {
        display: ["'Shippori Mincho'", "serif"],
        body: ["'Zen Kaku Gothic New'", "sans-serif"],
        hand: ["'Zen Kurenaido'", "'Shippori Mincho'", "sans-serif"],
      },
      borderRadius: {
        salon: "16px",
      },
      boxShadow: {
        salon: "0 8px 30px -12px rgba(17,17,17,0.15)",
        "salon-lg": "0 20px 50px -20px rgba(255,141,161,0.35)",
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
