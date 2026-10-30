/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.html",
    "./public/js/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bgLight: '#F8FAFC',
        cardLight: '#FFFFFF',
        cardHover: '#FAFAFA',
        borderLight: '#E2E8F0',
        brandRed: '#DC2626',
        brandRedHover: '#B91C1C',
        brandRedSoft: '#FEF2F2',
        brandRose: '#E11D48',
        textMain: '#0F172A',
        textMuted: '#64748B'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      animation: {
        'name-fade': 'nameFade 4.5s ease-in-out infinite'
      },
      keyframes: {
        nameFade: {
          '0%, 75%': { opacity: '1', filter: 'blur(0px)', transform: 'translateY(0)' },
          '82%': { opacity: '0.2', filter: 'blur(4px)', transform: 'translateY(-4px)' },
          '88%': { opacity: '0.2', filter: 'blur(4px)', transform: 'translateY(4px)' },
          '95%, 100%': { opacity: '1', filter: 'blur(0px)', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
}
