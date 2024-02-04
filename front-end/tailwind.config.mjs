/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'silver': '#C2C1C2',
				'white-smoke': '#F5F5F5',
				'oxford-blue':'#0A1128',
				'indigo-dye':'#034078',
				'carulean-blue':'#1282A2',
				'syracuse-orange':'#D65108',
			},
		},
	},
	plugins: [],
}
