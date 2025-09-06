import { defineCollection, z } from 'astro:content';

const lettersCollection = defineCollection({
  type: 'content',
  schema: z.object({
    number: z.number(),
    title: z.string(),
    date: z.string(),
    location: z.string().optional(),
    themes: z.array(z.string()),
    readingTime: z.number(),
    featured: z.boolean().optional().default(false),
    excerpt: z.string()
  })
});

export const collections = {
  letters: lettersCollection
};