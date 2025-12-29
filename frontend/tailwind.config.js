/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                colombia: {
                    blue: '#0033A0', // Azul oficial oscuro
                    yellow: '#FFCD00', // Amarillo oficial vibrante
                    red: '#CE1126', // Rojo oficial
                    'blue-light': '#4D7DFF',
                    'yellow-light': '#FFE066',
                    'red-light': '#FF6B6B',
                }
            }
        },
    },
    plugins: [],
}