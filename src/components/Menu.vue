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
                    v-on:click="deleteItem(item.itemId)">Delete</button>
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
        :showCancelUpdateModal="modals.cancelUpdate">
      </modal>
    </div>
  </div>
</template>

<script>
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
      modals: {
        cancelUpdate: {
          isVisible: false,
          triggerItemId: null,
          title: 'Are you sure you want to discard your changes?',
          buttons: {
            continueEditing: 'Continue Editing',
            discardChanges: 'Discard'
          }
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
      this.items.forEach((item) => {
          // The editable item may be the current item
          if(item.isUpdatable && item.itemId != itemId) {
            areAnyOtherItemsUpdatable = true;
          }
      });
      // If there currently are no updatable items, then make this item updatable
      if(areAnyOtherItemsUpdatable) {
        // 
        alert('Please finish editing the other item!');
      } else {
        // Find the item by referencing the ID
        const objIndex = this.items.findIndex((item => item.itemId == itemId));
        // Change the isUpdatable property of this item
        this.items[objIndex].isUpdatable = true;
      }
    },
    cancelUpdate(item) {
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
        this.modals.cancelUpdate.isVisible = true; // Here we mofidy the values that are bound to our _showCancelUpdateModal_ prop. 
        this.modals.cancelUpdate.triggerItemId = itemId;
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
      // If any item data actually changed, display a flash message
    },
    deleteItem(itemId) {
      // Delete the item from the state and update the clone
      this.$store.commit('deleteItem', itemId);
      this.items = cloneDeep(this.itemsState);
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
