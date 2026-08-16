// Single source of truth for identity, nav, and social links.

export const site = {
	name: 'Raj Gajjar',
	// Shown in the hero and the <title> suffix.
	role: 'Software Engineer',
	// One line. Used as the default meta description and OG description.
	description:
		'Software engineer building fast, accessible web applications. Currently focused on distributed systems and developer tooling.',
	// Must match `site` in astro.config.mjs.
	url: 'https://example.com',
	locale: 'en',
	email: 'irajgajjar.2004@gmail.com',
} as const;

export const nav = [
	{ label: 'Work', href: '/projects' },
	{ label: 'Writing', href: '/blog' },
	{ label: 'Resume', href: '/resume' },
] as const;

export const socials = [
	{ label: 'GitHub', href: 'https://github.com/RajGajjar-01' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/rajgajjar04/' },
	{ label: 'X', href: 'https://x.com/rajgajjar_11' },
	{ label: 'Email', href: `mailto:${site.email}` },
] as const;
