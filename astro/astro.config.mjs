import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://blog.523.life',
  vite: {
    server: {
      fs: { allow: ['..'] },
    },
  },
});

