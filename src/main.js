	// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/store';
import vueResource from 'vue-resource';
import VeeValidate from 'vee-validate';
import money from 'v-money'
import config from '../config/config';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

Raven
.config('https://8b24d84322a149af90d3a6e5e3468f4a@sentry.io/696126')
.addPlugin(RavenVue, Vue)
.install();

// TODO: set this also upon successful login
if(localStorage.getItem('user') !== null) {
	Raven.setUserContext({
		userId: JSON.parse(localStorage.user).userId || null,
    email: JSON.parse(localStorage.user).email || null,
	});
}

Vue.use(vueResource);
Vue.http.options.root = config.apiBaseUrl;


Vue.use(VeeValidate);
Vue.use(money, {precision: 2});

// Use Bootstrap across the application
import jQuery from 'jquery';
global.jQuery = jQuery;
let Bootstrap = require('bootstrap');
import 'bootstrap/dist/css/bootstrap.min.css';

let cloneDeep = require('clone-deep');

Vue.config.productionTip = false;

export const bus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});