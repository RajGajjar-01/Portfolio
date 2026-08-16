// TODO: replace with real history; plain data used since it renders on one page.

export interface ResumeItem {
	title: string;
	org: string;
	location?: string;
	start: string;
	/** Omit for current roles; renders as "Present". */
	end?: string;
	summary?: string;
	points?: string[];
}

/** Optional link to a downloadable PDF placed in `public/`. */
export const resumePdf: string | null = null;

export const experience: ResumeItem[] = [
	{
		title: 'Senior Software Engineer',
		org: 'Company Name',
		location: 'Remote',
		start: '2024',
		summary: 'Platform and performance work across the product surface.',
		points: [
			'Built an edge caching layer that cut p95 API latency from 340ms to 28ms.',
			'Led the migration of 12 services onto a versioned event schema registry, ending consumer-breaking deploys.',
			'Mentored three engineers through their first on-call rotations.',
		],
	},
	{
		title: 'Software Engineer',
		org: 'Previous Company',
		location: 'Remote',
		start: '2022',
		end: '2024',
		points: [
			'Shipped the design token pipeline that unified web, iOS, and Android theming.',
			'Reduced CI feedback time from 22 minutes to 6 by parallelising the test suite.',
		],
	},
];

export const education: ResumeItem[] = [
	{
		title: 'B.E. Computer Engineering',
		org: 'University Name',
		start: '2018',
		end: '2022',
	},
];

export const skills: { group: string; items: string[] }[] = [
	{
		group: 'Languages',
		items: ['TypeScript', 'JavaScript', 'Go', 'Python', 'SQL'],
	},
	{
		group: 'Frontend',
		items: ['React', 'Astro', 'Tailwind CSS', 'Web performance', 'Accessibility'],
	},
	{
		group: 'Backend',
		items: ['Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'REST', 'gRPC'],
	},
	{
		group: 'Infrastructure',
		items: ['Docker', 'Kubernetes', 'AWS', 'Cloudflare', 'Terraform', 'CI/CD'],
	},
];
