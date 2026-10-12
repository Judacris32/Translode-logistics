import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#060E24",
          900: "#0A1633",
          800: "#0F2147",
          700: "#16306B",
        },
        brand: {
          700: "#14349A",
          600: "#1B45C4",
          500: "#2F5FE3",
          200: "#C9D6F8",
          100: "#E4EBFC",
          50: "#F1F5FE",
        },
        amber: {
          DEFAULT: "#FDB515",
          600: "#E89B00",
          700: "#B97700",
          100: "#FFF0C7",
          50: "#FFF8E3",
        },
        mist: "#F3F6FB",
        line: "#E2E8F2",
        ink: "#0B1530",
        slate: "#55627D",
        good: { DEFAULT: "#12794A", 50: "#E6F7EE", 200: "#B5E5CB" },
        bad: { DEFAULT: "#BC2F26", 50: "#FDECEA", 200: "#F5C4BF" },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      maxWidth: { page: "75rem" },
      boxShadow: {
        card: "0 1px 2px rgba(10,22,51,0.04), 0 12px 32px -12px rgba(10,22,51,0.14)",
        lift: "0 2px 4px rgba(10,22,51,0.05), 0 28px 60px -20px rgba(10,22,51,0.28)",
        amber: "0 10px 24px -10px rgba(232,155,0,0.65)",
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};

export default config;
