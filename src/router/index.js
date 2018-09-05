import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login_index'
import index from '@/components/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'index',
      component: index
    }
  ]
})
