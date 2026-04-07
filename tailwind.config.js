/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aps: {
          50:  '#e6ecf7',
          100: '#c0cfec',
          200: '#97b0e0',
          300: '#6d91d4',
          400: '#4f79cc',
          500: '#3062c4',
          600: '#003087',   // Oscaro-style deep blue (main brand)
          700: '#002570',
          800: '#001a58',
          900: '#000f3a',
        },
        accent: {
          400: '#ff8533',
          500: '#ff6a00',   // Oscaro-style orange CTA
          600: '#e55c00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
