import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the full letters data
const lettersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/all_letters.json'), 'utf-8')
);

// Enhanced theme collections - curated philosophical topics
const themeCollections = {
  "Essential Start": {
    letters: [1, 2, 16, 23, 48],
    description: "Begin your journey with Seneca's most accessible wisdom",
    difficulty: "beginner"
  },
  "Death & Mortality": {
    letters: [4, 24, 30, 36, 54, 63, 70, 77, 82, 99],
    description: "Seneca's profound meditations on death and the meaning of life",
    difficulty: "intermediate"
  },
  "Time & Life": {
    letters: [1, 49, 58, 77, 101, 108],
    description: "How to live purposefully and use time wisely",
    difficulty: "beginner"
  },
  "Virtue & Character": {
    letters: [8, 11, 18, 23, 31, 41, 66, 71, 85, 95],
    description: "Building moral character and living with virtue",
    difficulty: "intermediate"
  },
  "Philosophy in Practice": {
    letters: [16, 20, 48, 52, 64, 89, 90, 106],
    description: "Applying philosophical principles to daily life",
    difficulty: "intermediate"
  },
  "Friendship & Relationships": {
    letters: [3, 6, 9, 35, 40, 55, 91],
    description: "On human connections and meaningful relationships",
    difficulty: "beginner"
  },
  "Advanced Stoicism": {
    letters: [58, 65, 74, 92, 102, 113, 117, 124],
    description: "Deep philosophical concepts for serious students",
    difficulty: "advanced"
  },
  "Wealth & Simplicity": {
    letters: [2, 5, 17, 27, 62, 87, 110],
    description: "Material possessions and the philosophy of enough",
    difficulty: "beginner"
  }
};

// Timeline periods (Seneca wrote letters 63-65 CE, in his final years)
const timelinePeriods = [
  { year: "63 CE", season: "Early Letters", letters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
  { year: "63 CE", season: "Spring-Summer", letters: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
  { year: "64 CE", season: "Autumn", letters: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45] },
  { year: "64 CE", season: "Winter", letters: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60] },
  { year: "64 CE", season: "Late Year", letters: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75] },
  { year: "65 CE", season: "Final Months", letters: [76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88] },
  { year: "65 CE", season: "Last Letters", letters: [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124] }
];

// Estimate letter difficulty and length
function getLetterMeta(letterNumber, content) {
  const wordCount = content.split(/\s+/).length;
  const length = wordCount < 800 ? 'short' : wordCount < 1500 ? 'medium' : 'long';
  
  // Simple difficulty heuristic based on content analysis
  const advancedWords = ['metaphysics', 'dialectic', 'syllogism', 'proposition', 'categorical', 'premise'];
  const philosophicalWords = ['virtue', 'stoic', 'philosophy', 'wisdom', 'ethics', 'moral'];
  
  const advancedCount = advancedWords.reduce((count, word) => 
    count + (content.toLowerCase().split(word).length - 1), 0);
  const philCount = philosophicalWords.reduce((count, word) => 
    count + (content.toLowerCase().split(word).length - 1), 0);
  
  let difficulty = 'beginner';
  if (advancedCount > 2 || letterNumber > 100) difficulty = 'advanced';
  else if (philCount > 5 || letterNumber > 60) difficulty = 'intermediate';
  
  return { length, difficulty, wordCount };
}

// Find which collections each letter belongs to
function getLetterCollections(letterNumber) {
  const collections = [];
  for (const [name, collection] of Object.entries(themeCollections)) {
    if (collection.letters.includes(letterNumber)) {
      collections.push(name);
    }
  }
  return collections;
}

// Find timeline period for letter
function getTimelinePeriod(letterNumber) {
  return timelinePeriods.find(period => period.letters.includes(letterNumber));
}

// Create enhanced search index
const enhancedIndex = {
  letters: lettersData.letters.map((letter) => {
    const meta = getLetterMeta(letter.number, letter.content);
    const collections = getLetterCollections(letter.number);
    const timelinePeriod = getTimelinePeriod(letter.number);
    
    const preview = letter.content
      .substring(0, 400)
      .replace(/\[\d+\]/g, '')
      .replace(/\s+/g, ' ')
      .trim() + '...';
    
    return {
      n: letter.number,
      t: letter.title.replace(/\[\d+\]/g, '').trim(),
      p: preview,
      th: getLetterTheme(letter.number),
      meta: meta,
      collections: collections,
      timeline: timelinePeriod ? {
        year: timelinePeriod.year,
        season: timelinePeriod.season
      } : null
    };
  }),
  collections: themeCollections,
  timeline: timelinePeriods
};

function getLetterTheme(num) {
  const themes = ["Time & Life", "Learning", "Friendship", "Death", "Philosophy", 
                  "Knowledge", "Society", "Solitude", "Virtue", "Self", "Character", "Aging"];
  return themes[num % themes.length];
}

// Write enhanced index
fs.writeFileSync(
  path.join(__dirname, '../public/enhanced-index.json'),
  JSON.stringify(enhancedIndex)
);

// Log statistics
const totalLetters = enhancedIndex.letters.length;
const byDifficulty = enhancedIndex.letters.reduce((acc, letter) => {
  acc[letter.meta.difficulty] = (acc[letter.meta.difficulty] || 0) + 1;
  return acc;
}, {});
const byLength = enhancedIndex.letters.reduce((acc, letter) => {
  acc[letter.meta.length] = (acc[letter.meta.length] || 0) + 1;
  return acc;
}, {});

console.log('Enhanced library index created!');
console.log(`Total letters: ${totalLetters}`);
console.log(`Collections: ${Object.keys(themeCollections).length}`);
console.log(`Timeline periods: ${timelinePeriods.length}`);
console.log('By difficulty:', byDifficulty);
console.log('By length:', byLength);

const fileSize = fs.statSync(path.join(__dirname, '../public/enhanced-index.json')).size;
console.log(`Index size: ${(fileSize / 1024).toFixed(2)} KB`);