<template>
  <div class="menu-wrapper col-md-10 col-md-offset-1">
    <!-- Menu name/title, other information -->
    <div class="input-group col-md-4 col-md-offset-4">
      <input 
        class="form-control"
        type="text" 
        placeholder="E.g. Starters"
        v-model="newCategory.name"
      >
      <span class="input-group-btn">
        <button 
          class="btn btn-primary" 
          type="button"
          v-on:click="addCategory"
          >Add Category
        </button>
      </span>
    </div>
    <!-- The menu content -->
    <div class="categories-accordion">
      <alert></alert>
      <category></category>
    </div>

  </div>
</template>

<script>

// Events bus
import { bus } from '../main';

// Components
import Category from './Category';
import Alert from './Alert';

export default {
  name: 'Menu',
  components: {
    'category': Category,
    'alert': Alert
  },
  data() {
    return {
      newCategory: {
        categoryId: null,
        name: null,
        items: []
      }
    }
  },

  created () {},
  
  methods: {
    addCategory() {
      const newCategory = this.newCategory;
      // Check that the user has provided a category name
      if(newCategory.name == null || newCategory.name == '') {
        const modalData = {
          name: 'empty_fields',
          isVisible: true,
          title: "Every category must have a name!",
          buttons: {
            primary: 'Back to the menu',
          }
        }
        bus.$emit('showModal', modalData);
      } else {
        // For testing, we need unique IDs (these will be assigned by the server)
        newCategory.categoryId = new Date().getTime();
        this.$store.commit('addCategory', newCategory);
        this.resetNewCategory();
      }
    },

    resetNewCategory() {
      this.newCategory = {
        categoryId: null,
        name: null,
        items: []
      }
    }
  },

  computed: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .categories-accordion {
    margin-top: 20px;
  }
</style>
