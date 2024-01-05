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
      colors: {
        'primary': '#d40d9a',
        'secondary': 'rgb(146, 212, 59)',
      },
      backgroundColor: {
        'custom-green': 'rgb(146, 212, 59)',
        'custom-pink': '#d40d9a',
        'custom-pink-hover': '#a00a7c',
      },
    },
  },
  plugins: [],
}
