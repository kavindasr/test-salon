/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F76BC",
        secondary: "#20D353",
        tertiary: "#F7931E",
        "input-border": "#2D3748",
        transparent: "transparent",
        "button-primary": "#7582eb",
        "primary-text": "#EDF2F7",
        "secondary-text": "#A0AEC0",
        theme: {
          light: "#1A1A1A",
          secondary: "#8E8D8A",
          dark: {
            100: "#0D0D0D",
            200: "#181818",
            300: "#222222",
          },
          primary: {
            100: "#6F91AA",
            200: "#42637C",
            300: "#2A4251",
          },
        },
        disable: "#55524D",
        danger: "#CC3333",
        yellow: "#FFD700",
      },
    },
  },
  plugins: [],
};
