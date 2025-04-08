import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Header from '../views/Header.vue'
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
      path: '/header',
      name: 'header',
      component: Header,
    },
    {
      path: '/history/add',
      name: 'add',
      component: AddTransaction,
    },
  ],
})

export default router
