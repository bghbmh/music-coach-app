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
					dark: '#121418',
					card: '#1e2229',
					accent: '#10b981',
				}
			}
		},
	},
	plugins: [],
}