// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// TODO: replace with your real domain before deploying (needed for sitemap/RSS).
const SITE = 'https://example.com';

// https://astro.build/config
export default defineConfig({
	site: SITE,

	// Build-time optimized images; skip provisioning Cloudflare Images binding.
	adapter: cloudflare({ imageService: 'compile' }),

	integrations: [mdx(), sitemap()],

	// Self-hosted, subset and preloaded fonts to prevent FOUT and third-party requests.
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Inter',
			cssVariable: '--font-inter',
			weights: [400, 500, 600],
			subsets: ['latin'],
			styles: ['normal'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Instrument Serif',
			cssVariable: '--font-instrument',
			weights: [400],
			subsets: ['latin'],
			styles: ['normal', 'italic'],
		},
	],

	image: {
		responsiveStyles: true,
		layout: 'constrained',
	},

	build: {
		// Inline small stylesheets instead of paying for a blocking request.
		inlineStylesheets: 'auto',
	},

	vite: {
		plugins: [tailwindcss()],
	},
});
