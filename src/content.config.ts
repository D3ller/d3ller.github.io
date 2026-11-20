import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
      pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
		}),
});

const project = defineCollection({
  loader: glob({
    base: "./src/content/project",
    pattern: "**/*.{md,mdx}"
  }),
  schema: () => z.object({
    title: z.string(),
    github_url: z.url(),
    short_description: z.string(),
    startedDate: z.coerce.date()
  })
})

const history = defineCollection({
  loader: glob({
    base: "./src/content/history",
    pattern: "**/*.{md,mdx}"
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    short_description: z.string(),
    github_url: z.url().optional(),
    status: z.enum(["finished", "in progress", "abandoned", "declined"]),
    startedDate: z.coerce.date(),
    cover: image().optional(),
    draft: z.boolean().default(false)
  })
})

export const collections = { blog, project, history };
