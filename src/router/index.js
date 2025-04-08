import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TransactionHistory from '@/components/TransactionHistory.vue'
import AddTransaction from '@/views/AddTransaction.vue'

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
      path: '/history/add',
      name: 'add',
      component: AddTransaction,
    },
  ],
})

export default router
