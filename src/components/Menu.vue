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
                      v-bind:readonly="!item.isEditable" v-on:dblclick="makeItemEditable(item)"> 
                    </td>
                    <td class="item-price text-left col-md-1">
                      <input type="text" class="form-control" v-model="item.price" 
                      v-bind:readonly="!item.isEditable" v-on:dblclick="makeItemEditable(item)">
                    </td>
                    <td class="item-description text-left col-md-5">
                      <input type="text" class="form-control" v-model="item.description" 
                      v-bind:readonly="!item.isEditable" v-on:dblclick="makeItemEditable(item)">
                    </td>
                    <td class="buttons col-md-2" v-if="buttonsVisible">
                      <button v-if="!item.isEditable" class="btn btn-danger pull-left align-middle" 
                      v-on:click="showConfirmDeleteModal(item)">Delete</button>
                      <button v-if="item.isEditable" class="btn btn-primary pull-left align-middle" 
                      v-on:click="showConfirmUpdateModal(item)">Save</button>
                      <button v-if="item.isEditable" class="btn btn-danger pull-left align-middle" id="cancelUpdateBtn"
                      v-on:click="cancelUpdate(item)">Cancel</button>
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
    makeItemEditable(clickedViewItem) {
      const clickedViewItemId = clickedViewItem.itemId;
      // Find the clicked view-item (in our array of view items) by referencing the ID
      const viewItem = this.getSingleItem(clickedViewItemId, this.categories);
      const itemIndex = viewItem.itemIndex;
      const catIndex = viewItem.catIndex;
      // Only one item at a time can be editable, so first we must check if any other view items are already editable
      const editableItems = this.itemsCurrentlyEditable(clickedViewItemId);
      const areThereAnyOtherEditableViewItems = editableItems.areThereAny;
      const editableViewItem = editableItems.item;
      // If there currently are no editable items, then make the clicked view-item editable
      if(!areThereAnyOtherEditableViewItems) {
        // Change the isEditable property of this clicked view item
        this.categories[catIndex].items[itemIndex].isEditable = true;

      // If there is another view item that is already editable...
      } else {
        const editableViewItemId = editableViewItem.itemId;
        const state = this.getSingleItem(editableViewItemId, this.categoryItemsState);
        const editableItemIndex = state.itemIndex;
        // Compare the editable view-item with its state
        const editableViewItemIsEqualToItsState = this.compareViewWithState(editableViewItem, state.item);
        // If the editable view-item is equal to its state...
        if(editableViewItemIsEqualToItsState) {
          // Set the editable view-item to readonly...
          this.categories[catIndex].items[editableItemIndex].isEditable = false;
          // ...And set the target view-item to editable
          this.categories[catIndex].items[itemIndex].isEditable = true;
        }
      }
    },

    cancelUpdate(item) {
      const itemState = this.getSingleItem(item.itemId, this.categoryItemsState);
      const state = itemState.item;
      const catIndex = itemState.catIndex;
      const itemIndex = itemState.itemIndex;
      // Compare the view item with the item state
      const viewItemIsEqualToItemState = this.compareViewWithState(item, state);
      
      if(viewItemIsEqualToItemState) {
        // If the item hasn't actually been changed, just set it back to readonly - no need to display a modal
        this.categories[catIndex].items[itemIndex].isEditable = false;
      } else {
        // If the item has actually been edited by the user, then we want to display the cancel-warning modal
        const modal = this.modal;
        const modalObj = {
          name: 'cancel_update',
          isVisible: true,
          title: 'Are you sure you want to discard your changes to "' + state.name + '"?',
          triggerItem: item,
          buttons: {
            primary: 'Continue Editing',
            warning: 'Discard'
          }
        }
        this.renderModal(modalObj);
      }
    },

    resetItem(itemId) {
      // Get the item from the state by referencing the itemId
      const state = this.getSingleItem(itemId, this.categoryItemsState);
      // Set the view item to its pre-edit state
      Object.assign(this.categories[state.catIndex].items[state.itemIndex], state.item);
    },

    showConfirmUpdateModal(item) {
      // Check if the item has actually changed
      const itemState = this.getSingleItem(item.itemId, this.categoryItemsState);
      const state = itemState.item;
      const itemIndex = itemState.itemIndex;
      const catIndex = itemState.catIndex;
      // Compare the view item with the item state
      const viewItemIsEqualToItemState = this.compareViewWithState(item, state);
      
      if(viewItemIsEqualToItemState) {
        // If the item hasn't actually been changed, just set it back to readonly - no need to display a modal
        this.categories[catIndex].items[itemIndex].isEditable = false;
      } else {
        // Display the warning modal 
        const modal = this.modal;
        const modalObj = {
          name: 'confirm_update',
          isVisible: true,
          title: 'Are you sure you want to update "' + state.name + '"? This will take effect immediately in your live menu.',
          triggerItem: {
            item: item,
            itemIndex: itemIndex,
            catIndex: catIndex,
            itemStateName: state.name 
          },
          buttons: {
            primary: 'Continue Editing',
            warning: 'Save Changes'
          }
        }
        this.renderModal(modalObj);
      }
    },

    updateItem(triggerItem) {
      // If it has, then make the API call
      // If successful, update the state
      const itemStateIndex = this.categories[triggerItem.catIndex].items[triggerItem.itemIndex];
      itemStateIndex.isEditable = false;
      Object.assign(itemStateIndex, triggerItem.item);
      this.showSuccessMessage('Your item "' + triggerItem.itemStateName + '" was successfully updated!');
    },

    showConfirmDeleteModal(item) {
      console.log(item.itemId);
      const itemState = this.getSingleItem(item.itemId, this.categoryItemsState).item;
      // Display the warning modal 
      const modal = this.modal;
      const modalObj = {
        name: 'confirm_delete',
        isVisible: true,
        title: 'Are you sure you want to delete "' + itemState.name + '"? It will become invisible to your customers.',
        triggerItem: item,
        buttons: {
          primary: 'Cancel',
          warning: 'Delete Item'
        }
      }
      this.renderModal(modalObj);
    },

    deleteItem(itemId) {
      // Make API call, and if successful..
      // ...delete the item from the state and update the clone
      this.$store.commit('deleteItem', itemId);
      this.categories = cloneDeep(this.categoryItemsState);
      // ... and in any case, show flash message if successful (later this will be done from the store, inside the API call)
      this.showSuccessMessage('Your item was successfully deleted!');
    },

    compareViewWithState(viewItem, itemState) {
      return _.isEqual(
          _.omit(viewItem, ['isEditable']), 
          _.omit(itemState, ['isEditable'])
      );
    },

    renderModal(modalObj) {
      Object.assign(this.modal, modalObj);
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
    border-right: 0;
    border-bottom: 0;
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
