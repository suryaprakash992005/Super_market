/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '400px',
        '3xl': '1920px',
      },
      colors: {
        brand: {
          crimson: '#C8102E',
          'crimson-dark': '#9E0C24',
          'crimson-light': '#E52D48',
          'crimson-tint': '#FDF2F3',
          'crimson-glow': 'rgba(200, 16, 46, 0.15)',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          warm: '#F7F5F1',
          card: '#FFFFFF',
          subtle: '#FAF8F5',
          border: '#E8E6E2',
          'border-strong': '#D4D0C8',
        },
        obsidian: {
          DEFAULT: '#111111',
          pure: '#000000',
          muted: '#2A2A2A',
        },
        muted: {
          DEFAULT: '#6B6B6B',
          light: '#8C8C8C',
          dark: '#4A4A4A',
        },
        supermarket: {
          fresh: '#1B873F',
          'fresh-tint': '#EDF8F1',
          gold: '#C98A19',
          'gold-tint': '#FEF7E6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(17, 17, 17, 0.04), 0 1px 2px -1px rgba(17, 17, 17, 0.03)',
        'card': '0 4px 16px -2px rgba(17, 17, 17, 0.06), 0 2px 6px -2px rgba(17, 17, 17, 0.04)',
        'elevated': '0 12px 32px -4px rgba(17, 17, 17, 0.08), 0 4px 12px -2px rgba(17, 17, 17, 0.05)',
        'crimson': '0 4px 14px 0 rgba(200, 16, 46, 0.25)',
      },
      borderRadius: {
        'brand': '8px',
        'card': '12px',
      }
    },
  },
  plugins: [],
}
