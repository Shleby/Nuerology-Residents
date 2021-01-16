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
      smoothGray: "#212121",
    }),
    textColor: (theme) => ({
      ...theme("colors"),
      lightGrey: "#707070",
      secondary: "#ffed4a",
      danger: "#e3342f",
      crimson: "#841617",
      formred: "#8a6565",
    }),
    extend: {
      backgroundImage: (theme) => ({
        "login-img": "url('/src/assets/background2.jpg')",
        "admin-img": "url('/src/assets/admin-bg.jpg')",
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
