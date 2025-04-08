import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import Header from '@/views/Header.vue'
import TransactionHistory from '@/components/TransactionHistory.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/history',
      name: 'history',
      component: TransactionHistory,
    },
    {
      path: '/header',
      name: 'header',
      component: Header,
    },
  ],
})

export default router
