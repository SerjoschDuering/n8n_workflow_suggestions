/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html", // Scan the main HTML file
      "./src/**/*.{js,ts,jsx,tsx}", // Scan JS files in src/ for classes (optional for vanilla)
    ],
    theme: {
      extend: {
        colors: {
          // Add indigo color palette for use (e.g., bg-indigo-600, text-indigo-500)
          indigo: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1', // Primary Indigo
            600: '#4f46e5', // Darker Indigo
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
            950: '#1e1b4b',
          },
        }
      },
    },
    plugins: [
      // Optional: Add Tailwind plugins like @tailwindcss/forms for better default form styles
      // require('@tailwindcss/forms'),
    ],
  }