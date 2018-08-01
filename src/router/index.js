import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes';
import Home from '@/components/Home/Home'
import LiveOrders from '@/components/LiveOrders/LiveOrders'
import Dashboard from '@/components/Dashboard/Dashboard'
import ResolvedOrders from '@/components/ResolvedOrders/ResolvedOrders'
import Account from '@/components/Account/Account'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
  	{
  		path: routes.home,
  		name: 'Home',
  		component: Home
  	},
    {
      path: routes.dashboard,
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: routes.liveOrders,
      name: 'LiveOrders',
      component: LiveOrders
    },
    {
      path: routes.resolvedOrders,
      name: 'ResolvedOrders',
      component: ResolvedOrders
    },
    {
      path: routes.account,
      name: 'Account',
      component: Account
    }
  ]
})
