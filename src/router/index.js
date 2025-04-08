import { createRouter, createWebHistory } from 'vue-router'
import TransactionHistory from '@/components/TransactionHistory.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/history',
      name: 'TransactionHistory',
      component: TransactionHistory,
    },
  ],
})

export default router
