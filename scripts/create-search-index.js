import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the full letters data
const lettersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/all_letters.json'), 'utf-8')
);

// Create optimized search index with only necessary fields
const searchIndex = {
  letters: lettersData.letters.map((letter) => {
    // Extract first 300 chars for preview
    const preview = letter.content
      .substring(0, 300)
      .replace(/\[\d+\]/g, '') // Remove footnote references
      .replace(/\s+/g, ' ')
      .trim() + '...';
    
    // Extract key search terms (first 500 chars for better search)
    const searchContent = letter.content
      .substring(0, 500)
      .toLowerCase()
      .replace(/\[\d+\]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return {
      n: letter.number, // number
      t: letter.title.replace(/\[\d+\]/g, '').trim(), // title
      p: preview, // preview
      s: searchContent, // search content
      th: getLetterTheme(letter.number) // theme
    };
  })
};

function getLetterTheme(num) {
  const themes = ["Time & Life", "Learning", "Friendship", "Death", "Philosophy", 
                  "Knowledge", "Society", "Solitude", "Virtue", "Self", "Character", "Aging"];
  return themes[num % themes.length];
}

// Write optimized search index
fs.writeFileSync(
  path.join(__dirname, '../src/data/search-index.json'),
  JSON.stringify(searchIndex)
);

// Write full letter content separately for individual letter pages
const letterContents = {};
lettersData.letters.forEach(letter => {
  letterContents[letter.number] = {
    title: letter.title,
    content: letter.content
  };
});

fs.writeFileSync(
  path.join(__dirname, '../src/data/letter-contents.json'),
  JSON.stringify(letterContents)
);

// Log file sizes
const originalSize = fs.statSync(path.join(__dirname, '../src/data/all_letters.json')).size;
const indexSize = fs.statSync(path.join(__dirname, '../src/data/search-index.json')).size;
const contentsSize = fs.statSync(path.join(__dirname, '../src/data/letter-contents.json')).size;

console.log('Search index created successfully!');
console.log(`Original file: ${(originalSize / 1024).toFixed(2)} KB`);
console.log(`Search index: ${(indexSize / 1024).toFixed(2)} KB`);
console.log(`Letter contents: ${(contentsSize / 1024).toFixed(2)} KB`);
console.log(`Reduction: ${((1 - indexSize / originalSize) * 100).toFixed(1)}%`);