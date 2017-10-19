<template>
  <div class="category container-fluid">
    <div class="category-wrapper col-md-10 col-md-offset-1">
      <table class="table table-bordered">
        <thead class="thead-default">
            <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
            </tr>
        </thead>
        <item :renderItems="items"
          :deleteItem="deleteItem($event)">   
        </item>
      </table>
      <modal
        :showModal="modal">
      </modal>
    </div>
  </div>
</template>

<script>

import Item from './Item';
import Modal from './Modal';
import cloneDeep from 'clone-deep';

export default {
  name: 'Category',
  components: {
    'item': Item,
    'modal': Modal,
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
      console.log('resetItem');
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
      // Delete the item from the store, and then re-clone the state and render the clone to the view
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
</style>
