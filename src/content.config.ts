import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const link = z.object({ label: z.string(), url: z.string().url() });

// One Markdown file per language: en/<slug>.md and zh/<slug>.md. `pageSlug` is the URL segment.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    pageSlug: z.string(),
    lang: z.enum(['en', 'zh']),
    title: z.string(),
    summary: z.string(),
    kind: z.enum(['software', 'coursework']),
    order: z.number(),
    featured: z.boolean().default(false),
    stack: z.string().optional(),
    period: z.string().optional(),
    status: z.string().optional(),
    image: z.string().optional(),
    imageDark: z.string().optional(),
    links: z.array(link).default([]),
  }),
});

const systems = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/systems' }),
  schema: z.object({
    pageSlug: z.string(),
    lang: z.enum(['en', 'zh']),
    title: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    order: z.number(),
    updated: z.string().optional(),
    glance: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
    references: z.array(link).default([]),
  }),
});

export const collections = { projects, systems };
