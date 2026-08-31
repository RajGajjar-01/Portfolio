/** Head/meta props shared by every layout. */
export interface SeoProps {
	title?: string;
	description?: string;
	/** Absolute or root-relative path to a social share image. Defaults to /og-default.png. */
	image?: string;
	/** Alt text for the share image. */
	imageAlt?: string;
	/** Renders article-specific Open Graph tags. */
	article?: { publishedTime: Date; modifiedTime?: Date; tags?: string[] };
	noindex?: boolean;
	/** Extra JSON-LD graph nodes for this page (Person and WebSite are sitewide). */
	schema?: Record<string, unknown>[];
}
