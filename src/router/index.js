import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Sidebar from '../views/Sidebar.vue'
import Header from '../views/Header.vue'
import AddTransaction from '@/views/AddTransaction.vue'
import TransactionHistory from '@/views/TransactionHistory.vue'
import EditTransaction from '@/views/EditTransaction.vue'
import HistoryDetail from '@/views/HistoryDetail.vue'
import AnalysisView from '@/views/AnalysisView.vue'
import Layout from '@/views/Layout.vue'
import ProfileView from '@/views/ProfileView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import CalendarView from '@/views/CalendarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'history', name: 'history', component: TransactionHistory },
        { path: 'history/add', name: 'addHistory', component: AddTransaction },
        {
          path: 'history/:id',
          name: 'historyDetail',
          component: HistoryDetail,
        },
        {
          path: 'history/:id/edit',
          name: 'editHistory',
          component: EditTransaction,
        },
        { path: 'analysis', name: 'analysis', component: AnalysisView },
        { path: 'calendar', name: 'calendar', component: HomeView },
        { path: 'profile', name: 'profile', component: ProfileView },
        {
          path: '/:pathMatch(.*)*',
          name: 'notFound',
          component: NotFoundView,
        },
      ],
    },
    { path: '/sidebar', name: 'Sidebar', component: Sidebar },
  ],
})

export default router
