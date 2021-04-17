import { createRouter, createWebHistory } from 'vue-router'
import AuthService from '../services/AuthService'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    // meta: {
    //   type: 'Private'
    // }
  },
  {
    path: '/devices',
    name: 'Devices',
    component: () => import(/* webpackChunkName: "about" */ '../views/Devices.vue'),
    // meta: {
    //   type: 'Private'
    // }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    meta: {
      allowAnonymous: true
    }
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})



router.beforeEach((to, from, next) => {
  if (to.path === '/login' && AuthService.isLoggedIn()) {
    next({
      path: '/',
    });
    return;
  }
  if (!to.meta.allowAnonymous && !AuthService.isLoggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  else {
    next()
  }
})

export default router
