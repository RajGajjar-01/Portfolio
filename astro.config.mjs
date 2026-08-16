// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// TODO: replace with your real domain before deploying.
// Sitemap and RSS need an absolute URL to emit correct links.
const SITE = 'https://example.com';

// https://astro.build/config
export default defineConfig({
	site: SITE,

	adapter: cloudflare(),

	integrations: [mdx(), sitemap()],

	// Self-hosted, subset and preloaded at build time. No third-party font request,
	// no FOUT, no layout shift.
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
