export function createSlug(title: string, letterNumber?: number): string {
  const baseSlug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
  
  // Add letter number prefix to ensure uniqueness
  return letterNumber ? `letter-${letterNumber}-${baseSlug}` : baseSlug;
}