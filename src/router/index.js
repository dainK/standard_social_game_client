// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Game from '../views/Game.vue';
import Rank from '../views/Rank.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
