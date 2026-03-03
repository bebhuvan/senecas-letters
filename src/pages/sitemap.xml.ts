import type { APIRoute } from 'astro';
import enhancedIndexRaw from '../../public/enhanced-index.json';
import { createSlug, cleanTitle } from '../utils/text';

const enhancedIndex = enhancedIndexRaw as {
  letters: Array<{ n: number; t: string }>;
};

export const GET: APIRoute = async () => {
  const site = 'https://seneca.ink';

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/library', priority: '0.9', changefreq: 'weekly' },
    { url: '/about', priority: '0.5', changefreq: 'monthly' },
  ];

  const letterPages = enhancedIndex.letters.map(l => ({
    url: `/letters/${l.n}-${createSlug(cleanTitle(l.t))}`,
    priority: '0.8',
    changefreq: 'monthly' as const,
  }));

  const allPages = [...staticPages, ...letterPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${site}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
