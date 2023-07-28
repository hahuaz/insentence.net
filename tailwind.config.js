/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial", "ui-sans-serif", "system-ui"],
        display: ["Comfortaa", "ui-sans-serif", "system-ui"],
        serif: ["ui-serif", "Georgia"],
      },
      colors: {
        ["cgray"]: "#4a4a4a",

        ["cblack_light"]: "#323232",

        ["cyellow"]: "#ffdb85",
        ["cyellow-bold"]: "#ffbe0b",

        ["corange"]: "#ff8673",
        ["corange-bold"]: "#fb5607",

        ["cblue"]: "#4d99ff",
        ["cblue-bold"]: "#3a0ca3",

        ["cpurple-bold"]: "#7209b7",
      },
    },
  },
  plugins: [],
};
