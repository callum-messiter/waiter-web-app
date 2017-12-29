// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import vueResource from 'vue-resource'
import VeeValidate from 'vee-validate';


Vue.use(vueResource);
Vue.use(VeeValidate);

// Use Bootstrap across the application
import jQuery from 'jquery';
global.jQuery = jQuery;
let Bootstrap = require('bootstrap');
import 'bootstrap/dist/css/bootstrap.min.css';

let cloneDeep = require('clone-deep');

Vue.config.productionTip = false

export const bus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});