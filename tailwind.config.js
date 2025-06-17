/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.rtl\\:text-right': {
          '[dir="rtl"] &': {
            'text-align': 'right',
          },
        },
        '.rtl\\:text-left': {
          '[dir="rtl"] &': {
            'text-align': 'left',
          },
        },
        '.ltr\\:text-left': {
          '[dir="ltr"] &': {
            'text-align': 'left',
          },
        },
        '.ltr\\:text-right': {
          '[dir="ltr"] &': {
            'text-align': 'right',
          },
        },
        '.rtl\\:flex-row-reverse': {
          '[dir="rtl"] &': {
            'flex-direction': 'row-reverse',
          },
        },
        '.ltr\\:flex-row': {
          '[dir="ltr"] &': {
            'flex-direction': 'row',
          },
        },
        '.rtl\\:left-0': {
          '[dir="rtl"] &': {
            'left': '0',
            'right': 'auto',
          },
        },
        '.ltr\\:right-0': {
          '[dir="ltr"] &': {
            'right': '0',
            'left': 'auto',
          },
        },
        '.rtl\\:mr-2': {
          '[dir="rtl"] &': {
            'margin-right': '0.5rem',
            'margin-left': '0',
          },
        },
        '.rtl\\:ml-2': {
          '[dir="rtl"] &': {
            'margin-left': '0.5rem',
            'margin-right': '0',
          },
        },
        '.ltr\\:mr-2': {
          '[dir="ltr"] &': {
            'margin-right': '0.5rem',
            'margin-left': '0',
          },
        },
        '.ltr\\:ml-2': {
          '[dir="ltr"] &': {
            'margin-left': '0.5rem',
            'margin-right': '0',
          },
        },
      }
      
      addUtilities(newUtilities)
    },
  ],
}
