<template>
  <div class="menu container-fluid">
    <div class="menu-wrapper col-md-10 col-md-offset-1">
      <table class="table table-bordered">
          <thead class="thead-default">
              <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
              </tr>
          </thead>
          <tbody>
              <tr class="item-row" v-for="item in items">
                  <td class="item-name text-left col-md-3">
                    <input type="text" class="form-control" v-model="item.name" 
                    v-bind:readonly="!item.isUpdatable" v-on:dblclick="makeItemUpdatable(item.itemId)"> 
                  </td>
                  <td class="item-price text-left col-md-1">
                    <input type="text" class="form-control" v-model="item.price" 
                    v-bind:readonly="!item.isUpdatable" v-on:dblclick="makeItemUpdatable(item.itemId)">
                  </td>
                  <td class="item-description text-left col-md-5">
                    <input type="text" class="form-control" v-model="item.description" 
                    v-bind:readonly="!item.isUpdatable" v-on:dblclick="makeItemUpdatable(item.itemId)">
                  </td>
                  <td class="buttons col-md-4">
                    <button v-if="!item.isUpdatable" class="btn btn-danger pull-left align-middle" 
                    v-on:click="deleteItem(item)">Delete</button>
                    <button v-if="item.isUpdatable" class="btn btn-primary pull-left align-middle" 
                    v-on:click="updateItem(item)">Save</button>
                    <button v-if="item.isUpdatable" class="btn btn-danger pull-left align-middle" id="cancelUpdateBtn"
                    v-on:click="cancelUpdate(item)">Cancel</button>
                  </td>
              </tr>
          </tbody>
      </table>
      <modal 
        v-on:discardChanges="resetItem($event)" 
        :showModal="modal">
      </modal>
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
export default {
  name: 'Menu',
  components: {
    'modal': Modal
  },
  data() {
    return {
      itemId: null,
      items: [],
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
    // When a user clicks on a row (item), we want to make each input in this row writable
    makeItemUpdatable(itemId) {
      // Only one item at a time can be updatable, so first we must check if any are already updatable
      var areAnyOtherItemsUpdatable = false;
      for(let item of this.items) {
        // The editable item may be the current item
        if(item.isUpdatable && item.itemId != itemId) {
          areAnyOtherItemsUpdatable = true;
          var editableItem = item;
        }
      }
      // If there currently are no updatable items, then make this item updatable
      if(areAnyOtherItemsUpdatable) {
        /**
         If the user is leaving one item (in edit mode) to edit another item, then:
            
            1) If the item in edit mode has departed from its state, show a warning modal
            2) If the item in edit mode is the same as its state, just set this item to readonly, and set the new item to editable
        **/
        const editableItemId = editableItem.itemId;
        const editableItemIndex = this.itemsState.findIndex((item => item.itemId == editableItemId));
        const editableItemState = this.itemsState[editableItemIndex];
        // Compare the view item with the item state
        const editableItemIsEqualToItsState = _.isEqual(
            _.omit(editableItem, ['isUpdatable']), 
            _.omit(editableItemState, ['isUpdatable'])
        );

        if(editableItemIsEqualToItsState) {
          this.items[editableItemIndex].isUpdatable = false;
          // Find the item by referencing the ID
          const itemIndex = this.items.findIndex((item => item.itemId == itemId));
          // Change the isUpdatable property of this item
          this.items[itemIndex].isUpdatable = true;
        } else {
          // SHOW THE "CANCEL-UPDATE" MODAL
          alert('You need to finish editing the other item first');
          // The challenge is, when the discardChanges method is fired in the Modal component, it's hard to then set
          // the 'new' item to editable. We would have to send a property that says "this discard-changes was not triggered by a button, but by the user double clicking another item whilst editing an item."
          // This property would be sent with the event, and then in the Menu.resetItem method, we will check, and set the properties of visibiility for the old item and the new item
        }
      } else {
        // Find the item by referencing the ID
        const objIndex = this.items.findIndex((item => item.itemId == itemId));
        // Change the isUpdatable property of this item
        this.items[objIndex].isUpdatable = true;
      }
    },
    cancelUpdate(item) {
      const modal = this.modal;
      const itemId = item.itemId;
      const objIndex = this.itemsState.findIndex((item => item.itemId == itemId));
      const itemState = this.itemsState[objIndex];
      // Compare the view item with the item state
      const viewItemIsEqualToItemState = _.isEqual(
          _.omit(item, ['isUpdatable']), 
          _.omit(itemState, ['isUpdatable'])
      );
      // If the item hasn't actually been changed, just set it back to readonly - no need to display a modal
      if(viewItemIsEqualToItemState) {
        this.items[objIndex].isUpdatable = false;
      } else {
        // If the item has actually been edited by the user, then we want to display the cancel-warning modal
        modal.isVisible = true;
        modal.name = 'cancel_update'; 
        modal.triggerItem = item;
        // The modal title should include the item state, incase the user changes the item name
        modal.title = 'Are you sure you want to discard your changes to "' + itemState.name + '"?';
        modal.buttons.primary = 'Continue Editing';
        modal.buttons.warning = 'Discard';
      }
    },
    resetItem(itemId) {
      // Get the item from the state by referencing the itemId
      const objIndex = this.itemsState.findIndex((item => item.itemId == itemId));
      const itemState = this.itemsState[objIndex];
      // Set the state item to the local item
      Object.assign(this.items[objIndex], itemState);
    },
    updateItem(item) {
      const itemId = item.itemId;
      // Update the item in the state and update the clone
      // this.$store.commit('updateItem', item.itemId);
      // Find the item by referencing the ID
      const objIndex = this.items.findIndex((item => item.itemId == itemId));
      // Change the isUpdatable property of this item
      this.items[objIndex].isUpdatable = false;
      // DO WE NEED TO CLONE THE STATE AGAIN HERE?
      // If any item data actually changed, display a flash message
    },
    deleteItem(item) {
      const modal = this.modal;
      const itemId = item.itemId;
      const objIndex = this.itemsState.findIndex((item => item.itemId == itemId));
      const itemState = this.itemsState[objIndex];
      // If the item has actually been edited by the user, then we want to display the cancel-warning modal
      modal.isVisible = true;
      modal.name = 'confirm_delete'; 
      modal.triggerItem = item;
      // The modal title should include the item state, incase the user changes the item name
      modal.title = 'Are you sure you want to delete "' + itemState.name + '"?';
      modal.buttons.primary = 'Cancel';
      modal.buttons.warning = 'Delete Item';
      // Display flash message
    },
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
</style>
