import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { getPosts } from '../lib/content';

export const GET: APIRoute = async (context) => {
	const posts = await getPosts();

	return rss({
		title: `${site.name} | Writing`,
		description: site.description,
		// `context.site` comes from `site` in astro.config.mjs.
		site: context.site!,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}`,
			categories: [...post.data.tags],
		})),
		customData: `<language>${site.locale}</language>`,
	});
};
