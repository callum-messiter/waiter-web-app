<template>
  <div class="panel-group" id="accordion">
    <div v-for="category in categories" class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a 
            data-toggle="collapse" 
            data-parent="#accordion" 
            v-bind:href="'#' + category.categoryId">
            {{category.name}}
          </a>
          <a href="#" v-on:click="deleteCategory(categories.indexOf(category), category.name, category.items.length)">
            <span class="glyphicon glyphicon-trash pull-right align-middle"></span>
          </a>
        </h4>
      </div>
      <div 
        class="panel-collapse collapse"
        v-bind:id="category.categoryId"  
        v-bind:class="{'in': categories.indexOf(category) == 0}"
      >
        <!-- Each category is a collapsable panel, containing a table of the category's items -->
        <div class="panel-body">
          <table class="table table-bordered">
            <thead class="thead-default">
              <tr>
                <th class="text-center">Name</th>
                <th class="text-center">Price</th>
                <th class="text-center">Description</th>
              </tr>
            </thead>
            <!-- Each item is a row (<tr>) in the table body (<tbody>). We have to pass the categories object in too, because we need the category index, which we get by using "categories.indexOf(category)" in the item component" -->
            <item :categoriesObj="categories" :categoryItems="category"></item>
          </table>
        </div>  
      </div>
    </div>
  </div>
</template>

<script>

// Components 
import Item from './Item';

import { bus } from '../main';

export default {
  name: 'Category',
  components: {
    'item': Item
  },

  data() {
    return {
    }
  },

  created() {
    // Create the menu skeleton with default categories
    //this.$http.post('http://localhost:3000/api/menu/create/')
  },

  computed: {
    categories () {
      return this.$store.getters.getCategoriesAndItemsView;
    },

    restaurantId () {
      return this.$store.getters.restaurant.restaurantId;
    }
  },

  methods: {
    deleteCategory(catIndex, catName, numItems) {
      // If the category has no items, just delete it without showing a warning
      if(numItems < 1) {
        this.$store.commit('deleteCategory', catIndex);
      // If the category does have items, then show a warning
      } else {
        var noun;
        (numItems == 1) ? noun = 'item' : noun = 'items';
        
        const modalData = {
          name: 'confirm_delete_category',
          isVisible: true,
          title: 'Are you sure you want to delete your category "' + catName + '"? ' +
                 'The category, and its ' + numItems  + ' ' + noun + ', will become invisible to your customers.',
          trigger: {
            catIndex: catIndex
          },
          buttons: {
            primary: 'Cancel',
            warning: 'Delete Category'
          }
        }
        bus.$emit('showModal', modalData);
      }
    }
  }
}
</script>

<style scoped>
  .accordion {
    border: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .panel {
    border: none !important;
  }

  .panel-body {
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    border-bottom: 0 !important;
  }

  .panel-heading {
    background-color: #8d8d8e !important;
    color: white !important;
  }

  table {
    border: 0 !important;
    margin-bottom: 0 !important;
  }

  .glyphicon-trash {
    left: 5px;
  }

  .glyphicon-pencil {
    right: 5px;
  }

</style>