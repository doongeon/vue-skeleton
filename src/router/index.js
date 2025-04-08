import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Header from '../views/Header.vue'
import TransactionHistory from '@/components/TransactionHistory.vue'
import AddTransaction from '@/views/AddTransaction.vue'
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
      path: '/header',
      name: 'header',
      component: Header,
    },
    {
      path: '/history/add',
      name: 'add',
      component: AddTransaction,
    },
    {
      path: '/history/:id/edit',
      name: 'edit',
      component: EditTransaction,
    },
  ],
})

export default router
