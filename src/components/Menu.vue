<template>
  <div class="menu-wrapper col-md-10 col-md-offset-1">

    <!-- Notification alerts for item/category updates/deletions --> 
    <alert :showAlert="alert"></alert>
    
    <!-- CategoriesAccordion Component -->
    <div class="panel-group" id="accordion">
      <div v-for="category in categories" class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" data-parent="#accordion" v-bind:href="'#' + category.categoryId">
            {{category.name}}</a>
          </h4>
        </div>
        <div v-bind:id="category.categoryId" class="panel-collapse collapse" 
        v-bind:class="{'in': categories.indexOf(category) == 0}">
          <div class="panel-body">

            <!-- Item Component -->
            <table class="table table-bordered">
              <thead class="thead-default">
                <tr>
                    <th class="text-center">Name</th>
                    <th class="text-center">Price</th>
                    <th class="text-center">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr class="item-row" v-for="item in category.items">
                    <td class="item-name text-left col-md-2">
                      <input type="text" class="form-control" v-model="item.name" 
                      v-bind:readonly="editableItem.id != item.itemId" 
                      v-on:dblclick="makeItemEditable(item.itemId, category.items.indexOf(item), category.categoryId, categories.indexOf(category))"> 
                    </td>
                    <td class="item-price text-left col-md-1">
                      <input type="text" class="form-control" v-model="item.price" 
                      v-bind:readonly="editableItem.id != item.itemId" 
                      v-on:dblclick="makeItemEditable(item.itemId, category.items.indexOf(item), category.categoryId, categories.indexOf(category))">
                    </td>
                    <td class="item-description text-left col-md-5">
                      <input type="text" class="form-control" v-model="item.description" 
                      v-bind:readonly="editableItem.id != item.itemId" 
                      v-on:dblclick="makeItemEditable(item.itemId, category.items.indexOf(item), category.categoryId, categories.indexOf(category))">
                    </td>
                    <td class="buttons col-md-2">
                      <button v-if="editableItem.id != item.itemId" class="btn btn-danger pull-left align-middle" 
                      v-on:click="showConfirmDeleteModal(item/itemId, category.items.indexOf(item), categories.indexOf(category))">Delete</button>
                      <button v-if="editableItem.id == item.itemId" class="btn btn-primary pull-left align-middle" 
                      v-on:click="showConfirmUpdateModal(item, category.items.indexOf(item), categories.indexOf(category))">Save</button>
                      <button v-if="editableItem.id == item.itemId" class="btn btn-danger pull-left align-middle" id="cancelUpdateBtn"
                      v-on:click="cancelUpdate(item, category.items.indexOf(item), categories.indexOf(category))">Cancel</button>
                    </td>
                </tr>
              </tbody>
            </table>
            <!-- Item Component -->

          </div>
        </div>
      </div>
    </div>
    <!-- CategoriesAccordion Component -->

    <!-- Confirmation modals triggered when the user initialises an "update" or "deletion" -->
    <modal
      v-on:emitDiscardConfirmation="resetItem($event)"
      v-on:userConfirmedDeleteIntention="deleteItem($event)"
      v-on:userConfirmedUpdateIntention="updateItem($event)"
      :showModal="modal">
    </modal>

  </div>
</template>

<script>

// Dependencies
import cloneDeep from 'clone-deep';
import lodash from 'lodash';

// Components
import Modal from './Modal';
import Alert from './Alert';

export default {
  name: 'Menu',
  components: {
    'modal': Modal,
    'alert': Alert
  },
  data() {
    return {
      categories: [],
      editableItem: {
        id: null,
        catId: null,
        index: null,
        catIndex: null
      },
      alert: {
        isVisible: true,
        type: null,
        summary: null,
        message: null,
      },
      modal: {
        name: null,
        isVisible: false,
        triggerItem: null,
        title: null,
        buttons: {
          primary: null,
          warning: null
        }
      }
    }
  },
  created() {
      // Clone the item's state so we can compare the view with the state
      this.categories = cloneDeep(this.categoryItemsState);
  },
  methods: {
    showSuccessMessage(message) {
      this.alert.isVisible = true;
      this.alert.type = 'success';
      this.alert.message = message;
      setTimeout(() =>{ 
        this.alert.isVisible = false;
      }, 2000);
    },

    showErrorMessage(message) {
      this.alert.isVisible = true;
      this.alert.type = 'error';
      this.alert.message = message;
      setTimeout(() =>{ 
        this.alert.isVisible = false;
      }, 2000);
    },

    // When a user clicks on a row (item), we want to make each input in this row writable
    makeItemEditable(itemId, itemIndex, catId, catIndex) {
      // Only one item at a time can be editable: If there currently are no editable items, then make the clicked view-item editable
      if(this.editableItem.index == null || this.editableItem.catIndex == null) {
        this.makeClickedItemEditable(itemIndex, itemId, catIndex, catId);
      // If there is another view item that is already editable...
      } else {
        // Check if the view has departed from the state
        const viewHasDepartedFromState = this.compareViewWithState(this.categories, this.categoryItemsState);
        // If edit mode was activated, but the user didn't modify the item, then we can activate edit mode on the clicked item
        if(viewHasDepartedFromState) {
          this.makeClickedItemEditable(itemIndex, itemId, catIndex, catId);
        }
        // If the editable view-item has departed from its state, then the user should be warned about discarding their changes
      }
    },

    cancelUpdate(item, itemIndex, catIndex) {
      // First we want to check if the view has actually been changed by the user (they can activate edit mode on a item and then nclick cancel without making any changes)
      const viewItemIsEqualToItemState = this.compareViewWithState(this.categories, this.categoryItemsState);
      if(viewItemIsEqualToItemState) {
        // If the item hasn't actually been changed, just set it back to readonly - no need to display a modal
        this.exitEditMode();
      } else {
        // If the item has actually been edited by the user, then we want to display the cancel-warning modal
        const modal = this.modal;
        const itemState = this.categoryItemsState[catIndex].items[itemIndex];
        const modalObj = {
          name: 'cancel_update',
          isVisible: true,
          title: 'Are you sure you want to discard your changes to "' + itemState.name + '"?',
          trigger: {
            item: item,
            itemIndex: itemIndex,
            catIndex: catIndex,
          },
          buttons: {
            primary: 'Continue Editing',
            warning: 'Discard'
          }
        }
        this.renderModal(modalObj);
      }
    },

    resetItem(trigger) {
      const viewItem = this.categories[trigger.catIndex].items[trigger.itemIndex];
      const itemState = this.categoryItemsState[trigger.catIndex].items[trigger.itemIndex];
      // Set the view item to its pre-edit state
      Object.assign(viewItem, itemState);
      // Set editableItem to null (and the item will exit edit mode)
      this.exitEditMode();
    },

    showConfirmUpdateModal(item, itemIndex, catIndex) {
      // Compare the view item with the item state
      const viewItemIsEqualToItemState = this.compareViewWithState(this.categories, this.categoryItemsState);
      
      if(viewItemIsEqualToItemState) {
        // If the item hasn't actually been changed, just set it back to readonly - no need to display a modal
        this.exitEditMode();
      } else {
        // Display the warning modal 
        const modal = this.modal;
        const itemState = this.categoryItemsState[catIndex].items[itemIndex];
        const modalObj = {
          name: 'confirm_update',
          isVisible: true,
          title: 'Are you sure you want to update "' + itemState.name + '"? This will take effect immediately in your live menu.',
          trigger: {
            item: item,
            itemStateName: itemState.name,
            itemIndex: itemIndex,
            catIndex: catIndex,
          },
          buttons: {
            primary: 'Continue Editing',
            warning: 'Save Changes'
          }
        }
        this.renderModal(modalObj);
      }
    },

    updateItem(trigger) {
      /**
        Make the updateItem API call
        If successful, udpdat the state, create a new view clone, and exit edit mode
      **/
      this.$store.commit('updateItem', trigger);
      this.showSuccessMessage('Your item "' + trigger.itemStateName + '" was successfully updated!');
      this.exitEditMode();
    },

    showConfirmDeleteModal(itemId, itemIndex, catIndex) {
      const itemState = this.categoryItemsState[catIndex].items[itemIndex];
      // Display the warning modal 
      const modal = this.modal;
      const modalObj = {
        name: 'confirm_delete',
        isVisible: true,
        title: 'Are you sure you want to delete "' + itemState.name + '"? It will become invisible to your customers.',
        trigger: {
          itemId: itemId,
          itemIndex: itemIndex,
          catIndex: catIndex
        },
        buttons: {
          primary: 'Cancel',
          warning: 'Delete Item'
        }
      }
      this.renderModal(modalObj);
    },

    deleteItem(trigger) {
      /**
        Make the deleteItem API call
        If successful, udpdat the state and create a new view clone
      **/
      this.$store.commit('deleteItem', trigger);
      this.categories = cloneDeep(this.categoryItemsState);
      this.showSuccessMessage('Your item was successfully deleted!');
    },

    compareViewWithState(viewItems, itemsState) {
      return _.isEqual(
          _.omit(viewItems), 
          _.omit(itemsState)
      );
    },

    renderModal(modalObj) {
      Object.assign(this.modal, modalObj);
    },

    exitEditMode() {
      this.editableItem = {
        index: null, 
        id: null, 
        catIndex: null, 
        catId: null
      }
    },

    makeClickedItemEditable(itemIndex, itemId, catIndex, catId) {
      this.editableItem = {
        index: itemIndex, 
        id: itemId, 
        catIndex: catIndex, 
        catId: catId
      }
    },

    getSingleItem(itemId, categories) {
      // Implement check for empty categories array, and empty items arrays
      for(var i = 0; i < categories.length; i++) {
        var item = null; 
        const items = categories[i].items;
        const itemIndex = items.findIndex((item => item.itemId == itemId));
        if(itemIndex > -1) {
          return {item: items[itemIndex], itemIndex: itemIndex, catIndex: i};
        }
      }
      return {item: items[itemIndex], index: itemIndex};
    },

    itemsCurrentlyEditable(itemId) {
      // Implement check for empty categories array, and empty items arrays
      const categories = this.categories;
      for(var i = 0; i < categories.length; i++) {
        const items = categories[i].items;
        for(var j = 0; j < items.length; j++) {
          // The editable item may be the current item
          if(items[j].isEditable && items[j].itemId != itemId) {
            return {areThereAny: true, item: items[j]}
          }
        }
      }
      return {areThereAny: false, item: null}
    }
  },
  computed: {
    categoryItemsState() {
      return this.$store.getters.getCategoriesAndItems;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /** Inputs should fill the entire cell **/

  td {
    padding: 0 !important;
  }
  /** Inputs should  have no border **/
  input {
    border: 0 !important;
  }
  
  input[readonly]{
    background-color: #f5f5f0;
    /** Readonly inputs should not glow upon click **/
    outline: none;
    border: none !important;
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
  }

  button {
    height: 32px;
    width: 67px;
    margin-left: 3px;
    margin-top: 1px;
  }

  #cancelUpdateBtn {
    background-color: #404040
  }

  #cancelUpdateBtn:hover {
    background-color: #1a1a1a;
  }

  #cancelUpdateBtn:active {
    background-color: #000000
  }

  table {
    border: 0 !important;
    margin-bottom: 0 !important;
  }

  .buttons {
    border: none !important;
  }

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

</style>
