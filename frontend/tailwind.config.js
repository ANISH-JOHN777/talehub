/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-gray': '#708090',
        'warm-cream': '#FAF3E0',
        'soft-black': '#1A1A1A',
      },
    },
  },
  plugins: [],
}
