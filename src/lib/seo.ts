/** Head/meta props shared by every layout. */
export interface SeoProps {
	title?: string;
	description?: string;
	/** Absolute or root-relative path to a social share image. */
	image?: string;
	/** Renders article-specific Open Graph tags. */
	article?: { publishedTime: Date; modifiedTime?: Date; tags?: string[] };
	noindex?: boolean;
}
