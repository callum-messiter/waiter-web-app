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
            :class="{editMode: editMode.active && editMode.category.id == category.categoryId}"
            :readonly="editMode.category.id != category.categoryId"
            v-model="category.name">
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
            v-if="!editMode.active || editMode.category.id != category.categoryId"
            href="#" 
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
            v-if="!editMode.active || editMode.category.id != category.categoryId"
            href="#" 
            v-on:click="activateEditMode(
              category.categoryId, 
              categories.indexOf(category)
            )">
            <span class="glyphicon glyphicon-pencil pull-right align-middle"></span>
          </a>
          <!-- Discard Icon (visible only when a category name is being edited -->
          <a 
            v-if="editMode.active && editMode.category.id == category.categoryId"
            href="#" 
            v-on:click="discardChanges()">
            <span class="glyphicon glyphicon-repeat pull-right align-middle"></span>
          </a>
          <!-- Save Icon (visible only when a category name is being edited -->
          <a 
            v-if="editMode.active && editMode.category.id == category.categoryId"
            href="#" 
            v-on:click="updateCategoryName(category.name)">
            <span class="glyphicon glyphicon-floppy-disk pull-right align-middle"></span>
          </a>
        </h4>
      </div>
      <div 
        class="panel-collapse collapse"
        v-bind:class="{'in': categories.indexOf(category) == 0}"
        v-bind:id="category.categoryId"  
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

    // If we listen for this event in the Item component, because it fires n times, where n = num of items (all of which are deleted). Why doesn't the same thing happen with deleting categories?
    bus.$on('userConfirmedDeleteItemIntention', (trigger) => {
      this.deleteItem(trigger);
    });

    // If we listen for this event in the Item component, because it fires n times, where n = num of items (all of which are deleted). Why doesn't the same thing happen with deleting categories?
    bus.$on('userConfirmedUpdateIntention', (trigger) => {
      this.updateItem(trigger);
    });
  },

  computed: {
    /** 
      This is the clone of the state of the menu (the categories and the items)
      We render each category in this component, and the items in the child Item component
      Anytime we change the state, by committing to it, the clone is updated, and thus the
      view updates to reflect the clone and state
    **/
    categories () {
      return this.$store.getters.getCategoriesAndItemsView;
    },

    /** 
      This is the actual state. We use this only to check if the view has departed from the state, which
      allows us to check, for example, if the user has actually changed a category name. 
      Based on this information, we may or not may display a "Sure you want to discard your changes" warning, for example
    **/
    categoriesState () {
      return this.$store.getters.getCategoriesAndItems;
    }
  },

  methods: {

    /**
      "Edit Mode" simply means that a user has clicked the edit icon on the category panel. When a category is in 
      edit mode, the accordion freezes, and the category name is enclosed by a (seamless) form input, and is thus editable
    **/
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

    /**
      The user may begin editing a category name, and then decide against the edit. At this point
      he can click the "reset/discard" icon, which will set the name back to its pre-edit state 
    **/
    discardChanges() {
      // Check first if the category has departed from its state
      if(!_.isEqual(this.categories, this.categoriesState)) {
        // Set the view category to its pre-edit state
        const index = this.editMode.category.index;
        Object.assign(this.categories[index], this.categoriesState[index]);
      }
      this.exitEditMode();
    },

    /**
      Our success and error flash messages (the event is listened for by the Alert component)
    **/
    showAlert(type, msg) {
      const alert = {
        isVisible: true,
        type: type,
        message: msg
      }
      bus.$emit('showAlert', alert);
    },

    /**
      "Edit Mode" simply means that a user has clicked the edit icon on the category panel. When a category is in 
      edit mode, the accordion freezes, and the category name is enclosed by a (seamless) form input, and is thus editable
    **/
    exitEditMode() {
      this.editMode.active = false;
      this.editMode.category.id = '';
      this.editMode.category.index = '';
    },

    /**
      Here we send the updated category name to the API, and if the data is successfully persisted to the database,
      we also update the state, which is then reflected in the view. It is important to keep the backend data and the 
      front-end state syncronised
    **/
    updateCategoryName(name) {
      // Check first if the category has departed from its state
      if(_.isEqual(this.categories, this.categoriesState)) {
        this.exitEditMode();
      } else {
        this.$http.put('http://localhost:3000/api/category/update/'+this.editMode.category.id, {
          name: name,
          menuId: JSON.parse(localStorage.menu).menuId
        }, {
          headers: {Authorization: JSON.parse(localStorage.user).token}
        }).then((res) => {
          if(res.status == 200) {
            // If the updates were successfully persisted to the database, update the state to reflect the changes
            this.$store.commit('updateCategoryName', {
              name: this.categories[this.editMode.category.index].name, 
              index: this.editMode.category.index
            });
            // Exist edit mode and show success alert
            this.exitEditMode();
            this.showAlert('success', 'Your category was successfully updated!')
          }
        }).catch((res) => {
          this.handleApiError(res);
        });
      }
    },

    /**
      Here we display a warning message to the user once they've clicked to delete a category. The Modal component
      listens for the event we fire here
    **/
    showDeleteCategoryModal(catId, catIndex, catName, numItems) {
      // We display this modal to force the user to confirm that they indeed wish to delete the category
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

    /**
      Here we send a request to the API to deactivate the category (by setting categories.active = 0). If the data is successfully persisted to the database, we also update the state, which is then reflected in the view (the category panel disappears). It is important to keep the backend data and the front-end state syncronised
    **/
    deleteCategory(trigger) {
      this.$http.put('http://localhost:3000/api/category/deactivate/'+trigger.catId, {}, {
        headers: {Authorization: JSON.parse(localStorage.user).token}

      }).then((res) => {
        if(res.status == 200) {
          // If the updates were successfully persisted to the database, update the state to reflect the changes
          this.$store.commit('deleteCategory', trigger.catIndex);
          this.showAlert('success', 'Your category was successfully deleted!');
        }

      }).catch((res) => {
        this.handleApiError(res);
      });
    },

    /**
      Here we send the updated item data to the API, and if it is successfully persisted to the database,
      we also update the state, which is then reflected in the view. It is important to keep the backend data and the 
      front-end state syncronised
    **/
    updateItem(trigger) {
      this.$http.put('http://localhost:3000/api/item/update/'+trigger.item.itemId, {
        name: trigger.item.name,
        price: trigger.item.price,
        description: trigger.item.description
      }, {
        headers: {Authorization: JSON.parse(localStorage.user).token}

      }).then((res) => {
        this.$store.commit('updateItem', trigger); // Update the item state
        this.showAlert('success','Your item "' + trigger.itemStateName + '" was successfully updated!'); // Display the alert if successful
        bus.$emit('exitItemEditMode'); // We must emit an event to the item component in order to exit edit mode
      
      }).catch((res) => {
        this.handleApiError(res);
      });
    },

    /**
      Here we send a request to the API to deactivate the item (by setting items.active = 0). If the data is successfully persisted to the database, we also update the state, which is then reflected in the view (the item disappears). It is important to keep the backend data and the front-end state syncronised
    **/
    deleteItem(trigger) {
      this.$http.put('http://localhost:3000/api/item/deactivate/'+trigger.itemId, {}, {
        headers: {Authorization: JSON.parse(localStorage.user).token}

      }).then((res) => {
        this.$store.commit('deleteItem', trigger);
        // Display the alert if successful
        this.showAlert('success', 'Your item was successfully deleted!');

      }).catch((res) => {
        this.handleApiError(res);
      });
    },

    /**
      We will handle every API error like this, in the catch block of our promise
    **/
    handleApiError(res) {
      if(res.body && res.body.error) {
        // Display the error message
        this.showAlert('error', res.body.msg);
      } else if(res.status && res.statusText) {
        // Save to server logs (once implemented)
        console.log(res.status + " " + res.statusText);
      } else {
        // Save to server logs (once implemented)
        console.log(res);
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