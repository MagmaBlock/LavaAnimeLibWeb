import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [ // 控制路由
    {
      name: 'Home',
      path: '/',
      component: () => import('../views/HomeView.vue')
    },
    {
      name: 'Search',
      path: '/search/:value?',
      component: () => import('../views/SearchView.vue')
    },
    {
      name: 'Index',
      path: '/index',
      component: () => import('../views/IndexView.vue')
    },
    {
      name: 'Help',
      path: '/help',
      component: () => import('../views/HelpView.vue'),
      meta: {
        transition: 'flow-out'
      }
    },
    {
      name: 'My',
      path: '/my',
      component: () => import('../views/MyView.vue')
    },
    {
      name: 'Anime',
      path: '/anime/:la?',
      component: () => import('../views/Anime/AnimeView.vue')
    },
    {
      name: 'Admin',
      path: '/admin',
      component: () => import('../views/Admin/AdminView.vue'),
      children: [
        {
          path: 'header',
          component: () => import('../views/Admin/AdminHeaderView.vue')
        }
      ]
    }
  ]
})

export default router
