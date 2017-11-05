<template>
  <div class="panel-group" id="accordion">
    <div v-for="category in categories" class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <!-- 
            WHAT's HAPPENING HERE?
            **********************

            When the user clicks the edit (pencil) icon on a category panel, we activate edit mode. This, for each of the category panels, replaces the collapsable link element with an input containing the category's name. This means that the accordion freezes whilst edit mode is activated (nothing collapses).

            All the inputs are set to readonly except for the one which is being edited. This means that category(name) edit mode 
            prevents any disruptive simulatenous actions. We don't want the to be able to collapse a category panel whilst he's
            editing a category name. We don't want every category name to become editable when the user activates edit mode.
          -->
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
            >{{category.name}} ({{category.items.length}})
          </a>
          <!-- Delete Icon (visible by default) -->
          <a 
            href="#" 
            v-if="!editMode.active || editMode.category.id != category.categoryId"
            v-on:click="showDeleteCategoryModal(
              category.categoryId,
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
            v-on:click="updateCategoryName(category.name)">
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

  created() {
    bus.$on('deleteCategoryConfirmation', (trigger) => {
      this.deleteCategory(trigger);
    });

    bus.$on('userConfirmedDiscardIntention_category', (index) => {
      // Reset the category that is currently being edited
      // Make the new category the editable one
    });

    // If we listen for this event in the Item component, because it fires n times, where n = num of items (all of which are deleted). Why doesn't the same thing happen with deleting categories?
    bus.$on('userConfirmedDeleteItemIntention', (trigger) => {
      this.deleteItem(trigger);
    });
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
      // If no other category is being edited currently, then make the target category editable
      if(!this.editMode.active) {
        this.editMode.active = true;
        this.editMode.category.id = categoryId;
        this.editMode.category.index = index;
      } else {
        // If another category is in edit mode, but no edit has been made, then make the target category editable
        if(_.isEqual(this.categories, this.categoriesState)) {
          this.editMode.category.id = categoryId;
          this.editMode.category.index = index;
        }
      }
    },

    discardChanges() {
      // Check first if it has departed from its state
      if(!_.isEqual(this.categories, this.categoriesState)) {
        // Show confirmation modal
        // Set the view item to its pre-edit state
        const index = this.editMode.category.index;
        Object.assign(this.categories[index], this.categoriesState[index]);
      }
      this.exitEditMode();
    },

    updateCategoryName(name) {
      // Check first if it has departed from its state
      if(_.isEqual(this.categories, this.categoriesState)) {
        this.exitEditMode();
      } else {
        // API call
        this.$http.put('http://localhost:3000/api/category/update/'+this.editMode.category.id, {
          name: name,
          menuId: JSON.parse(localStorage.menu).menuId
        }, {
          headers: {Authorization: JSON.parse(localStorage.user).token}
        }).then((res) => {
          console.log('editMode ' + JSON.stringify(this.editMode.category));
          if(res.status == 200) {
            // Update the state
            this.$store.commit('updateCategoryName', {
              name: this.categories[this.editMode.category.index].name, 
              index: this.editMode.category.index
            });
            // Exist edit mode and show success alert
            this.exitEditMode();

            const alert = {
              isVisible: true,
              type: 'success',
              message: 'Your category was successfully updated!'
            }
            bus.$emit('showAlert', alert);
          }
        }).catch((res) => {
          if(res.body && res.body.error) {
            // Display the error message
            const alert = {
              isVisible: true,
              type: 'error',
              message: res.body.msg // Must update these to user-friendly messages (API -> devMsg, userMsg)
            }
            bus.$emit('showAlert', alert);

          } else if(res.status && res.statusText) {
            console.log(res.status + " " + res.statusText);
          } else {
            console.log(res);
          }
        });
      }
    },

    exitEditMode() {
      this.editMode.active = false;
      this.editMode.category.id = '';
      this.editMode.category.index = '';
    },

    showDeleteCategoryModal(catId, catIndex, catName, numItems) {
      // Show a warning modal
      const prefix = 'Are you sure you want to delete your category "' + catName + '"? ';
      var noun, msg;
      if(numItems < 1) {
        msg = 'It will become invisible to your customers.';
      } else {
        (numItems == 1) ? noun = 'item' : noun = 'items';
        msg = 'The category, and its ' + numItems  + ' ' + noun + ', will become invisible to your customers.';
      }
      
      const modalData = {
        name: 'confirm_delete_category',
        isVisible: true,
        title: prefix + msg,
        trigger: {
          catIndex: catIndex,
          catId: catId
        },
        buttons: {
          primary: 'Cancel',
          warning: 'Delete Category'
        }
      }
      bus.$emit('showModal', modalData);
    },

    deleteCategory(trigger) {
      this.$http.put('http://localhost:3000/api/category/deactivate/'+trigger.catId, {}, {
        headers: {Authorization: JSON.parse(localStorage.user).token}
      }).then((res) => {
        if(res.status == 200) {
          this.$store.commit('deleteCategory', trigger.catIndex);

          const alert = {
            isVisible: true,
            type: 'success',
            message: 'Your category was successfully deleted!'
          }
          bus.$emit('showAlert', alert); 
        }
      }).catch((res) => {
       if(res.body && res.body.error) {
          // Display the error message
          const alert = {
            isVisible: true,
            type: 'error',
            message: res.body.msg // Must update these to user-friendly messages (API -> devMsg, userMsg)
          }
          bus.$emit('showAlert', alert);

        } else if(res.status && res.statusText) {
          console.log(res.status + " " + res.statusText);
        } else {
          console.log(res);
        }
      })
      
    },

    deleteItem(trigger) {
      this.$http.put('http://localhost:3000/api/item/deactivate/'+trigger.itemId, {}, {
        headers: {Authorization: JSON.parse(localStorage.user).token}
      }).then((res) => {
        console.log(res);
      }).catch((res) => {
        console.log(res);
      });
      /**
      // Update the item state
      this.$store.commit('deleteItem', trigger);

      // Display the alert if successfu
      const alert = {
        isVisible: true,
        type: 'success',
        message: 'Your item was successfully deleted!'
      }
      bus.$emit('showAlert', alert);
      bus.$emit('userConfirmedDeleteIntention');
      **/
    },
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