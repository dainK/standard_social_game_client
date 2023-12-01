// vite.config.js
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [Vue()],
  build: {
    rollupOptions: {
      input: '/src/main.js', 
    },
  },
});
