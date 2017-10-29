<template>
<nav v-if="userIsSignedIn" class="navbar navbar-default navbar-fixed-top">
  <div class="container-fluid">
    <div v-bind:class="{'active': $route.path == '/'}" class="navbar-header">
      <router-link class="navbar-brand" to="/">
        <span class="glyphicon glyphicon-cutlery"></span>
      </router-link>
    </div>
    <div id="navbar" class="navbar-collapse collapse">
      <ul class="nav navbar-nav">
        <li v-bind:class="{'active': $route.path == '/dashboard'}">
          <router-link to="/dashboard">Dashboard</router-link>
        </li>
        <li v-bind:class="{'active': $route.path == '/live-kitchen'}">
          <router-link to="/live-kitchen">LiveKitchen</router-link>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li v-bind:class="{'active': $route.path == '/me'}">
          <router-link to="/me">{{user.firstName}} {{user.lastName}}</router-link>
        </li>
      </ul>
    </div><!--/.nav-collapse -->
  </div><!--/.container-fluid -->
</nav>
</template>

<script>

export default {
  name: 'Navbar',
  components: {},
  data() {
    return {
      user: {
        firstName: 'Callum',
        lastName: 'Messiter'
      }
    }
  },

  created () {},
  
  methods: {},

  computed: {
    userIsSignedIn () {
      return this.$store.getters.isUserAuthenticated;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .navbar-right {
    font-size: 12px;
  }
</style>
