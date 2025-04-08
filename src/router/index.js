import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TransactionHistory from '@/components/TransactionHistory.vue'
import EditTransaction from '@/views/EditTransaction.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/history',
      name: 'history',
      component: TransactionHistory,
    },
    {
      path: '/history/:id/edit',
      name: 'edit',
      component: EditTransaction,
    },
  ],
})

export default router
