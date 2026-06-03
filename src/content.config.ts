import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z
    .object({
      title: z.string(),
      date: z.union([z.string(), z.date()]).optional(),
      categories: z.union([z.string(), z.array(z.string())]).optional(),
      category: z.union([z.string(), z.array(z.string())]).optional(),
      excerpt: z.string().optional()
    })
    .passthrough()
});

export const collections = { blog };
