/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            cream:      "#E3DAC9",
            "cream-50": "#F5F2EC",
            "cream-100":"#EDE8DC",
            "cream-200":"#E3DAC9",
            "cream-300":"#D4C9B0",
            forest:     "#2E4E45",
            "forest-50":"#EBF1EF",
            "forest-100":"#C8DAD6",
            "forest-200":"#8FB5AC",
            "forest-600":"#2E4E45",
            "forest-700":"#253F38",
            "forest-800":"#1C302B",
            "forest-900":"#14231F",
            burgundy:   "#743F36",
            "burgundy-50":"#F5EDEB",
            "burgundy-100":"#E8D0CB",
            "burgundy-200":"#C98A80",
            "burgundy-600":"#743F36",
            "burgundy-700":"#5E342C",
            "burgundy-800":"#4A2922",
            brown:      "#493A2A",
            "brown-50": "#F0EDE8",
            "brown-100":"#D9D0C4",
            "brown-600":"#493A2A",
            "brown-700":"#3A2E21",
            "brown-800":"#2C2318",
          },
        },
      },
    },
    plugins: [],
  }