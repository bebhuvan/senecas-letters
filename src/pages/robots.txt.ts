export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Allow crawling of all content
Crawl-delay: 1

# Sitemap location (when available)
# Sitemap: https://senecas-letters.r-bhuvanesh2007.workers.dev/sitemap.xml

# Block sensitive paths (if any in future)
# Disallow: /admin/
# Disallow: /api/

# Welcome search engines to index Seneca's wisdom`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}