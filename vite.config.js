// vite.config.js
// import { defineConfig } from 'vite';

// export default defineConfig({
//   plugins: [],
//   build: {
//     outDir: 'dist', // 빌드된 파일이 저장될 디렉토리
//     assetsDir: '', // 정적 파일이 저장될 디렉토리
//     rollupOptions: {
//       input: ['./index.html', './src/main.js'],
//     },
//   },
//   base: '/standard_social_game_client/',
//   define: {
//     'import.meta.env.VITE_API': JSON.stringify(process.env.VITE_API),
//   },
// });

import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [],
    build: {
      outDir: 'dist', // 빌드된 파일이 저장될 디렉토리
      assetsDir: '', // 정적 파일이 저장될 디렉토리
      rollupOptions: {
        input: ['./index.html', './src/main.js'],
      },
    },
    base: '/standard_social_game_client/',
    // define: {
    //   'import.meta.env.VITE_API': JSON.stringify(process.env.VITE_API),
    // },
  });
};
