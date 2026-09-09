import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	// `image()` validates assets at build time for optimization with <Image>.
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			summary: z.string(),
			cover: image().optional(),
			coverAlt: z.string().default(''),
			tags: z.array(z.string()).default([]),
			role: z.string().optional(),
			year: z.number(),
			link: z.url().optional(),
			repo: z.url().optional(),
			// Featured projects surface on the homepage, ordered by `order`.
			featured: z.boolean().default(false),
			order: z.number().default(99),
			draft: z.boolean().default(false),
		}),
});

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			cover: image().optional(),
			coverAlt: z.string().default(''),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
		}),
});

export const collections = { projects, blog };
