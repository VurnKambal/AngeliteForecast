/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#710E1D",

          secondary: "#CC9837",

          accent: "#710E1D",

          neutral: "#0b0b19",

          "base-100": "#f2f2f2",

          info: "#710E1D",

          success: "#710E1D",

          warning: "#f2f2f2",

          error: "#f2f2f2",
        },
      },
      {
        mytheme2: {
          primary: "#9796d5",

          secondary: "#3a3977",

          accent: "#5150c2",

          neutral: "#ebebf6",

          "base-100": "#0b0b19",

          info: "#3a3977",

          success: "#3a3977",

          warning: "#5150c2",

          error: "#ebebf6",
        },
      },
      "light",
      "dark",
      "nord",
      "dracula",
    ],
  },
};
