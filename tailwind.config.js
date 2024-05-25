/** @type {import('tailwindcss').Config} */
import pluginDaisyui from 'daisyui'

export default {
  content: ["./index.html", "./src/**/*.{jsx,tsx}"],
  theme: {
    extend: {}
  },
  plugins: [pluginDaisyui]
}

