import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  // Call the next middleware/page
  return next().then((response) => {
    // Clone the response to add headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers)
    });

    // Content Security Policy - Allow inline styles and scripts from self
    // Note: We need unsafe-inline for Astro's inlined styles and theme toggle
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' static.cloudflareinsights.com", // Allow inline scripts and Cloudflare Insights
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com", // Allow inline styles and Google Fonts
      "font-src 'self' fonts.gstatic.com", // Allow Google Fonts
      "img-src 'self' data:", // Allow self and data URLs
      "connect-src 'self' cloudflareinsights.com", // Allow connections to self and Cloudflare Insights
      "frame-ancestors 'none'", // Prevent clickjacking
      "base-uri 'self'", // Restrict base URI
      "object-src 'none'", // Block plugins
      "require-trusted-types-for 'script'" // Enable Trusted Types
    ].join('; ');

    // Add comprehensive security headers
    const securityHeaders = {
      // Content Security Policy
      'Content-Security-Policy': csp,
      
      // HSTS - Force HTTPS for 1 year with subdomains
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      
      // Cross-Origin-Opener-Policy - Isolate browsing context
      'Cross-Origin-Opener-Policy': 'same-origin',
      
      // Cross-Origin-Resource-Policy - Control cross-origin access
      'Cross-Origin-Resource-Policy': 'same-origin',
      
      // X-Frame-Options - Prevent clickjacking (backup to CSP frame-ancestors)
      'X-Frame-Options': 'DENY',
      
      // X-Content-Type-Options - Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // Referrer-Policy - Control referrer information
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // X-DNS-Prefetch-Control - Control DNS prefetching
      'X-DNS-Prefetch-Control': 'on',
      
      // Permissions-Policy - Control browser features
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };

    // Add all security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });

    return newResponse;
  });
});