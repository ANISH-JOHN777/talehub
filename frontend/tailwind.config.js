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
        'accent-blue': '#4A90E2',
        'accent-purple': '#9B59B6',
        'accent-gold': '#F39C12',
        'accent-teal': '#1ABC9C',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #1A1A1A 0%, #708090 50%, #4A90E2 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FAF3E0 0%, #F5E6D3 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A1A 0%, #2C3E50 100%)',
        'gradient-accent': 'linear-gradient(135deg, #4A90E2 0%, #9B59B6 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F39C12 0%, #E8B71A 100%)',
        'gradient-teal': 'linear-gradient(135deg, #1ABC9C 0%, #16A085 100%)',
      },
      boxShadow: {
        'lg-blur': '0 20px 40px rgba(0, 0, 0, 0.15)',
        'xl-blur': '0 25px 50px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(74, 144, 226, 0.3)',
        'glow-purple': '0 0 20px rgba(155, 89, 182, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(74, 144, 226, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(74, 144, 226, 0.8)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
