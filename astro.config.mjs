import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gricn.github.io',
  trailingSlash: 'never',
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});
