import { defineCollection } from 'astro/content/config';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
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
