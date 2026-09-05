
export interface ResumeItem {
	title: string;
	org: string;
	location?: string;
	start: string;
	end?: string;
	points?: string[];
}

export const resumePdf: string | null = "/resume/RajGajjar.pdf";

export const experience: ResumeItem[] = [
	{
		title: 'Associate AI Engineer',
		org: 'E2M Solutions',
		location: 'Ahmedabad, India',
		start: 'July 2026',
		points: [
			'Building AI-powered solutions for digital agency clients, from initial architecture through production deployment.',
			'Built a rich-text editor and automated document generation workflows with e-signature integration and audit logging.',
			'Cut client turnaround time on a core workflow by an estimated 60%.',
		],
	},
	{
		title: 'AI/ML Engineering Intern',
		org: 'E2M Solutions',
		location: 'Ahmedabad, India',
		start: 'January 2026',
		end: 'June 2026',
		points: [
			'Developed custom AI workflows and LLM-powered automation tools supporting client-facing AI products.',
		],
	},
	{
		title: 'Full Stack Developer Intern',
		org: 'Asambhav Solutions',
		location: 'Ahmedabad, India',
		start: 'December 2025',
		end: 'December 2025',
		points: [
			'Built AutoLead, a RAG-based conversational agent using LangChain and LangGraph with a Django REST Framework backend, enabling natural language booking of calls, test drives, and service appointments with semantic search over pgvector embeddings.',
		],
	},
];

export const skills: { group: string; items: string[] }[] = [
	{
		group: 'Programming Languages',
		items: ['Python', 'JavaScript', 'Java', 'C++', 'SQL', 'HTML5', 'CSS3'],
	},
	{
		group: 'Web Development',
		items: [
			'FastAPI',
			'Django',
			'Django REST Framework',
			'React.js',
			'Next.js',
			'Node.js',
			'Express.js',
			'Astro.js',
			'REST APIs',
			'WebSockets',
			'OAuth 2.0',
		],
	},
	{
		group: 'AI and Machine Learning',
		items: [
			'LangChain',
			'LangGraph',
			'LangSmith',
			'LiveKit',
			'Retrieval-Augmented Generation (RAG)',
			'LLM Agents',
			'Tool-Calling Agents',
			'YOLO',
			'NumPy',
			'Pandas',
			'Scikit-learn',
		],
	},
	{
		group: 'Databases',
		items: ['PostgreSQL', 'pgvector', 'MongoDB', 'MySQL', 'SQLite', 'Redis', 'Pinecone'],
	},
	{
		group: 'Tools and Platforms',
		items: [
			'Git',
			'GitHub',
			'GitHub Actions',
			'Docker',
			'Linux',
			'Railway',
			'Supabase',
			'Tailwind CSS',
			'shadcn/ui',
			'pytest',
			'Selenium',
		],
	},
];
