/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { 
        'dark-purple': "#1F164D",
        'purple': "#7E5F9B",
        'light-purple': "#BEA1DA",
        'lightest-purple': "#F0E2FC",
        'cream': "#FFF7EC",
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'josefin': ['Josefin Sans', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

