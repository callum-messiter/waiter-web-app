<template>
  <div class="menu-wrapper col-md-10 col-md-offset-1">
    <!-- Menu name/title, other information -->

    <!-- Notification alerts for item/category updates/deletions --> 
    <alert :showAlert="alert"></alert>
    
    <!-- The menu content -->
    <div class="categories-accordion">
      <category :categoriesObj="categories"></category>
    </div>

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
import Category from './Category';
import Modal from './Modal';
import Alert from './Alert';

export default {
  name: 'Menu',
  components: {
    'category': Category,
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
    /** 
      When a user clicks on a row (item), we want to make each input in this row writable. 
      There must only ever be *one* item in edit mode
    **/
    makeItemEditable(itemId, itemIndex, catId, catIndex) {
      // Only one item at a time can be editable: If there currently are no editable items, then make the clicked view-item editable
      if(this.editableItem.index == null || this.editableItem.catIndex == null) {
        this.makeClickedItemEditable(itemIndex, itemId, catIndex, catId);
      // If there is another view item that is already editable...
      } else {
        // Check if the view has departed from the state
        const viewItemIsEqualToItemState = this.compareViewWithState(this.categories, this.categoryItemsState);
        // If edit mode was activated, but the user didn't modify the item, then we can activate edit mode on the clicked item
        if(viewItemIsEqualToItemState) {
          this.makeClickedItemEditable(itemIndex, itemId, catIndex, catId);
        } else {
          // We need to find a way to make the clicked item editable after discarding the edits of the other item
          // const editableItem = this.categories[this.editableItem.catIndex].items[this.editableItem.index];
          // this.showConfirmDiscardModal(editableItem, this.editableItem.index, this.editableItem.catIndex);
        }
      }
    },

    /**
      Updating an item
    **/
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
        // Set the modal object, which will trigger the displaying of the modal
        Object.assign(this.modal, modalObj);
      }
    },

    updateItem(trigger) {
      // Make the updateItem API call
      // If successful, udpdat the state, create a new view clone, and exit edit mode
      this.$store.commit('updateItem', trigger);
      this.showSuccessMessage('Your item "' + trigger.itemStateName + '" was successfully updated!');
      this.exitEditMode();
    },

    /**
      Discarding changes made to an item in edit mode
    **/
    showConfirmDiscardModal(item, itemIndex, catIndex) {
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
        // Set the modal object, which will trigger the displaying of the modal
        Object.assign(this.modal, modalObj);
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

    /**
      Deleting an item
    **/
    showConfirmDeleteModal(itemId, itemIndex, catIndex) {
      const itemState = this.categoryItemsState[catIndex].items[itemIndex];
      // Build the confirm_delete modal
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
      // Set the modal object, which will trigger the displaying of the modal
      Object.assign(this.modal, modalObj);
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

    /**
      Flash messages which appear following a significant user action, e.g. deleting an item
    **/
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

    compareViewWithState(viewItems, itemsState) {
      return _.isEqual(
          _.omit(viewItems), 
          _.omit(itemsState)
      );
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
</style>
