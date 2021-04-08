import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

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
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    // meta: {
    //   type: 'Restricted'
    // }
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.type === 'Private')) {
    if (store.getters.isLoggedIn && to.meta.permissions.includes(store.state.user.role)) {
      next()
      return
    }
    next('/login')
  } else if (to.matched.some(record => record.meta.type === 'Restricted')) {
    if (!store.getters.isLoggedIn) {
      next()
      return
    }
    next('/')
  } else {
    next()
  }
})

export default router
