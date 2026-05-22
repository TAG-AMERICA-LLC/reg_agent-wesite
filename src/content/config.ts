import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['LLC', 'Corporation', 'Registered Agent', 'Documenti', 'Tips', 'News']),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    readingTime: z.string(),
    gradient: z.string().optional(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { blog };
