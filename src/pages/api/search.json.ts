import type { APIRoute } from 'astro';
import searchIndexFull from '../../../public/search-index-full.json';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q')?.toLowerCase().trim();
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  
  if (!query) {
    return new Response(JSON.stringify({ 
      results: [], 
      total: 0,
      query: '' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  }
  
  // Split query into words
  const queryWords = query.split(/\s+/).filter(word => word.length > 2);
  
  // Search using inverted index
  const letterScores = new Map();
  
  // Check each query word in the inverted index
  queryWords.forEach(word => {
    const letterNumbers = searchIndexFull.index[word] || [];
    letterNumbers.forEach(letterNum => {
      const currentScore = letterScores.get(letterNum) || 0;
      letterScores.set(letterNum, currentScore + 1);
    });
  });
  
  // Also do direct text search for exact phrases
  const results = searchIndexFull.letters
    .map(letter => {
      let score = letterScores.get(letter.n) || 0;
      
      // Boost score for title matches
      const titleLower = letter.t.toLowerCase();
      if (titleLower.includes(query)) {
        score += 10; // Exact phrase in title
      }
      queryWords.forEach(word => {
        if (titleLower.includes(word)) {
          score += 3; // Word in title
        }
      });
      
      // Check if letter contains all query words (in keywords)
      if (letter.k && queryWords.every(word => 
        letter.k.some(keyword => keyword.includes(word))
      )) {
        score += 5; // All words found in keywords
      }
      
      // Theme match
      if (letter.th.toLowerCase().includes(query)) {
        score += 2;
      }
      
      return { letter, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  
  // Apply pagination
  const paginatedResults = results.slice(offset, offset + limit);
  
  return new Response(JSON.stringify({
    results: paginatedResults.map(({ letter }) => ({
      number: letter.n,
      title: letter.t,
      preview: letter.p,
      theme: letter.th
    })),
    total: results.length,
    query: query,
    offset: offset,
    limit: limit
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};