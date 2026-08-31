// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import { site } from './src/data/site';

// https://astro.build/config
export default defineConfig({
	// One origin, defined in src/data/site.ts, so canonicals, OG urls, the
	// sitemap and RSS can never drift apart.
	site: site.url,

	// Head start on soft navigation: hover/focus fires the fetch before the
	// click lands, so ClientRouter swaps land near-instantly. Nav is a small,
	// always-visible sticky header, so 'hover' beats 'viewport' (nothing to
	// gain prefetching links that are never off-screen) and beats 'tap' (no
	// head start at all on desktop).
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover',
	},

	// Build-time optimized images; skip provisioning Cloudflare Images binding.
	adapter: cloudflare({ imageService: 'compile' }),

	// `lastmod` gives crawlers a recrawl signal; changefreq/priority are ignored
	// by Google, so they are left off. The 404 is noindex and does not belong.
	integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/404'), lastmod: new Date() })],

	// Self-hosted, subset and preloaded fonts to prevent FOUT and third-party requests.
	// One geometric rounded sans for everything: nav/body at 400-600, headings at 700-800.
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Plus Jakarta Sans',
			cssVariable: '--font-jakarta',
			weights: [400, 500, 600, 700, 800],
			subsets: ['latin'],
			styles: ['normal'],
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
