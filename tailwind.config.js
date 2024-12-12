export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    keyframes: {
      slideHorizontalTop: {
        "0%": { transform: "translateX(100%)" },
        "100%": { transform: "translateX(-100%)" },
      },
      slideHorizontalBottom: {
        "0%": { transform: "translateX(-100%)" },
        "100%": { transform: "translateX(100%)" },
      },
    },
    animation: {
      slideHorizontalTop: "slideHorizontalTop 10s linear infinite alternate",
      slideHorizontalBottom:
        "slideHorizontalBottom 10s linear infinite alternate",
    },
  },
};
export const plugins = [];
