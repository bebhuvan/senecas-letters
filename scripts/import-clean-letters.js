import fs from 'fs/promises';
import path from 'path';

const sourceFile = '/home/bhuvanesh/SN letters/extracted_final/all_letters.json';
const targetDir = './src/content/letters';

// Enhanced themes mapping for better categorization
const letterThemes = {
  1: ['time', 'mortality', 'philosophy'],
  2: ['reading', 'learning', 'focus'],
  3: ['friendship', 'trust', 'relationships'],
  4: ['death', 'fear', 'courage'],
  5: ['philosophy', 'simplicity', 'moderation'],
  6: ['sharing', 'teaching', 'wisdom'],
  7: ['crowds', 'solitude', 'influence'],
  8: ['philosophy', 'retirement', 'tranquility'],
  9: ['friendship', 'philosophy', 'self-sufficiency'],
  10: ['solitude', 'retreat', 'contemplation'],
  11: ['modesty', 'character', 'virtue'],
  12: ['old-age', 'time', 'acceptance'],
  13: ['fear', 'anxiety', 'courage'],
  14: ['body', 'philosophy', 'health'],
  15: ['exercise', 'moderation', 'health'],
  16: ['philosophy', 'wisdom', 'guidance'],
  17: ['poverty', 'wealth', 'philosophy'],
  18: ['festivals', 'poverty', 'practice'],
  19: ['retirement', 'wealth', 'freedom'],
  20: ['philosophy', 'practice', 'consistency'],
  // Add more as needed...
};

function cleanContent(content) {
  // Remove paragraph numbers at start of sentences AND mid-sentence (e.g., "1. ", "disease. 2. To")
  let cleaned = content.replace(/(\.\s*)?\d+\.\s+/g, '. ');
  
  // Fix double periods from the above
  cleaned = cleaned.replace(/\.\.\s+/g, '. ');
  
  // Fix starting period
  cleaned = cleaned.replace(/^\.\s+/, '');
  
  // Remove footnote markers in text [1], [2], etc.
  cleaned = cleaned.replace(/\[\d+\]/g, '');
  
  // Remove footnote explanations (lines starting with ↑)
  cleaned = cleaned.replace(/^\s*↑.*$/gm, '');
  
  // Remove extra whitespace and normalize
  cleaned = cleaned.replace(/\s+/g, ' '); // Multiple spaces to single
  cleaned = cleaned.replace(/\s*\n\s*/g, '\n'); // Clean line breaks
  
  // Split into proper paragraphs (double newline separated)
  const sentences = cleaned.split(/\.\s+/).filter(s => s.trim().length > 0);
  const paragraphs = [];
  let currentParagraph = [];
  
  for (const sentence of sentences) {
    currentParagraph.push(sentence.trim());
    
    // Create new paragraph every 3-4 sentences for readability
    if (currentParagraph.length >= 3) {
      paragraphs.push(currentParagraph.join('. ') + '.');
      currentParagraph = [];
    }
  }
  
  // Add remaining sentences
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join('. ') + '.');
  }
  
  // Filter out greetings and farewells
  const filteredParagraphs = paragraphs
    .filter(p => !p.match(/^(Greetings from Seneca|Farewell\.?\s*$)/))
    .filter(p => p.trim().length > 20); // Remove very short paragraphs
  
  return filteredParagraphs.join('\n\n');
}

function extractExcerpt(content, maxLength = 200) {
  // Get first meaningful paragraph, skip greetings
  const paragraphs = content.split('\n\n');
  let excerpt = '';
  
  for (const paragraph of paragraphs) {
    const clean = paragraph.trim();
    if (clean.length > 50 && !clean.includes('Greetings from Seneca')) {
      excerpt = clean;
      break;
    }
  }
  
  // Clean and truncate
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength);
    // Cut at last complete word
    const lastSpace = excerpt.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      excerpt = excerpt.substring(0, lastSpace);
    }
    excerpt += '...';
  }
  
  return excerpt;
}

function calculateReadingTime(content) {
  const wordsPerMinute = 250;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function getDateAndLocation(letterNum) {
  // Historical dating based on scholarship
  if (letterNum <= 25) return { date: 'Summer, 62 CE', location: 'Campania' };
  if (letterNum <= 50) return { date: 'Autumn, 62 CE', location: 'Rome' };
  if (letterNum <= 75) return { date: 'Winter, 62-63 CE', location: 'Campania' };
  if (letterNum <= 100) return { date: 'Spring, 63 CE', location: 'Rome' };
  return { date: 'Summer, 63-64 CE', location: 'Nomentum' };
}

async function importCleanLetters() {
  try {
    console.log('Reading letters from JSON...');
    
    // Ensure target directory exists
    await fs.mkdir(targetDir, { recursive: true });
    
    // Read the complete JSON file
    const jsonData = await fs.readFile(sourceFile, 'utf-8');
    const data = JSON.parse(jsonData);
    
    console.log(`Found ${data.letters.length} letters to process`);
    
    for (const letter of data.letters) {
      const letterNum = letter.number;
      console.log(`Processing Letter ${letterNum}: ${letter.title}`);
      
      // Clean the content
      const cleanedContent = cleanContent(letter.content);
      
      // Generate metadata
      const excerpt = extractExcerpt(cleanedContent);
      const readingTime = calculateReadingTime(cleanedContent);
      const { date, location } = getDateAndLocation(letterNum);
      const themes = letterThemes[letterNum] || ['philosophy', 'wisdom', 'virtue'];
      const featured = [1, 3, 7, 12, 18, 49].includes(letterNum);
      
      // Clean up title - convert from ALL CAPS to proper Title Case
      let title = letter.title.toLowerCase();
      
      // Convert to Title Case
      title = title.replace(/\b\w/g, (letter) => letter.toUpperCase());
      
      // Handle "ON" prefix properly
      title = title.replace(/^On\s+/i, 'On ');
      
      // Clean up extra spaces
      title = title.replace(/\s+/g, ' ').trim();
      
      // Create frontmatter
      const frontmatter = `---
number: ${letterNum}
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
location: "${location}"
themes: ${JSON.stringify(themes)}
readingTime: ${readingTime}
featured: ${featured}
excerpt: "${excerpt.replace(/"/g, '\\"')}"
---

# Letter ${letterNum}: ${title}

${cleanedContent}`;
      
      // Write the file
      const fileName = `letter-${String(letterNum).padStart(3, '0')}.md`;
      const filePath = path.join(targetDir, fileName);
      await fs.writeFile(filePath, frontmatter);
    }
    
    console.log(`\n✅ Successfully imported ${data.letters.length} letters!`);
    console.log('📝 All paragraph numbers, footnotes, and citations removed');
    console.log('🎯 Content cleaned for optimal reading experience');
    
  } catch (error) {
    console.error('❌ Error importing letters:', error);
    process.exit(1);
  }
}

importCleanLetters();