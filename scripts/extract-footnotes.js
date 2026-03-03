#!/usr/bin/env node

/**
 * Extract footnotes from all_letters.json
 *
 * Footnotes are embedded as:
 * - [N] markers in the text body
 * - ↑ footnote text lines at the end of each letter's content
 *
 * This script:
 * 1. Extracts footnote text into src/data/footnotes.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT = path.join(__dirname, '..', 'src', 'data', 'all_letters.json');
const FOOTNOTES_OUT = path.join(__dirname, '..', 'src', 'data', 'footnotes.json');

const data = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
const footnotes = {};

data.letters.forEach(letter => {
  const lines = letter.content.split('\n');

  // Collect ↑ lines from the end
  const fnLines = [];
  let i = lines.length - 1;

  // Walk backwards to find all ↑ lines at the end
  while (i >= 0 && (lines[i].trim() === '' || lines[i].trim().startsWith('↑'))) {
    if (lines[i].trim().startsWith('↑')) {
      fnLines.unshift(lines[i].trim().replace(/^↑\s*/, ''));
    }
    i--;
  }

  if (fnLines.length === 0) return;

  // Map [N] markers to footnote text in order
  const letterFootnotes = {};
  fnLines.forEach((text, idx) => {
    letterFootnotes[String(idx + 1)] = text;
  });

  footnotes[String(letter.number)] = letterFootnotes;
});

// Write footnotes.json
fs.writeFileSync(FOOTNOTES_OUT, JSON.stringify(footnotes, null, 2), 'utf-8');

const totalFootnotes = Object.values(footnotes).reduce((sum, obj) => sum + Object.keys(obj).length, 0);
console.log(`Extracted ${totalFootnotes} footnotes from ${Object.keys(footnotes).length} letters`);
console.log(`Written to ${FOOTNOTES_OUT}`);
