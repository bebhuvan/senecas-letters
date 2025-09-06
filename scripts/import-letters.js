import fs from 'fs/promises';
import path from 'path';

const sourceDir = '/home/bhuvanesh/SN letters/extracted_final/markdown';
const targetDir = './src/content/letters';

// Themes mapping for letters (you can expand this)
const letterThemes = {
  1: ['time', 'mortality', 'philosophy'],
  2: ['reading', 'learning', 'wisdom'],
  3: ['friendship', 'trust', 'relationships'],
  4: ['death', 'fear', 'courage'],
  5: ['philosophy', 'simplicity', 'appearance'],
  6: ['sharing', 'teaching', 'wisdom'],
  7: ['crowds', 'solitude', 'influence'],
  8: ['philosophy', 'retirement', 'wisdom'],
  9: ['friendship', 'philosophy', 'self-sufficiency'],
  10: ['solitude', 'prayer', 'contemplation'],
  11: ['blushing', 'modesty', 'character'],
  12: ['old-age', 'time', 'acceptance'],
  13: ['fear', 'anxiety', 'courage'],
  14: ['body', 'philosophy', 'health'],
  15: ['exercise', 'moderation', 'health'],
  16: ['philosophy', 'wisdom', 'guidance'],
  17: ['poverty', 'wealth', 'philosophy'],
  18: ['festivals', 'poverty', 'practice'],
  19: ['retirement', 'wealth', 'freedom'],
  20: ['philosophy', 'practice', 'consistency']
};

async function importLetters() {
  try {
    // Ensure target directory exists
    await fs.mkdir(targetDir, { recursive: true });
    
    // Get all markdown files
    const files = await fs.readdir(sourceDir);
    const mdFiles = files.filter(f => f.endsWith('.md')).sort();
    
    for (const file of mdFiles) {
      const letterNum = parseInt(file.match(/\d+/)[0]);
      const sourcePath = path.join(sourceDir, file);
      const content = await fs.readFile(sourcePath, 'utf-8');
      
      // Extract title from the first line
      const titleMatch = content.match(/# Letter \d+: (.+)/);
      const title = titleMatch ? titleMatch[1] : `Letter ${letterNum}`;
      
      // Extract first paragraph as excerpt (after greeting)
      const paragraphs = content.split('\n\n').filter(p => p.trim());
      let excerpt = '';
      for (let i = 1; i < paragraphs.length; i++) {
        const para = paragraphs[i].trim();
        if (para && !para.startsWith('#') && para.length > 50) {
          // Clean up the excerpt
          excerpt = para.replace(/^\d+\.\s*/, '')
            .replace(/\[\d+\]/g, '')
            .substring(0, 200) + '...';
          break;
        }
      }
      
      // Calculate approximate reading time (250 words per minute)
      const wordCount = content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 250);
      
      // Determine if featured (first 10 letters and some special ones)
      const featured = [1, 3, 7, 12, 18, 49].includes(letterNum);
      
      // Create frontmatter
      const frontmatter = `---
number: ${letterNum}
title: "${title.replace(/"/g, '\\"')}"
date: "${letterNum <= 30 ? 'Summer, 62 CE' : letterNum <= 60 ? 'Winter, 62-63 CE' : letterNum <= 90 ? 'Spring, 63 CE' : 'Autumn, 63-64 CE'}"
location: "${letterNum <= 40 ? 'Campania' : letterNum <= 80 ? 'Rome' : 'Nomentum'}"
themes: ${JSON.stringify(letterThemes[letterNum] || ['philosophy', 'wisdom', 'virtue'])}
readingTime: ${readingTime}
featured: ${featured}
excerpt: "${excerpt.replace(/"/g, '\\"')}"
---

${content}`;
      
      // Write the file with frontmatter
      const targetPath = path.join(targetDir, `letter-${String(letterNum).padStart(3, '0')}.md`);
      await fs.writeFile(targetPath, frontmatter);
      console.log(`Imported Letter ${letterNum}: ${title}`);
    }
    
    console.log(`\nSuccessfully imported ${mdFiles.length} letters!`);
    
  } catch (error) {
    console.error('Error importing letters:', error);
    process.exit(1);
  }
}

importLetters();