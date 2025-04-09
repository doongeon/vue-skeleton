import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/HomeView.vue'

import CalendarView from '../views/CalendarView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
    }, 

  //     // 날짜 클릭시 중첩 라우팅으로 해당 날짜 거래내역 표시
  //       children: [
  //       {
  //         path: ':date',
  //         component: DayDetailView,
  //       }  
  //     ]
  //   },
  //   {
  //     path: '/summary/:category',
  //     component: FilteredValueView
  //   }
  ],
})

export default router
