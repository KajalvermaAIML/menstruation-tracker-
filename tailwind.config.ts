import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FCFCFB",
          100: "#FBFBFA",
          200: "#F4F3F0",
          300: "#EAE7E2",
        },
        rosewood: {
          50: "#FAF3F2",
          100: "#F5E4E2",
          200: "#ECCDC9",
          300: "#DEACA6",
          400: "#CF8B83",
          500: "#C27A72", // Main prompt accent
          600: "#A95E56",
          700: "#8B4740",
          800: "#733B35",
          900: "#60342F",
        },
        terracotta: {
          50: "#FCF4F1",
          100: "#F8E7E0",
          200: "#F2D0C3",
          300: "#E7B29F",
          400: "#D88B71",
          500: "#C86D51",
          600: "#B45236",
          700: "#953F29",
        },
        sage: {
          50: "#F5F8F6",
          100: "#EAF0EC",
          200: "#D7E3DA",
          300: "#B8CFC0",
          400: "#99B9A3",
          500: "#7E9987",
          600: "#647E6D",
          700: "#506557",
        },
        taupe: {
          50: "#F8F7F6",
          100: "#F1EFEB",
          200: "#E4E0D9",
          300: "#CEC7BC",
          400: "#B5AC9F",
          500: "#9C8E84",
          600: "#817268",
          700: "#685B52",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Inter",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out forwards",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "subtlePulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        subtlePulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

