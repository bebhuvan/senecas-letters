export function createSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function cleanTitle(title: string): string {
  return title.replace(/\[\d+\]/g, '').trim();
}

export function titleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

export function getLetterUrl(n: number, title: string): string {
  return `/letters/${n}-${createSlug(cleanTitle(title))}`;
}

export function readingTime(wordCount: number): string {
  return `${Math.ceil(wordCount / 220)} min`;
}

export function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}
