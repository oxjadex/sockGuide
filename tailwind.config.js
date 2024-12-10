/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "slide-horizontal": "slideHorizontal 10s linear infinite",
      },
      keyframes: {
        slideHorizontal: {
          "0%": { transform: "translateX(100%)" },
          "50%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
