

import { site, socials } from '../data/site';
import { experience, skills } from '../data/resume';
import type { Post, Project } from './content';

const abs = (path: string) => new URL(path, site.url).href;

export const PERSON_ID = `${site.url}/#person`;
export const WEBSITE_ID = `${site.url}/#website`;

const personRef = { '@id': PERSON_ID };

export function personSchema() {
	const current = experience[0];

	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': PERSON_ID,
		name: site.name,
		jobTitle: site.role,
		description: site.description,
		url: site.url,
		image: abs('/og-default.png'),
		email: `mailto:${site.email}`,
		
		
		sameAs: socials.filter((s) => s.href.startsWith('http')).map((s) => s.href),
		worksFor: { '@type': 'Organization', name: current.org },
		homeLocation: {
			'@type': 'Place',
			address: {
				'@type': 'PostalAddress',
				addressLocality: site.location.city,
				addressRegion: site.location.region,
				addressCountry: site.location.country,
			},
		},
		knowsAbout: skills.flatMap((group) => group.items),
	};
}

export function websiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: site.name,
		url: site.url,
		inLanguage: site.locale,
		publisher: personRef,
	};
}

export function blogPostingSchema(post: Post, url: URL, image?: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.data.title,
		description: post.data.description,
		datePublished: post.data.pubDate.toISOString(),
		dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
		author: personRef,
		publisher: personRef,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url.href },
		keywords: post.data.tags.join(', '),
		image: abs(image ?? '/og-default.png'),
		inLanguage: site.locale,
	};
}

export function projectSchema(project: Project, url: URL, image?: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareSourceCode',
		name: project.data.title,
		description: project.data.summary,
		url: url.href,
		...(project.data.repo && { codeRepository: project.data.repo }),
		
		dateCreated: String(project.data.year),
		author: personRef,
		keywords: project.data.tags.join(', '),
		programmingLanguage: [...project.data.tags],
		image: abs(image ?? '/og-default.png'),
	};
}

export function breadcrumbSchema(trail: { name: string; path?: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: trail.map((crumb, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: crumb.name,
			...(crumb.path && { item: abs(crumb.path) }),
		})),
	};
}
