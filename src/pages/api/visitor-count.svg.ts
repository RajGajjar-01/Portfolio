import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

function ordinal(n: number) {
	const rem100 = n % 100;
	if (rem100 >= 11 && rem100 <= 13) return 'th';
	switch (n % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}

const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

// Tracks unique visits per browser using a persistent cookie.
export const GET: APIRoute = async ({ cookies }) => {
	const kv = env.VISITOR_COUNT;
	let count = (await kv.get('count').then(Number)) || 0;

	if (!cookies.has('visited')) {
		// Non-atomic read-then-write counter increment.
		count += 1;
		await kv.put('count', String(count));
		cookies.set('visited', '1', { path: '/', maxAge: YEAR_IN_SECONDS, httpOnly: true, sameSite: 'lax' });
	}

	const label = `you're the ${count}${ordinal(count)} visitor`;
	const width = label.length * 7.2 + 16;

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="12">
	<text x="8" y="14" fill="#8b8f98">you're the <tspan fill="#e5e7eb" font-weight="600">${count}<tspan dy="-4" font-size="9">${ordinal(count)}</tspan><tspan dy="4"> </tspan></tspan>visitor</text>
</svg>`;

	return new Response(svg, {
		headers: {
			'content-type': 'image/svg+xml',
			'cache-control': 'no-store',
		},
	});
};
