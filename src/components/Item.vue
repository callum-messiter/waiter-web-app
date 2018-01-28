<template>
  <tbody>
    <tr class="item-row" v-for="item in category.items">
        <td class="item-name text-left col-md-3">
          <input
            type="text"
            class="form-control"
            v-model="item.name"
            v-bind:readonly="editMode.item.id != item.itemId"
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
            v-bind:readonly="editMode.item.id != item.itemId"
            v-on:dblclick="
              makeItemEditable(
                item.itemId,
                category.items.indexOf(item),
                category.categoryId,
                categories.indexOf(category)
              )"
          >
        </td>
        <td class="item-description text-left col-md-8">
          <input
            type="text"
            class="form-control"
            v-model="item.description"
            v-bind:readonly="editMode.item.id != item.itemId"
            v-on:dblclick="
              makeItemEditable(
                item.itemId,
                category.items.indexOf(item),
                category.categoryId,
                categories.indexOf(category)
              )"
          >
        </td>
        <td class="buttons" v-if="editMode.item.id == item.itemId">
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

  </tbody>
</template>

<script>
// Components

// Mixins
import functions from '../mixins/functions';

// Dependencies
import cloneDeep from 'clone-deep';
import lodash from 'lodash';

// Events bus
import { bus } from '../main';

export default {
  name: 'Item',
  props: ['categoriesObj', 'categoryItems'],
  mixins: [functions],

  data() {
    return {
      editMode: {
        active: false,
        item: {
          id: null,
          catId: null,
          index: null,
          catIndex: null
        }
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

    /**
      This event is emitted by the modal component, when the user clicks the "Discard Changes" button
    **/
    bus.$on('userConfirmation_discardItemChanges', (trigger) => {
      this.resetItem(trigger);
    });

    /**
      This event is emitted by the Category component, once an item has been updated in the database.
      Ideally we would have all item-based functionality in this component, but there is an issue with
      events firing n times, where n = number of items (I can't figure out a better workaround yet)
    **/
    bus.$on('exitItemEditMode', () => {
      this.exitEditMode();
    });

  },

  computed: {
    /**
      This is a prop, passed down from the (parent) Category component. It is a clone of the state, and when
      the state is updated, the changes are reflected in the view
    **/
    category () {
      return this.categoryItems;
    },

    /**
       The same as above, but it represents the entire categories array (every category in the menu, plus each category's items).
       In order to get the index of the category, we are passing the entire categories object down as a prop. Is there a better way?
    **/
    categories () {
      return this.categoriesObj;
    },

    /**
      This is the actual state. We use this only to check if the view has departed from the state, which
      allows us to check, for example, if the user has actually changed an item.
      Based on this information, we may or not may display a "Sure you want to discard your changes" warning, for example
    **/
    categoryItemsState () {
      return this.$store.getters.getCategoriesAndItems;
    }
  },

  methods: {
    /**
      "Edit Mode" simply means that a user has double clicked the item so that he can edit it.
    **/
    activateNewItemEditMode() {
      // Only activate edit mode on the new item, if none of the existing items are in edit mode
      if(!this.editMode.active) {
        this.newItem.isBeingEdited = true;
      }
    },

    /**
      The "new item" is a faded template used to create a new item. The user can fill out the fields, and once
      he saves the item, or discards it, we have to reset it back to its template form
    **/
    resetNewItem() {
      this.newItem.data = {itemId: '', name: '', price: '', description: ''}
      this.newItem.isBeingEdited = false;
    },

    /**
      When a user double clicks a row in the table (item), we want to make each input in this row writable.
      There must only ever be *one* item in edit mode
    **/
    makeItemEditable(itemId, itemIndex, catId, catIndex) {
      // In any case, set the newItem to its default view state when a user double-clicks an existing item
      if(this.newItem.isBeingEdited) {
        this.newItem.data = {itemId: null, name: null, price: null, description: null}
        this.newItem.isBeingEdited = false;
      }
      // Only one item at a time can be editable: If there currently are no editable items, then make the clicked view-item editable
      if(!this.editMode.active) {
        this.makeClickedItemEditable(itemIndex, itemId, catId, catIndex);
      // If there is another view item that is already editable...
      } else {
        // If edit mode was activated, but the user didn't modify the item, then we can activate edit mode on the clicked item
        if(_.isEqual(this.categories, this.categoryItemsState)) {
          this.makeClickedItemEditable(itemIndex, itemId, catId, catIndex);
        }
      }
    },

    /**
      When the user makes changes to an item and clicks the "Save" button, we want to display a warning to ask
      him to confirm that he indeed wishes to update the item
    **/
    showConfirmUpdateModal(item, itemIndex, catIndex) {
      // Compare the view item with the item state
      if(_.isEqual(this.categories, this.categoryItemsState)) {
        // If the item hasn't actually been changed, just set it back to readonly - no need to display a modal
        this.exitEditMode();
      } else {
        // Emit the event to the modal component
        const itemStateName = this.categoryItemsState[catIndex].items[itemIndex].name;
        this.showModal(
          'item_confirm_save_changes',
          'Are you sure you want to update "' + itemStateName + '"? This will take effect immediately in your live menu.',
          'Continue Editing',
          'Save Changes',
          {item, itemStateName, itemIndex, catIndex},
        );
      }
    },

    /**
      When the user makes changes to an item and clicks the "Cancel" button, we want to display a warning to ask
      him to confirm that he indeed wishes to discard the changes he has made to the item
    **/
    showConfirmDiscardModal(item, itemIndex, catIndex) {
      // First we want to check if the view has actually been changed by the user (they can activate edit mode on a item and then n click cancel without making any changes)
      if(_.isEqual(this.categories, this.categoryItemsState)) {
        // If the item hasn't actually been changed, just set it back to readonly - no need to display a modal
        this.exitEditMode();
      } else {
        // If the item has actually been edited by the user, then we want to display the cancel-warning modal
        const itemState = this.categoryItemsState[catIndex].items[itemIndex];
        this.showModal(
          'item_confirm_discard_changes',
          'Are you sure you want to discard your changes to "' + itemState.name + '"?',
          'Continue Editing',
          'Discard',
          {item, itemIndex, catIndex}
        );
      }
    },

    /**
      When the user clicks the delete button, we want to show a modal so they can confirm their deletion
    **/
    showConfirmDeleteModal(itemId, itemIndex, catIndex) {
      const itemState = this.categoryItemsState[catIndex].items[itemIndex];
      // Build the confirm_delete modal
      this.showModal(
        'item_confirm_delete',
        'Are you sure you want to delete "' + itemState.name + '"? It will become invisible to your customers.',
        'Cancel',
        'Delete Item',
        {itemId, itemIndex, catIndex}
      );
    },

    /**
      This simply sets the editable item back to readonly
    **/
    exitEditMode() {
      this.editMode = {
        active: false,
        item: {
          index: null,
          id: null,
          catId: null,
          catIndex: null
        }
      }
    },

    /**
      This returns the view item back to its pre-edit state
    **/
    resetItem(trigger) {
      const viewItem = this.categories[trigger.catIndex].items[trigger.itemIndex];
      const itemState = this.categoryItemsState[trigger.catIndex].items[trigger.itemIndex];
      // Set the view item to its pre-edit state
      Object.assign(viewItem, itemState);
      // Set editMode.item to null (and the item will exit edit mode)
      this.exitEditMode();
    },

    /**
      This makes the clicked item editable
    **/
    makeClickedItemEditable(itemIndex, itemId, catIndex, catId) {
      this.editMode = {
        active: true,
        item: {
          index: itemIndex,
          id: itemId,
          catId: catId,
          catIndex: catIndex
        }
      }
    }

  }
}
</script>

<style scoped>

  @font-face {
    font-family: 'grotesque';
    src: url("../fonts/grotesque.otf");
  }

  td {
    padding: 0 !important;
    border: none !important;
  }

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
    margin-top: 6px;
  }

  .buttons {
    width: 200px;
    position: absolute;
    right: -30px;
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

  tbody {
    background-color: #3a3a3a;
  }

  .item-name {
    background-color: #3a3a3a !important;
  }

  input.form-control {
    background-color: #3a3a3a !important;
    color: #fff;
    font-family: 'grotesque';
  }

  input:focus {
    background-color: #262626 !important;
    outline: none;
  }

</style>
