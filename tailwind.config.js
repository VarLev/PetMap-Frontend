/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        primary: '#e6d6ff',
      },
      fontFamily:{
        pthin: ['Poppins-Thin', 'sans-serif'],
        pextra: ['Poppins-ExtraLight', 'sans-serif'],
        pbold: ['Poppins-Bold', 'sans-serif'],
        pblack: ['Poppins-Black', 'sans-serif'],
        pmedium: ['Poppins-Medium', 'sans-serif'],
        psemi: ['Poppins-SemiBold', 'sans-serif'],
        plight: ['Poppins-Light', 'sans-serif'],
        pregular: ['Poppins-Regular', 'sans-serif'],
        pextrabold: ['Poppins-ExtraBold', 'sans-serif'],
        nunitoSansRegular: ['NunitoSans_400Regular'],
        nunitoSansBold: ['NunitoSans_700Bold'],
      }
    },
  },
  plugins: [],
}

