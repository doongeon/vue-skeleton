import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Sidebar from '@/views/Sidebar.vue'
import AddTransaction from '@/views/AddTransaction.vue'
import TransactionHistory from '@/views/TransactionHistory.vue'
import EditTransaction from '@/views/EditTransaction.vue'
import HistoryDetail from '@/views/HistoryDetail.vue'
import AnalysisView from '@/views/AnalysisView.vue'
import Layout from '@/views/Layout.vue'
import ProfileView from '@/views/ProfileView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import CalendarView from '@/views/CalendarView.vue'
import { isMatchToRoles } from '@/utils/AuthUtils'
import Welcome from '@/views/Welcome.vue'
import Login from '@/views/Login.vue'
import Base from '@/views/Base.vue'
//import { CalendarDetails } from '@/views/CalendarDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'base',
      component: Base, // App shell, 로그인/메인 둘 다 지원
      children: [
        {
          path: '',
          name: 'welcome',
          component: Welcome,
        },
        {
          path: 'login',
          name: 'login',
          component: Login,
        },
        {
          path: 'main',
          component: Layout, // 실제 사이드바/헤더 포함 Layout
          children: [
            { path: '', name: 'home', component: HomeView },
            { path: 'history', name: 'history', component: TransactionHistory },
            { path: 'history/add', name: 'addHistory', component: AddTransaction },
            { path: 'history/:id', name: 'historyDetail', component: HistoryDetail },
            { path: 'history/:id/edit', name: 'editHistory', component: EditTransaction },
            { path: 'analysis', name: 'analysis', component: AnalysisView },
            { path: 'calendar', name: 'calendar', component: CalendarView },
            { path: 'profile', name: 'profile', component: ProfileView },
            {
              path: '/:pathMatch(.*)*',
              name: 'notFound',
              component: NotFoundView,
            },
          ],
        },
      ],
    },
    { path: '/sidebar', name: 'Sidebar', component: Sidebar },
  ],
})
router.beforeEach((to) => {
  if (!isMatchToRoles(to.path)) {
    return { name: 'login', query: { fromname: to.name } }
  }
})

export default router
