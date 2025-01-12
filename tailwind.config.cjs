/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1C76D5",
        gray: {
          bg: "#F0F0F0",
          text: "#5B5B5B",
        },
      },
    },
  },
  plugins: [],
};
