export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      let pathname = url.pathname;
      
      // Handle root path
      if (pathname === '/') {
        pathname = '/index.html';
      }
      
      // Handle directory paths (add index.html)
      if (pathname.endsWith('/') && pathname !== '/') {
        pathname += 'index.html';
      }
      
      // Handle legacy letter URLs redirect
      if (pathname.startsWith('/letter/')) {
        const letterPath = pathname.replace('/letter/', '/letters/');
        return Response.redirect(url.origin + letterPath, 301);
      }
      
      // Create new request with modified pathname
      const assetRequest = new Request(url.origin + pathname, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      // Try to get the file from assets
      const assetResponse = await env.ASSETS.fetch(assetRequest);
      
      if (assetResponse.status === 404) {
        // For SPA-like behavior, serve index.html for non-asset requests
        if (!pathname.includes('.') && !pathname.startsWith('/_astro/')) {
          const indexRequest = new Request(url.origin + '/index.html');
          return await env.ASSETS.fetch(indexRequest);
        }
      }
      
      // Clone response to modify headers
      const response = new Response(assetResponse.body, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers: new Headers(assetResponse.headers),
      });
      
      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.headers.set('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'");
      
      // Optimize cache headers
      if (pathname.startsWith('/_astro/')) {
        // Astro assets - long cache with immutable
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (pathname.match(/\.(css|js|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$/)) {
        // Other static assets - long cache
        response.headers.set('Cache-Control', 'public, max-age=2592000'); // 30 days
      } else if (pathname.endsWith('.html') || pathname === '/') {
        // HTML pages - short cache for updates
        response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600'); // 5 min browser, 1 hour CDN
      } else {
        // Default cache
        response.headers.set('Cache-Control', 'public, max-age=3600'); // 1 hour
      }
      
      // Add performance headers
      if (pathname.endsWith('.html') || pathname === '/') {
        response.headers.set('Link', '</favicon.svg>; rel=preload; as=image');
      }
      
      return response;
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache'
        }
      });
    }
  },
};