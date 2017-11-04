<template>
  <div class="panel-group" id="accordion">
    <div v-for="category in categories" class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <input 
            v-if="editMode.active" 
            class="categoryName" 
            v-model="category.name"
            :class="{editMode: editMode.active && editMode.category.id == category.categoryId}"
            :readonly="editMode.category.id != category.categoryId">
          </input>
          <a 
            v-if="!editMode.active"
            data-toggle="collapse" 
            data-parent="#accordion" 
            v-bind:href="'#' + category.categoryId"
            >{{category.name}}
          </a>
          <!-- Delete Icon (visible by default) -->
          <a 
            href="#" 
            v-if="!editMode.active || editMode.category.id != category.categoryId"
            v-on:click="deleteCategory(
              categories.indexOf(category), 
              category.name, 
              category.items.length
            )">
            <span class="glyphicon glyphicon-trash pull-right align-middle"></span>
          </a>
          <!-- Edit Icon (visible by default) -->
          <a 
            href="#"
            v-if="!editMode.active || editMode.category.id != category.categoryId" 
            v-on:click="activateEditMode(
              category.categoryId, 
              categories.indexOf(category)
            )">
            <span class="glyphicon glyphicon-pencil pull-right align-middle"></span>
          </a>
          <!-- Discard Icon (visible only when a category name is being edited -->
          <a 
            href="#" 
            v-if="editMode.active && editMode.category.id == category.categoryId"
            v-on:click="discardChanges()">
            <span class="glyphicon glyphicon-repeat pull-right align-middle"></span>
          </a>
          <!-- Save Icon (visible only when a category name is being edited -->
          <a 
            href="#" 
            v-if="editMode.active && editMode.category.id == category.categoryId"
            v-on:click="updateCategoryName()">
            <span class="glyphicon glyphicon-floppy-disk pull-right align-middle"></span>
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

import lodash from 'lodash';

export default {
  name: 'Category',
  components: {
    'item': Item
  },

  data() {
    return {
      editMode: {
        active: false,
        category: {
          id: '',
          index: ''
        }
      }
    }
  },

  computed: {
    categories () {
      return this.$store.getters.getCategoriesAndItemsView;
    },

    categoriesState () {
      return this.$store.getters.getCategoriesAndItems;
    },

    restaurantId () {
      return this.$store.getters.getRestaurant.restaurantId;
    }
  },

  methods: {
    activateEditMode(categoryId, index) {
      this.editMode.active = true;
      this.editMode.category.id = categoryId;
      this.editMode.category.index = index;
      this.accordion = '';
    },

    updateCategoryName() {
      // Check first if it has departed from its state
      console.log(this.categories[this.editMode.category.index].name);
      // API call

      // If successful update the state, and show a success alert
      //this.$store.commit('updateCategoryName',)
      // Exit edit mode
      this.exitEditMode();
    },

    discardChanges() {
      // Check if the category name has departed from its state
      if(!_.isEqual(this.categories, this.categoriesState)) {
        // Show a warning
        alert('Are you sure you want to discard your changes?');
        // Set the category back to its pre-edit state
        // On Confirmation: this.categories[this.editMode.category.index].name = this.categoriesState[this.editMode.category.index].name;
      } 
      // Exit edit mode
      this.exitEditMode();
    },

    exitEditMode() {
      this.editMode.active = false;
      this.editMode.category.id = '';
      this.editMode.category.index = '';
    },

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

  .panel-title {
    height: 17.6px;
  }

  table {
    border: 0 !important;
    margin-bottom: 0 !important;
  }

  .glyphicon-trash {
    left: 5px;
  }

  .glyphicon-repeat {
    left: 5px;
  }

  .glyphicon-pencil .glyphicon-floppy-disk {
    right: 5px;
  }

  .categoryName {
    background: none;
    border: none;
    text-align: center
  }

  .categoryName:focus {
    outline: none;
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
  }

  .editMode {
    border-bottom: solid 2px white !important;
    display: inline;
    padding-bottom: 4px;
  }

</style>