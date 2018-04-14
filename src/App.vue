<template>
  <div id="app">
    <alert></alert>
    <!-- Navbar -->
    <navbar></navbar>
    <div class="container">
      <flash-message class="navbar-fixed-top"></flash-message>
      <modal></modal>
      <modalForm></modalForm>
      <!-- Main page content -->
      <router-view/>
    </div>
  </div>
</template>

<script>

// LiveKitchen connection via WebSockets
import Vue from 'vue';
import VueSocketio from 'vue-socket.io';
import settings from '../config/settings';

// Global components
import Navbar from './components/Navbar';
import Alert from './components/Alert';
import Modal from './components/Modal';
import ModalForm from './components/ModalForm';

export default {
  name: 'app',
  components: {
    'navbar': Navbar,
    'alert': Alert,
    'modal': Modal,
    'modalForm': ModalForm,
  },

  created() {
    if(!this.userIsAuthenticated) {
      // If the user is not logged in, redirect them to the home page when they visit any other page
      if(this.$route.path != '/' && this.$route.path != '/landing') {
        this.$router.push('/');
      }
    }

    if(localStorage.getItem('restaurant') !== null) {
      const r = JSON.parse(localStorage.restaurant);
      if(r.hasOwnProperty('restaurantId')) {
        // http://host?restaurantId={restaurantId}
        Vue.use(VueSocketio, settings.webSocketsUrl+'?restaurantId='+r.restaurantId);
      }
    }
    
  },

  computed: {
    userIsAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    }
  }
}
</script>

<style>

  #app {
    font-family: Helvetica, 'Avenir', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /*color: #2c3e50;*/
    margin-top: 50px;
  }

  /** 
    Cheating a bit, but when building the app (npm run build), 
    the two stylings below are not adhered to. There must be a conflict
    somewhere in the CSS, which manifests following minification. 

    But I can't be bothered to find it, and I was under the impression
    that CSS properties set here would be respected globally (so long as 'scoped' was removed from
    the style tag).
  **/

  body {
    background-color: #0a0a0a !important;
  }

  .container-fluid {
    padding: 0 !important;
  }

  .flash__message.error{
    background-color: #e60000 !important;
    border-color: #e60000 !important;
    color: white !important;
    font-size: 12px !important;
  }

</style>
