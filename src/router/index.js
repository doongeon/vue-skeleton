import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
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
  ],
})

export default router
