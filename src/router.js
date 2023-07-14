import { createRouter, createWebHistory } from 'vue-router';
import Login from './Login.vue'
import Profile from './components/Profile.vue'


const routes = [
    {
      path: '/',
      component: Login,
    },
    {
      path: '/profile',
      component: Profile,
    },
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;