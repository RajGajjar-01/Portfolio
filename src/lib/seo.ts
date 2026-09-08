
export interface SeoProps {
	title?: string;
	description?: string;
	
	image?: string;
	
	imageAlt?: string;
	
	article?: { publishedTime: Date; modifiedTime?: Date; tags?: string[] };
	noindex?: boolean;
	
	schema?: Record<string, unknown>[];
}
