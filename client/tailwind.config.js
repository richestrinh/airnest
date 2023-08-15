/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F5385D',
        darkPrimary: '#D60B32',
      },
      keyframes: {
        dropIn: {
          '0%': {
            transform: 'rotate(-3deg) translateY(-100%)',
            opacity: 0
          },
          '100%': {
            transform: 'rotate(0deg) translateY(0%)',
            opacity: 1
          },
        },
      },
      animation: {
        dropIn: 'dropIn 1s',
      },
    },
  },
  plugins: [],
}

