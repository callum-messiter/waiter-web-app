<template>
  <tbody>
    <tr class="item-row" v-for="item in category.items">
        <td class="item-name text-left col-md-2">
          <input 
            type="text" 
            class="form-control" 
            v-model="item.name" 
            v-bind:readonly="editableItem.id != item.itemId" 
            v-on:dblclick="
              makeItemEditable(
                item.itemId, 
                category.items.indexOf(item), 
                category.categoryId,
                categories.indexOf(category)
              )"
          > 
        </td>
        <td class="item-price text-left col-md-1">
          <input 
            type="text" 
            class="form-control" 
            v-model="item.price" 
            v-bind:readonly="editableItem.id != item.itemId" 
            v-on:dblclick="
              makeItemEditable(
                item.itemId, 
                category.items.indexOf(item), 
                category.categoryId,
                categories.indexOf(category)
              )"
          >
        </td>
        <td class="item-description text-left col-md-5">
          <input 
            type="text" 
            class="form-control" 
            v-model="item.description" 
            v-bind:readonly="editableItem.id != item.itemId" 
            v-on:dblclick="
              makeItemEditable(
                item.itemId, 
                category.items.indexOf(item), 
                category.categoryId,
                categories.indexOf(category)
              )"
          >
        </td>
        <td class="buttons col-md-2" v-if="editableItem.id == item.itemId">
          <button 
            class="btn btn-xs btn-primary pull-left align-middle"
            v-on:click="
              showConfirmUpdateModal(
                item, 
                category.items.indexOf(item),
                categories.indexOf(category)
              )"
            >Save
          </button>
          <button 
            class="btn btn-xs btn-danger pull-left align-middle cancelBtn" 
            v-on:click="
              showConfirmDiscardModal(
                item, 
                category.items.indexOf(item),
                categories.indexOf(category)
              )"
            >Discard
          </button>
          <button 
            class="btn btn-xs btn-danger pull-left align-middle"
            v-on:click="
              showConfirmDeleteModal(
                item.itemId, 
                category.items.indexOf(item),
                categories.indexOf(category)
              )"
            >Delete
          </button>
        </td>
    </tr>

    <!-- The template item, for adding a new item -->
    <tr class="newItem-row" v-bind:class="{'newItemDefault': !newItem.isBeingEdited}">
        <td class="item-name text-left col-md-2">
          <input 
            type="text" 
            class="form-control newItem"
            placeholder="E.g. Fish 'N' Chips"
            v-model="newItem.data.name"
            v-bind:readonly="!newItem.isBeingEdited"
            v-on:click="activateNewItemEditMode"
          > 
        </td>
        <td class="item-price text-left col-md-2">
          <input 
            type="text" 
            class="form-control newItem"
            placeholder="E.g. 10.00"
            v-model="newItem.data.price"
            v-bind:readonly="!newItem.isBeingEdited"
            v-on:click="activateNewItemEditMode"
          > 
        </td>
        <td class="item-description text-left col-md-2">
          <input 
            type="text" 
            class="form-control newItem"
            placeholder="E.g. The tastiest dish in town!"
            v-model="newItem.data.description"
            v-bind:readonly="!newItem.isBeingEdited"
            v-on:click="activateNewItemEditMode"
          > 
        </td>
        <td v-if="newItem.isBeingEdited" class="col-md-2">
          <button 
            class="btn btn-xs btn-primary pull-left align-middle"
            v-on:click="createNewItem(categories.indexOf(category))"
            >Save New Item
          </button>
          <button 
            class="btn btn-xs btn-danger pull-left align-middle cancelBtn"
            v-on:click="resetNewItem"
            >Discard
          </button>
        </td>
    </tr>

  </tbody>
</template>

<script>

// Dependencies
import cloneDeep from 'clone-deep';
import lodash from 'lodash';

// Events bus
import { bus } from '../main';

export default {
  name: 'Item',
  props: ['categoriesObj', 'categoryItems'],
  data() {
    return {
      editableItem: {
        id: null,
        catId: null,
        index: null,
        catIndex: null
      },
      newItem: {
        isBeingEdited: false,
        data: {
          itemId: '',
          name: '',
          price: '',
          description: ''
        }
      }
    }
  },

  created() {

    // This event is emitted by the modal component, when the user clicks the "Discard Changes" button
    bus.$on('userConfirmedDiscardIntention', (trigger) => {
      this.resetItem(trigger);
    });

    // This event is emitted by the modal component, when the user clicks the "Save Changes" button
    bus.$on('userConfirmedUpdateIntention', () => {
      this.exitEditMode();
    });

    bus.$on('userConfirmedDeleteIntention', () => {
      this.exitEditMode();
    });

  },

  computed: {
    category () {
      return this.categoryItems;
    },

    // PROBLEM: In order to get the index of the category, we are passing the entire categories object down as a prop. Is there a better way? 
    categories () {
      return this.categoriesObj;
    },

    categoryItemsState () {
      return this.$store.getters.getCategoriesAndItems;
    }
  },

  methods: {
    /**
      All functions related to the "newItem" 
    **/
    activateNewItemEditMode() {
      // Only activate edit mode on the new item, if none of the existing items are in edit mode
      if(this.editableItem.id == null) {
        this.newItem.isBeingEdited = true;
      }
    },

    resetNewItem() {
      this.newItem.data = {itemId: '', name: '', price: '', description: ''}
      this.newItem.isBeingEdited = false;
    },

    createNewItem(catIndex) {
      const newItem = this.newItem.data;
      // For testing, we need unique IDs (these will be assigned by the server)
      newItem.itemId = new Date().getTime();
      // Check that none of the items are empty
      if(newItem.name == '' || newItem.price == '' || newItem.description == '') {
        // Prompt the user to fill in the fields
        const modalData = {
          name: 'empty_fields',
          isVisible: true,
          title: "You can't add a new item without filling in all the details!",
          buttons: {
            primary: 'Back to the menu',
          }
        }
        bus.$emit('showModal', modalData);

      } else {
        this.$store.commit('addItem', {
          item: newItem,
          catIndex: catIndex
        });
        // If successful, show success message deactivate edit mode for the newItem
        this.resetNewItem();
      }
    },

    /** 
      When a user clicks on a row (item), we want to make each input in this row writable. 
      There must only ever be *one* item in edit mode
    **/
    makeItemEditable(itemId, itemIndex, catId, catIndex) {
      // In any case, set the newItem to its default view state
      if(this.newItem.isBeingEdited) {
        this.newItem.data = {itemId: null, name: null, price: null, description: null}
        this.newItem.isBeingEdited = false;
      }

      // Only one item at a time can be editable: If there currently are no editable items, then make the clicked view-item editable
      if(this.editableItem.index == null && this.editableItem.catIndex == null) {
        this.makeClickedItemEditable(itemIndex, itemId, catId, catIndex);
      // If there is another view item that is already editable...
      } else {
        // Check if the view has departed from the state
        const viewItemIsEqualToItemState = this.compareViewWithState(this.categories, this.categoryItemsState);
        // If edit mode was activated, but the user didn't modify the item, then we can activate edit mode on the clicked item
        if(viewItemIsEqualToItemState) {
          this.makeClickedItemEditable(itemIndex, itemId, catId, catIndex);
        } else {
          // We need to find a way to make the clicked item editable after discarding the edits of the other item
          // const editableItem = this.categories[this.editableItem.catIndex].items[this.editableItem.index];
          // this.showConfirmDiscardModal(editableItem, this.editableItem.index, this.editableItem.catIndex);
        }
      }
    },

    compareViewWithState(viewItems, itemsState) {
      return _.isEqual(
          _.omit(viewItems), 
          _.omit(itemsState)
      );
    },

    makeClickedItemEditable(itemIndex, itemId, catIndex, catId) {
      this.editableItem = {
        index: itemIndex, 
        id: itemId, 
        catId: catId,
        catIndex: catIndex
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
        // Emit the event to the modal component
        const itemState = this.categoryItemsState[catIndex].items[itemIndex];
        const modalData = {
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
        bus.$emit('showModal', modalData);
      }
    },

    exitEditMode() {
      this.editableItem = {
        index: null, 
        id: null, 
        catId: null,
        catIndex: null
      }
    },

    /**
      Discarding updates made in edit mode
    **/
    showConfirmDiscardModal(item, itemIndex, catIndex) {
      // First we want to check if the view has actually been changed by the user (they can activate edit mode on a item and then nclick cancel without making any changes)
      const viewItemIsEqualToItemState = this.compareViewWithState(this.categories, this.categoryItemsState);
      if(viewItemIsEqualToItemState) {
        // If the item hasn't actually been changed, just set it back to readonly - no need to display a modal
        this.exitEditMode();
      } else {
        // If the item has actually been edited by the user, then we want to display the cancel-warning modal 
        const itemState = this.categoryItemsState[catIndex].items[itemIndex];
        const modalData = {
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
        bus.$emit('showModal', modalData);
      }
    },

    // Returns the view item back to its pre-edit state
    resetItem(trigger) {
      const viewItem = this.categories[trigger.catIndex].items[trigger.itemIndex];
      const itemState = this.categoryItemsState[trigger.catIndex].items[trigger.itemIndex];
      // Set the view item to its pre-edit state
      Object.assign(viewItem, itemState);
      // Set editableItem to null (and the item will exit edit mode)
      this.exitEditMode();
    }, 

    /**
      When the user clicks the delete button, we want to show a modal so they can confirm their deletion
    **/
    showConfirmDeleteModal(itemId, itemIndex, catIndex) {
      const itemState = this.categoryItemsState[catIndex].items[itemIndex];
      // Build the confirm_delete modal
      const modalData = {
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
      bus.$emit('showModal', modalData);
    },

  }
}
</script>

<style scoped>
  td {
    padding: 0 !important;
    border: none !important;
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
    margin-left: 3px;
    margin-top: 5px;
  }

  .buttons {
    border: none !important;
  }

  .cancelBtn {
    background-color: #404040;
    border-color: #404040;
  }

  .cancelBtn:hover {
    background-color: #1a1a1a;
  }

  .cancelBtn:active {
    background-color: #000000
  }

  .newItemDefault {
    opacity: 0.4;
  }
</style>