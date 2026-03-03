import type { APIRoute } from 'astro';
import enhancedIndex from '../../../public/enhanced-index.json';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(enhancedIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
};