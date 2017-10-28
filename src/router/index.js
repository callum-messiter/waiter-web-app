import Vue from 'vue'
import Router from 'vue-router'
import Menu from '@/components/Menu'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path: '/',
  		name: 'Home',
  		component: Home
  	},
    {
      path: '/Dashboard',
      name: 'Menu',
      component: Menu
    }
  ]
})
