import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the full letters data
const lettersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/all_letters.json'), 'utf-8')
);

// Common stop words to exclude from indexing (optional optimization)
const stopWords = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was', 'were',
  'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'can', 'of', 'to', 'in', 'for',
  'with', 'by', 'from', 'about', 'into', 'through', 'during', 'before', 'after'
]);

// Extract important words from text
function extractKeywords(text) {
  // Convert to lowercase and extract words
  const words = text.toLowerCase()
    .replace(/\[\d+\]/g, '') // Remove footnote references
    .replace(/[^a-z0-9\s]/g, ' ') // Keep only letters and numbers
    .split(/\s+/)
    .filter(word => word.length > 2); // Filter out very short words
  
  // Count word frequency
  const wordFreq = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  // Get top keywords by frequency
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50) // Keep top 50 keywords per letter
    .map(([word]) => word);
  
  return keywords;
}

// Create inverted index for fast searching
const invertedIndex = {};
const letterKeywords = {};

// Create comprehensive search index
const searchIndex = {
  letters: lettersData.letters.map((letter) => {
    // Extract preview (first 400 chars for display)
    const preview = letter.content
      .substring(0, 400)
      .replace(/\[\d+\]/g, '')
      .replace(/\s+/g, ' ')
      .trim() + '...';
    
    // Extract keywords from full content
    const keywords = extractKeywords(letter.content);
    letterKeywords[letter.number] = keywords;
    
    // Build inverted index
    keywords.forEach(keyword => {
      if (!invertedIndex[keyword]) {
        invertedIndex[keyword] = [];
      }
      invertedIndex[keyword].push(letter.number);
    });
    
    // Also index title words
    const titleWords = letter.title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    titleWords.forEach(word => {
      if (!invertedIndex[word]) {
        invertedIndex[word] = [];
      }
      if (!invertedIndex[word].includes(letter.number)) {
        invertedIndex[word].push(letter.number);
      }
    });
    
    return {
      n: letter.number, // number
      t: letter.title.replace(/\[\d+\]/g, '').trim(), // title
      p: preview, // preview
      th: getLetterTheme(letter.number), // theme
      k: keywords.slice(0, 20) // top 20 keywords for client-side search
    };
  }),
  // Include inverted index for advanced search
  index: invertedIndex
};

function getLetterTheme(num) {
  const themes = ["Time & Life", "Learning", "Friendship", "Death", "Philosophy", 
                  "Knowledge", "Society", "Solitude", "Virtue", "Self", "Character", "Aging"];
  return themes[num % themes.length];
}

// Write comprehensive search index
fs.writeFileSync(
  path.join(__dirname, '../public/search-index-full.json'),
  JSON.stringify(searchIndex)
);

// Create a lighter version without the inverted index for initial load
const lightIndex = {
  letters: searchIndex.letters.map(letter => ({
    n: letter.n,
    t: letter.t,
    p: letter.p,
    th: letter.th
  }))
};

fs.writeFileSync(
  path.join(__dirname, '../public/search-index-light.json'),
  JSON.stringify(lightIndex)
);

// Log file sizes
const originalSize = fs.statSync(path.join(__dirname, '../src/data/all_letters.json')).size;
const fullIndexSize = fs.statSync(path.join(__dirname, '../public/search-index-full.json')).size;
const lightIndexSize = fs.statSync(path.join(__dirname, '../public/search-index-light.json')).size;

console.log('Full-text search index created successfully!');
console.log(`Original file: ${(originalSize / 1024).toFixed(2)} KB`);
console.log(`Full search index: ${(fullIndexSize / 1024).toFixed(2)} KB`);
console.log(`Light index: ${(lightIndexSize / 1024).toFixed(2)} KB`);
console.log(`Full index size: ${((fullIndexSize / originalSize) * 100).toFixed(1)}% of original`);
console.log(`Light index reduction: ${((1 - lightIndexSize / originalSize) * 100).toFixed(1)}%`);