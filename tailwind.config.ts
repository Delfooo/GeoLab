// tailwind.config.ts
// Configurazione Tailwind CSS

module.exports = {
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0A0A0A', // Nero quasi assoluto
          800: '#171717', // Grigio scuro antracite
          700: '#262626',
        },
        gold: {
          100: '#FDF2D0',
          400: '#FACC15', // Giallo vivo
          500: '#EAB308', // Oro standard
          600: '#CA8A04', // Oro antico
          DEFAULT: '#FFD700', // Gold puro
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FDE68A 0%, #EAB308 50%, #B45309 100%)',
      }
    },
  },
}