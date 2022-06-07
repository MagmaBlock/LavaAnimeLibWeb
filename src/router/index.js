import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue' // 引入首页视图模板

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [ // 控制路由
    {
      path: '/', // 根目录
      name: 'home',
      component: HomeView // 主页
    }
  ]
})

export default router
