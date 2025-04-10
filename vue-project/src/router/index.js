import { createRouter, createWebHistory } from 'vue-router'
import { isMatchToRoles } from '@/utils/AuthUtils'

import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/users',
      name: 'users',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Users.vue'),
    },    
    {
      path: '/admins',
      name: 'admins',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Admins.vue'),
    },
  ],
})

router.beforeEach((to)=> {
  if (!isMatchToRoles(to.path)){
    return {name:'login', query: {fromname: to.name}}
  }
})

export default router
