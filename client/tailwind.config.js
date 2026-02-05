/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6', // Bright Blue - Chalk accent
                secondary: '#f59e0b', // Amber - Lantern glow
                accent: '#10b981', // Emerald - Chalk green
                dark: '#020617', // Black Slate - Chalkboard deep base
                light: '#f8fafc', // Slate 50 - Surface text
                surface: '#0f172a', // Slate 900 - Card base
            },
        },
        fontFamily: {
            sans: ['Outfit', 'Inter', 'sans-serif'],
        },
        animation: {
            'blob': 'blob 7s infinite',
            'fade-in': 'fadeIn 0.5s ease-out',
        },
        keyframes: {
            blob: {
                '0%': { transform: 'translate(0px, 0px) scale(1)' },
                '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                '100%': { transform: 'translate(0px, 0px) scale(1)' },
            },
            fadeIn: {
                '0%': { opacity: '0', transform: 'translateY(10px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
            },
        },
    },
    plugins: [],
}
