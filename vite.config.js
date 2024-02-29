// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      input: '/src/main.js', 
    },
  },
  base:"/standard_social_game_client/"
});
