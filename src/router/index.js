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
      name: 'User',
      path: '/user',
      component: () => import('../views/User/UserView.vue')
    },
    {
      name: 'UserInfo',
      path: '/userinfo',
      component: () => import('../views/User/UserInfoView.vue'),
      children: [
        {
          name: 'UserInfoAvatar',
          path: 'avatar',
          component: () => import('../views/User/UserInfo/UserInfoAvatarView.vue')
        }
      ]
    },
    {
      name: 'Auth',
      path: '/auth/',
      component: () => import('../views/Auth/AuthView.vue'),
      children: [
        {
          name: 'AuthLogin',
          path: '/auth/login',
          component: () => import('../views/Auth/AuthLoginView.vue'),
        },
        {
          name: 'AuthReg',
          path: '/auth/register',
          component: () => import('../views/Auth/AuthRegView.vue')
        }
      ]
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
          name: 'AdminHeader',
          path: '/admin/header',
          component: () => import('../views/Admin/AdminHeaderView.vue')
        },
        {
          name: 'AdminInvite',
          path: '/admin/invite',
          component: () => import('../views/Admin/AdminInviteCode.vue')
        },
      ]
    },
    {
      name: 'Update',
      path: '/about/update',
      component: () => import('../views/About/UpdateView.vue')
    }
  ]
})

export default router
