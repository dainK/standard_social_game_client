// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
    outDir: 'dist',       // 빌드된 파일이 저장될 디렉토리
    assetsDir: '',  // 정적 파일이 저장될 디렉토리
    rollupOptions: {
      input: [
        './index.html',
        './src/main.js',
      ], 
      // entryFileNames: 'main.js',
      // chunkFileNames: 'main.js', 
    },
    //assetsInclude: ['index.html','src','public'],
  },
  base:"/standard_social_game_client/",
});
