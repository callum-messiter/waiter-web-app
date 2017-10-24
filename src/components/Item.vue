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
        <td class="buttons col-md-2">
          <button 
            class="btn btn-danger pull-left align-middle"
            v-if="editableItem.id != item.itemId"
            v-on:click="
              showConfirmDeleteModal(
                item.itemId, 
                category.items.indexOf(item),
                categories.indexOf(category)
              )"
            >Delete
          </button>
          <button 
            class="btn btn-primary pull-left align-middle"
            v-if="editableItem.id == item.itemId" 
            v-on:click="
              showConfirmUpdateModal(
                item, 
                category.items.indexOf(item),
                categories.indexOf(category)
              )"
            >Save</button>
          <button 
            class="btn btn-danger pull-left align-middle cancelBtn"
            v-if="editableItem.id == item.itemId" 
            v-on:click="
              showConfirmDiscardModal(
                item, 
                category.items.indexOf(item),
                categories.indexOf(category)
              )"
            >Cancel</button>
        </td>
    </tr>
  </tbody>
</template>

<script>

import lodash from 'lodash';

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
      },
      alert: {
        isVisible: true,
        type: null,
        summary: null,
        message: null,
      }
    }
  },

  created() {
    bus.$on('userConfirmedUpdateIntention', (data) => {
      // Make the updateItem API call
      // If successful, udpdat the state, create a new view clone, and exit edit mode
      this.$store.commit('updateItem', data);
      bus.$emit('showSuccessAlert', data.itemStateName);
      this.exitEditMode();
    });
  },

  computed: {
    category () {
      return this.categoryItems;
    },

    // In order to get the index of the category, we are passing the entire categories object down as a prop.
    // Is there a better way? 
    categories () {
      return this.categoriesObj;
    },

    categoryItemsState () {
      return this.$store.getters.getCategoriesAndItems;
    }
  },

  methods: {
    /** 
      When a user clicks on a row (item), we want to make each input in this row writable. 
      There must only ever be *one* item in edit mode
    **/
    makeItemEditable(itemId, itemIndex, catId, catIndex) {
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
      console.log(catIndex);
      // Compare the view item with the item state
      const viewItemIsEqualToItemState = this.compareViewWithState(this.categories, this.categoryItemsState);
      
      if(viewItemIsEqualToItemState) {
        // If the item hasn't actually been changed, just set it back to readonly - no need to display a modal
        this.exitEditMode();
      } else {
        // Emit the event to the modal component
        const itemState = this.categoryItemsState[catIndex].items[itemIndex];
        const modalData = {
          title: 'Are you sure you want to update "' + itemState.name + '"? This will take effect immediately in your live menu.',
          trigger: {
            item: item,
            itemStateName: itemState.name,
            itemIndex: itemIndex,
            catIndex: catIndex,
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

    resetItem(trigger) {
      const viewItem = this.categories[trigger.catIndex].items[trigger.itemIndex];
      const itemState = this.categoryItemsState[trigger.catIndex].items[trigger.itemIndex];
      // Set the view item to its pre-edit state
      Object.assign(viewItem, itemState);
      // Set editableItem to null (and the item will exit edit mode)
      this.exitEditMode();
    },

  }
}
</script>

<style scoped>
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

  .buttons {
    border: none !important;
  }

  .cancelBtn {
    background-color: #404040
  }

  .cancelBtn:hover {
    background-color: #1a1a1a;
  }

  .cancelBtn:active {
    background-color: #000000
  }
</style>