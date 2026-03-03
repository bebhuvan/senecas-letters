export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Crawl-delay: 1

Sitemap: https://seneca.ink/sitemap.xml`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
