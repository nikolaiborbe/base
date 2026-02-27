// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import mdx from '@astrojs/mdx';

// https://astro.dev/config
export default defineConfig({
  site: 'https://base.nikolai.vip',
  output: 'static',
  adapter: netlify(),
  integrations: [mdx()],
});