const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ["var(--font-space-grotest)", ...fontFamily.sans],
        inter: ["var(--font-inter)", ...fontFamily.sans],
        outfit: ["var(--font-outfit)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
