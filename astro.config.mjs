import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from "@astrojs/react";
import nodejs from '@astrojs/node';

UserOptions
// https://astro.build/config
export default defineConfig({
  site: 'https://symplifysolutions.com',
  output: "server",
  adapter: nodejs({mode: "standalone"}),
  
  integrations: [mdx(), sitemap(), react()],
});