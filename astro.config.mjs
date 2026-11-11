// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import vue from '@astrojs/vue';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://d3ller.github.io',
  integrations: [mdx(), sitemap(), vue(), icon()],
  fonts: [
      {
          provider: fontProviders.google(),
          name: 'Inter',
          cssVariable: '--font-inter',
          weights: [400, 500, 600, 700],
          styles: ['normal'],
          fallbacks: ['sans-serif'],
      },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});