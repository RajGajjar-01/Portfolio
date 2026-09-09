import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../data/site';

export type Post = CollectionEntry<'blog'>;
export type Project = CollectionEntry<'projects'>;

const published = ({ data }: { data: { draft: boolean } }) =>
	import.meta.env.PROD ? !data.draft : true;

export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', published);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getProjects(): Promise<Project[]> {
	const projects = await getCollection('projects', published);
	return projects.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
	const projects = await getProjects();
	const featured = projects.filter((p) => p.data.featured);
	
	return (featured.length ? featured : projects).slice(0, limit);
}

export async function getPostTags(): Promise<{ tag: string; count: number }[]> {
	const posts = await getPosts();
	const counts = new Map<string, number>();

	for (const post of posts) {
		for (const tag of post.data.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}

	return [...counts]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export const tagSlug = (tag: string) =>
	tag
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

export const formatDate = (date: Date) =>
	date.toLocaleDateString(site.locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC',
	});

export const isoDate = (date: Date) => date.toISOString().split('T')[0];
