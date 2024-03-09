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

				'fondo': '#e2e2e2',
				'textos': '#1b1b1b',
				'barra': '#fa3086',
				'input-fondo': '#b98895',
				'input-texto': '#805d66',
				'boton-fondo': '#f22c7a',
				'boton-texto': '#ffffff',
				'sandwich': '#312233',
				

			},
		},
	},
	plugins: [],
}
