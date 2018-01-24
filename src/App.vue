<template>
  <div id="app">
    <!-- Navbar -->
    <navbar></navbar>
    <div class="container-fluid">
      <modal></modal>
      <!-- Main page content -->
      <router-view/>
    </div>
  </div>
</template>

<script>

// Global components
import Navbar from './components/Navbar';
import Alert from './components/Alert';
import Modal from './components/Modal';

export default {
  name: 'app',
  components: {
    'navbar': Navbar,
    'alert': Alert,
    'modal': Modal
  },
  
  created() {
    if(!this.userIsAuthenticated) {
      // If the user is not logged in, redirect them to the home page when they visit any other page
      if(this.$route.path != '/') {
        this.$router.push('/');
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
/**
body {
  background:
    url(./assets/home-image.jpg) no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
}
**/

#app {
  font-family: Helvetica, 'Avenir', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
