// @ts-check
import { defineConfig, envField } from 'astro/config';
import starlight from '@astrojs/starlight';
import { loadEnv } from "vite";

const env = loadEnv(process.env.PUBLIC_GITHUB_REPO || '', process.cwd(), "");
const { PUBLIC_GITHUB_REPO, PUBLIC_DISCORD_LINK } = env;

// https://astro.build/config
export default defineConfig({
	site: 'https://cobblemon-conquest.albercl.dev/',
	env: {
		schema: {
			PUBLIC_DISCORD_LINK: envField.string({ context: 'client', access: 'public' }),
			PUBLIC_GITHUB_REPO: envField.string({ context: 'client', access: 'public' }),
			PUBLIC_RELEASE_VERSION: envField.string({ context: 'client', access: 'public' }),
			PUBLIC_GITHUB_RELEASE_URL: envField.string({ context: 'client', access: 'public', default: PUBLIC_GITHUB_REPO + '/releases/tag/' + env.PUBLIC_RELEASE_VERSION }),
		}
	},
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
				{ icon: 'github', label: 'GitHub', href: PUBLIC_GITHUB_REPO },
				{ icon: 'discord', label: 'Discord', href: PUBLIC_DISCORD_LINK },
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
