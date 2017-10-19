<template>
  <div class="menu container-fluid">
    <div class="menu-wrapper col-md-10 col-md-offset-1">
      <alert :showAlert="alert"></alert>
      <!-- Accordion Start -->
      <div class="panel-group" id="accordion">

        <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title">
              <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">
              Main Menu</a>
            </h4>
          </div>
          <div id="collapse1" class="panel-collapse collapse in">
            <div class="panel-body">
              <table class="table table-bordered">
                <thead class="thead-default">
                  <tr>
                      <th class="text-center">Name</th>
                      <th class="text-center">Price</th>
                      <th class="text-center">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="item-row" v-for="item in items">
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
                      <td class="buttons col-md-2" v-if="true">
                        <button v-if="!item.isEditable" class="btn btn-danger pull-left align-middle" 
                        v-on:click="showConfirmDeleteModal(item)">Delete</button>
                        <button v-if="item.isEditable" class="btn btn-primary pull-left align-middle" 
                        v-on:click="updateItem(item)">Save</button>
                        <button v-if="item.isEditable" class="btn btn-danger pull-left align-middle" id="cancelUpdateBtn"
                        v-on:click="cancelUpdate(item)">Cancel</button>
                      </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="fot"
          </div>
        </div>

        <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title">
              <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">
              Collapsible Group 2</a>
            </h4>
          </div>
          <div id="collapse2" class="panel-collapse collapse">
            <div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.</div>
          </div>
        </div>

      </div>
      <!-- Accordion End -->
      <modal
        v-on:emitDiscardConfirmation="resetItem($event)"
        v-on:userConfirmedDeleteIntention="deleteItem($event)"
        :showModal="modal">
      </modal>
      <button v-on:click="showSuccessMessage()">:) Alert</button>
      <button v-on:click="showErrorMessage()">:( Alert</button>
    </div>
  </div>
</template>

<script>
/**
  A NOTE ABOUT A NASTY HACK:

  In order to be able to compare the item in the current view, with the item state, we create a clone o 
  the state.

  Thus, if the user edits an edit, and then cancels those edits, we don't need to display a warning modal
  about discarding changes. (For example.)

  There must be a better way to do this; keeping track of two different versions of the item is horrible.

  For now, whenever an item's state is changed here, we must re-clone the state such that immediately after
  the state is updated, the view will be a perfect clone of the state.

  THe view should only depart from the state when the user modifies the view. Then, termporary discrepancies
  are exactly what we want, so that we can compare them and affect the UX accordingly. 
**/
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
      itemId: null,
      items: [],
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
      this.items = cloneDeep(this.itemsState);
  },
  methods: {
    showSuccessMessage() {
      this.alert.isVisible = true;
      this.alert.type = 'success';
      this.alert.message = 'Your item was successfully updated!';
      setTimeout(() =>{ 
        this.alert.isVisible = false;
      }, 2000);
    },

    showErrorMessage() {
      this.alert.isVisible = true;
      this.alert.type = 'error';
      this.alert.message = 'There was an error deleting your item. Try it again.';
      setTimeout(() =>{ 
        this.alert.isVisible = false;
      }, 2000);
    },

    // When a user clicks on a row (item), we want to make each input in this row writable
    makeItemEditable(clickedViewItem) {
      const clickedViewItemId = clickedViewItem.itemId;
      // Only one item at a time can be editable, so first we must check if any other view items are already editable
      const areThereAnyOtherEditableViewItems = this.itemsCurrentlyEditable(clickedViewItemId).areThereAny;
      const editableViewItem = this.itemsCurrentlyEditable(clickedViewItemId).item;
      // If there currently are no editable items, then make the clicked view-item editable
      if(!areThereAnyOtherEditableViewItems) {
        // Find the clicked view-item (in our array of view items) by referencing the ID
        const itemIndex = this.items.findIndex((item => item.itemId == clickedViewItemId));
        // Change the isEditable property of this clicked view item
        this.items[itemIndex].isEditable = true;

      // If there is another view item that is already editable...
      } else {
        const editableViewItemId = editableViewItem.itemId;
        const state = this.getSingleItemState(editableViewItemId);
        // Compare the editable view-item with its state
        const editableViewItemIsEqualToItsState = this.compareViewWithState(editableViewItem, state.item);
        // If the editable view-item is equal to its state...
        if(editableViewItemIsEqualToItsState) {
          // Set the editable view-item to readonly...
          this.items[state.index].isEditable = false;
          // ...And set the target view-item to editable
          const itemIndex = this.items.findIndex((item => item.itemId == clickedViewItemId));
          this.items[itemIndex].isEditable = true;
        }
      }
    },

    cancelUpdate(item) {
      const state = this.getSingleItemState(item.itemId);
      // Compare the view item with the item state
      const viewItemIsEqualToItemState = this.compareViewWithState(item, state.item);
      
      if(viewItemIsEqualToItemState) {
        // If the item hasn't actually been changed, just set it back to readonly - no need to display a modal
        this.items[state.index].isEditable = false;
      } else {
        // If the item has actually been edited by the user, then we want to display the cancel-warning modal
        const modal = this.modal;
        const modalObj = {
          name: 'cancel_update',
          isVisible: true,
          title: 'Are you sure you want to discard your changes to "' + state.item.name + '"?',
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
      const state = this.getSingleItemState(itemId);
      // Set the view item to its pre-edit state
      Object.assign(this.items[state.index], state.item);
    },

    updateItem(item) {
      const itemId = item.itemId;
      // Update the item in the state and update the clone
      // this.$store.commit('updateItem', item.itemId);
      // Find the item by referencing the ID
      const itemIndex = this.items.findIndex((item => item.itemId == itemId));
      // Change the isEditable property of this item
      this.items[itemIndex].isEditable = false;
      // DO WE NEED TO CLONE THE STATE AGAIN HERE?
      // If any item data actually changed, display a flash message
    },

    showConfirmDeleteModal(item) {
      const itemId = item.itemId;
      const itemState = this.getSingleItemState(itemId).item;

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
      // Delete the item from the state and update the clone
      this.$store.commit('deleteItem', itemId);
      this.items = cloneDeep(this.itemsState);
      // Show flash message if successful (later this will be done from the store, inside the API call)
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

    getSingleItemState(itemId) {
      const itemIndex = this.itemsState.findIndex((item => item.itemId == itemId));
      return {item: this.itemsState[itemIndex], index: itemIndex}
    },

    itemsCurrentlyEditable(itemId) {
      for(let item of this.items) {
        // The editable item may be the current item
        if(item.isEditable && item.itemId != itemId) {
          return {areThereAny: true, item: item}
        }
      }
      return {areThereAny: false, item: null}
    }
  },
  computed: {
    itemsState() {
      return this.$store.getters.getItems;
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
