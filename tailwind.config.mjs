/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFBB00', // JCB Yellow
        secondary: '#1B3C87', // JCB Blue
        dark: '#2A2A2A',     // JCB Dark Gray
        black: '#000000',    // Black
      }
    }
  },
  plugins: [],
}