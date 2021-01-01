// tailwind.config.js
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      quicksand: ["Quicksand, sans-serif"],
    },
    backgroundColor: (theme) => ({
      ...theme("colors"),
      crimson: "#841617",
    }),
    textColor: (theme) => ({
      ...theme("colors"),
      lightGrey: "#707070",
      secondary: "#ffed4a",
      danger: "#e3342f",
    }),
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
