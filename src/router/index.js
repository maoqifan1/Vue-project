/* jslint esversion:6 */
import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import loginModule from '@/components/Login'
import registerModule from '@/components/Register'
import mainModule from '@/components/Main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    }, {
      path: '/login',
      name: 'login',
      component: loginModule
    }, {
      path: '/register',
      name: 'register',
      component: registerModule
    }, {
      path: '/main',
      name: 'main',
      component: mainModule
    }
  ]
})
