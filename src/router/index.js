import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/Home'
import LiveKitchen from '@/components/LiveKitchen'
import Dashboard from '@/components/Dashboard'
import Settings from '@/components/Settings'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
  	{
  		path: '/',
  		name: 'Home',
  		component: Home
  	},
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/kitchen',
      name: 'LiveKitchen',
      component: LiveKitchen
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
  ]
})
