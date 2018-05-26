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
          <router-link to="/dashboard">My Menu</router-link>
        </li>
        <li v-bind:class="{'active': $route.path == '/kitchen'}">
          <router-link to="/kitchen">Live Orders</router-link>
        </li>

      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li v-bind:class="{'active': $route.path == '/account'}">
          <router-link to="/account">Account</router-link>
        </li>
        <li class="logout">
            <a v-on:click="logUserOut">Log out</a>
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

  methods: {
    logUserOut() {
      // TODO: if a user is logged in, then logs out, then creates a new user, the LiveKitchen shows the previous user's state
      // We need to reset state upon logout
      localStorage.removeItem('user');
      localStorage.removeItem('restaurant');
      localStorage.removeItem('menu');
      this.$store.commit('deauthenticateUser');
      localStorage.isAuth = false;
      this.$router.push({ path: '/', query: {logout: true} });
    }
  },

  computed: {
    userIsSignedIn () {
      return this.$store.getters.isUserAuthenticated;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @font-face {
    font-family: 'grotesque';
    src: url("../fonts/grotesque.otf");
  }

  #navbar {
    background-color: #3a3a3a;
    /*padding: 0 15px;*/
    font-family: 'grotesque';
  }

  #navbar .navbar-nav li a {
    color: #fff !important;
    font-size: 16px;
  }

  .navbar-header {
    padding-left: 15px;
    background-color: #3a3a3a;
  }

  .navbar-right {
    padding-right: 15px;
  }

  .navbar {
    border: none;
  }

  .navbar-default .navbar-nav>.active>a, .navbar-default .navbar-nav>.active>a:focus, .navbar-default .navbar-nav>.active>a:hover {
    background-color: #262626;
  }

  a {
    color: white;
    cursor: pointer;
  }


</style>
