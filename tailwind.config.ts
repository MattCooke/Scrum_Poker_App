import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFCC00',
          'yellow-light': '#FFD733',
          'yellow-dark': '#E6B800',
          black: '#000000',
          'black-light': '#1a1a1a',
          'black-dark': '#000000',
          gray: {
            50: '#F8F9FA',
            100: '#F1F3F5',
            200: '#E9ECEF',
            300: '#DEE2E6',
            400: '#CED4DA',
            500: '#ADB5BD',
            600: '#6C757D',
            700: '#495057',
            800: '#343A40',
            900: '#212529',
          },
        },
        primary: {
          50: '#fffef5',
          100: '#fffce6',
          200: '#fff9cc',
          300: '#fff3a3',
          400: '#ffed73',
          500: '#FFCC00',
          600: '#e6b800',
          700: '#cc9900',
          800: '#b37700',
          900: '#996600',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
