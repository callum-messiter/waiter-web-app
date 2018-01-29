<template>
  <tbody>
    <tr class="item-row" v-for="item in category.items">
      <td class="item-name text-left col-md-3">
        <input
          type="text"
          readonly
          class="form-control"
          v-model="item.name"
          v-on:dblclick="
            showEditItemModal(
              category.items.indexOf(item),
              categories.indexOf(category)
            )"
        >
      </td>
      <td class="item-price text-left col-md-1">
        <money 
          type="text"
          readonly
          class="form-control" 
          v-model="item.price" 
          v-bind="money"
          v-on:dblclick="
            showEditItemModal(
              category.items.indexOf(item),
              categories.indexOf(category)
            )"
        ></money>
      </td>
      <td class="item-description text-left col-md-8">
        <input
          type="text"
          readonly
          class="form-control"
          v-model="item.description"
          v-on:dblclick="
            showEditItemModal(
              category.items.indexOf(item),
              categories.indexOf(category)
            )"
        >
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
import {Money} from 'v-money'

// Events bus
import { bus } from '../main';

import config from '../../config/config';

export default {
  name: 'Item',
  components: {Money},
  props: ['categoriesObj', 'categoryItems'],
  mixins: [functions],

  data() {
    return {
    }
  },

  created() {

    /**
      This event is emitted by the modal component, when the user clicks the "Discard Changes" button
    **/
    bus.$on('userConfirmation_discardItemChanges', (trigger) => {
      this.resetItem(trigger);
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
    },

    money() {
      return config.money;
    }
  },

  methods: {

    showEditItemModal(itemIndex, catIndex) {
      // Get the current state of the selected item. We will use this data to check if the
      // form data inputted by the user has departed from the state. If the user opens the modal
      // but makes no changes to the item data, we shouldn't send the API request
      const data = this.categoryItemsState[catIndex].items[itemIndex];
      const itemId = data.itemId;
      const itemData = {
        name: data.name,
        price: data.price,
        description: data.description
      }
      // Show the form
      this.showModalForm(
        'item_edit',
        'Update your item ' + itemData.name,
        'Save',
        {itemId, itemIndex, catIndex},
        itemData,
        'Delete Item'
      );
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

  input[readonly] input[readonly]:focus {
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

</style>
