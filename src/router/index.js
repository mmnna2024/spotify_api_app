import { createRouter, createWebHistory } from 'vue-router';
import PlaybackRanking from '../views/PlaybackRanking.vue';

const routes = [
  {
    path: '/',
    name: 'PlaybackRanking',
    component: PlaybackRanking,
    props: (route) => {
      return { routeParams: route.query }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router
