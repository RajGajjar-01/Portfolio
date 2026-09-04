// Single source of truth for identity, nav, and social links.

export const site = {
	name: 'Raj Gajjar',
	// Shown in the hero and the <title> suffix.
	role: 'AI Engineer',
	// One line, kept under 160 chars so search results show it whole.
	description:
		'AI engineer in Ahmedabad building LLM-backed systems with Python, FastAPI, and LangGraph.',
	// Imported by astro.config.mjs, so this is the only place the origin is written.
	url: 'https://portfolio.irajgajjar-2004.workers.dev',
	locale: 'en',
	email: 'irajgajjar.2004@gmail.com',
	/** Without the @; used for twitter:creator. */
	twitter: 'rajgajjar_11',
	/** Feeds Person.homeLocation and the resume header. */
	location: { city: 'Ahmedabad', region: 'Gujarat', country: 'India' },
} as const;

export const nav = [
	{ label: 'Work', href: '/projects' },
	{ label: 'Writing', href: '/blog' },
	{ label: 'Resume', href: '/resume' },
] as const;

export const socials: { label: string; href: string; icon?: 'github' | 'linkedin' | 'x' }[] = [
	{ label: 'GitHub', href: 'https://github.com/RajGajjar-01', icon: 'github' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/rajgajjar04/', icon: 'linkedin' },
	{ label: 'X', href: 'https://x.com/rajgajjar_11', icon: 'x' },
	{ label: 'Email', href: `mailto:${site.email}` },
];
