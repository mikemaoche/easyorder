/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  safelist: [
    {
      pattern: /bg-.+-\d+/, // Matches bg-color-shade classes
    },
    {
      pattern: /border-.+-\d+/, // Matches border-color-shade classes
    },
    {
      pattern: /text-.+-\d+/, // Matches text-color-shade classes
    },
  ],
  plugins: [],
}
