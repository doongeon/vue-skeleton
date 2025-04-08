import { createRouter, createWebHistory } from 'vue-router'
import HistoryDetail from '@/views/HistoryDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/history/:id',
      name: 'detail',
      component: HistoryDetail,
    },
  ],
})

export default router
