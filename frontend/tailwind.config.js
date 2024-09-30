// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Sharpie: ["'Sharpie'", "sans-serif"],
        General: ["'General Sans'", "sans-serif"],
        Author: ["'Author'", "cursive"],
      },
    },
  },
  plugins: [],
}
