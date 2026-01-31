// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://cobblemon-conquest.albercl.dev/',
	integrations: [
		starlight({
			title: 'Cobblemon Conquest',
			favicon: '/favicon.ico',
			logo: {
				src: './src/assets/logo.webp',
				alt: 'Cobblemon Conquest Logo',
			},
			defaultLocale: 'root',
			locales: {
				root: { 
					label: 'Español',
					lang: 'es',
				},
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/albercl/cobblemon-conquest' },
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/vWkjZPYGpK' },
			
			],
			sidebar: [
				{
					label: '¿Cómo empezar?',
					autogenerate: { directory: 'getting-started' },
				},
				{
					label: 'FAQ',
					autogenerate: { directory: 'faq' },
				},
			],
		}),
	],
});
