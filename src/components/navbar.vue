<template>
<nav v-if="isUserAuthenticated" class="navbar navbar-inverse navbar-fixed-top">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">waiter</a>
    </div>
    <div id="navbar" class="navbar-collapse collapse">
      <ul class="nav navbar-nav">
        <li class="active"><a href="#">Dashboard</a></li>
        <li><a href="#">LiveKitchen!</a></li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li><a href="#">{{user.firstName}} {{user.lastName}}</a></li>
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
