import { defineCollection, z } from "astro:content";

const products = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    image: z.string(),
    appStoreLink: z.string().optional(),
    googlePlayLink: z.string().optional(),
    webLink: z.string().optional(),
    webLinkText: z.string().optional(),
  }),
});

const privacy = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    image: z.string(),
  }),
});

export const collections = { products, privacy };
