/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        xs: '0.7rem',    // Reduced from 0.75rem
        sm: '0.8rem',    // Reduced from 0.875rem
        base: '0.9rem',  // Reduced from 1rem
        lg: '1rem',      // Reduced from 1.125rem
        xl: '1.1rem',    // Reduced from 1.25rem
        '2xl': '1.3rem', // Reduced from 1.5rem
        '3xl': '1.6rem', // Reduced from 1.875rem
      },
      spacing: {
        // Smaller padding values for form elements
        '2': '0.375rem',  // Reduced from 0.5rem
        '3': '0.625rem',  // Reduced from 0.75rem
        '4': '0.75rem',   // Reduced from 1rem
        '6': '1rem',      // Reduced from 1.5rem
        '8': '1.25rem',   // Reduced from 2rem
        '12': '2rem',     // Reduced from 3rem
      },
    },
  },
  plugins: [],
} 