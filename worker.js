export default {
  async fetch(request, env) {
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
      
      // Try to get the file from assets
      const assetResponse = await env.ASSETS.fetch(request);
      
      if (assetResponse.status === 404) {
        // For SPA-like behavior, serve index.html for non-asset requests
        if (!pathname.includes('.') && !pathname.startsWith('/_astro/')) {
          return await env.ASSETS.fetch(new Request(url.origin + '/index.html'));
        }
      }
      
      // Set proper MIME types for assets
      const response = new Response(assetResponse.body, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers: assetResponse.headers,
      });
      
      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      // Cache headers for static assets
      if (pathname.startsWith('/_astro/') || pathname.match(/\.(css|js|svg|png|jpg|jpeg|gif|webp|ico)$/)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        response.headers.set('Cache-Control', 'public, max-age=300');
      }
      
      return response;
      
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};