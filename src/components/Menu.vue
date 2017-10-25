<template>
  <div class="menu-wrapper col-md-10 col-md-offset-1">
    <!-- Menu name/title, other information -->
    
    <!-- The menu content -->
    <div class="categories-accordion">
      <category></category>
    </div>

  </div>
</template>

<script>

// Events bus
import { bus } from '../main';

// Components
import Category from './Category';

export default {
  name: 'Menu',
  components: {
    'category': Category,
  },
  data() {
    return {}
  },

  created () {},
  
  methods: {},

  computed: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
