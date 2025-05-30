/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
import colors from "tailwindcss/colors"
const { themeVariants, prefersLight, prefersDark } = require('tailwindcss-theme-variants');


module.exports = withMT({
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
          primary: {
            DEFAULT: 'var(--color-primary)',
            50: 'var(--color-primary-50)',
            100: 'var(--color-primary-100)',
            200: 'var(--color-primary-200)',
            300: 'var(--color-primary-300)',
            400: 'var(--color-primary-400)',
            500: 'var(--color-primary-500)',
            600: 'var(--color-primary-600)',
            700: 'var(--color-primary-700)',
            800: 'var(--color-primary-800)',
            900: 'var(--color-primary-900)',
          
            950: 'var(--color-primary-950)',
          },
        
        ...colors,
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require("@tailwindcss/typography"),
    // ...
    themeVariants({
      themes: {
        light: {
          mediaQuery: prefersLight, // or "@media (prefers-color-scheme: light)"
        },
        dark: {
          mediaQuery: prefersDark, // or "@media (prefers-color-scheme: dark)"
        },
      },
    }),
  ],
});
