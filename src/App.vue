<template>
  <div id="app">
    <!-- Navbar -->
    <navbar></navbar>
    <div class="container-fluid">

      <alert></alert>
      <modal></modal>
      <!-- Main page content -->
      <router-view/>
    </div>
  </div>
</template>

<script>

// Global components
import Navbar from './components/navbar';
import Alert from './components/alert';
import Modal from './components/modal';

export default {
  name: 'app',
  components: {
    'navbar': Navbar,
    'alert': Alert,
    'modal': Modal
  }
}
</script>

<style>
#app {
  font-family: Helvetica, 'Avenir', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
