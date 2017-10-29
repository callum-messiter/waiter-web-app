import Vue from 'vue'
import Router from 'vue-router'
import Menu from '@/components/Menu'
import Home from '@/components/Home'
import LiveKitchen from '@/components/LiveKitchen'
import UserSettings from '@/components/UserSettings'

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
      name: 'Menu',
      component: Menu
    },
    {
      path: '/live-kitchen',
      name: 'LiveKitchen',
      component: LiveKitchen
    },
    {
      path: '/me',
      name: 'settings',
      component: UserSettings
    }
  ]
})
