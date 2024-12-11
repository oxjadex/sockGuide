// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // 소스 파일 경로가 정확한지 확인
  theme: {
    extend: {
      keyframes: {
        slideHorizontalTop: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        slideHorizontalBottom: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        slideHorizontalTop: "slideHorizontalTop 5s linear infinite alternate",
        slideHorizontalBottom:
          "slideHorizontalBottom 5s linear infinite alternate",
      },
    },
  },
  plugins: [],
};
