// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App)
  .use(router)
  .mount('#app');

// 기본적으로 홈 페이지로 이동
router.push('/');
