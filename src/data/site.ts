

export const site = {
	name: 'Raj Gajjar',
	
	role: 'AI Engineer',
	
	description:
		'AI engineer in Ahmedabad building LLM-backed systems with Python, FastAPI, and LangGraph.',
	
	url: 'https://portfolio.irajgajjar-2004.workers.dev',
	locale: 'en',
	email: 'irajgajjar.2004@gmail.com',
	
	twitter: 'rajgajjar_11',
	
	location: { city: 'Ahmedabad', region: 'Gujarat', country: 'India' },
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
];
