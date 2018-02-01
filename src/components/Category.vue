<template>
  <div class="panel-group" id="accordion">
    <div v-for="category in categories" class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <!-- Category name -->
          <a
            data-toggle="collapse"
            data-parent="#accordion"
            v-bind:href="'#' + category.categoryId"
            >{{category.name}} ({{category.items.length}})
          </a>
          <!-- Delete Icon (visible by default)
          <span
            class="glyphicon glyphicon-trash pull-right align-middle"
            v-if="!editMode.active || editMode.category.id != category.categoryId"
            v-on:click="showDeleteCategoryModal(
              category.categoryId,
              categories.indexOf(category),
              category.name,
              category.items.length
            )">
          </span>
          -->
          <!-- Edit Icon (visible by default) -->
          <span
            class="glyphicon glyphicon-pencil pull-right align-middle"
            v-on:click="showEditCategoryModal(
              category.categoryId,
              categories.indexOf(category)
            )">
          </span>
          <!-- Add Item Icon (visible by default) -->
          <span
            class="glyphicon glyphicon-plus pull-right"
            v-on:click="showAddItemModal(
              category.categoryId,
              categories.indexOf(category),
              category.name
            )">
          </span>
        </h4>
      </div>
      <div
        class="panel-collapse collapse"
        v-bind:class="{'in': categories.indexOf(category) == 0}"
        v-bind:id="category.categoryId"
      >
        <!-- Each category is a collapsable panel, containing a table of the category's items -->
        <div class="panel-body">
          <table class="table">
            <thead class="thead-default">
              <tr>
                <th class="text-center name">Name</th>
                <th class="text-center price">Price</th>
                <th class="text-center description">Description</th>
              </tr>
            </thead>
            <!-- Each item is a row (<tr>) in the table body (<tbody>). We have to pass the categories object in too, because we need the category index, which we get by using "categories.indexOf(category)" in the item component" -->
            <item :categoriesObj="categories" :categoryItems="category"></item>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Components
import Item from './Item';

// Mixins
import functions from '../mixins/functions';

import { bus } from '../main';

import lodash from 'lodash';

export default {
  name: 'Category',
  components: {
    'item': Item
  },
  mixins: [functions],

  data() {
    return {
    }
  },

  created() {
    /**
      If we listen for these event in the Item component, the action function fires n times, where n = num of items (all of which are deleted). This seems to be caused by there being, effectivey, n "copies" of the item template. Why doesn't the same thing happen with deleting categories?
    **/
    bus.$on('userConfirmation_addNewItem', (data, trigger) => {
      this.createNewItem(data, trigger.catId, trigger.catIndex)
    });

    bus.$on('userConfirmation_deleteItem', (trigger) => {
      this.deleteItem(trigger);
    });

    bus.$on('userConfirmation_saveItemChanges', (data, trigger) => {
      this.updateItem(data, trigger);
    });
  },

  computed: {
    categories() {
      return this.$store.getters.getCategoriesAndItems;
    }
  },

  methods: {

    showEditCategoryModal(catId, catIndex) {
      const catName = this.categories[catIndex].name;
      this.showModalForm(
        'category_edit',
        'Update your category ' + catName,
        'Save',
        {catIndex, catId},
        {name: catName},
        'Delete Category'
      );
    },

    /**
      Here we display a warning message to the user once they've clicked to delete a category. The Modal component
      listens for the event we fire here
    **/
    showDeleteCategoryModal(catId, catIndex, catName, numItems) {
      // We display this modal to force the user to confirm that they indeed wish to delete the category
      const prefix = 'Are you sure you want to delete your category "' + catName + '"? ';
      var noun, msg;
      if(numItems < 1) {
        msg = 'It will become invisible to your customers.';
      } else {
        (numItems == 1) ? noun = 'item' : noun = 'items';
        msg = 'The category, and its ' + numItems  + ' ' + noun + ', will become invisible to your customers.';
      }

      this.showModal(
        'category_confirm_delete',
         prefix + msg,
        'Cancel',
        'Delete Category',
        {catIndex, catId}
      );
    },

    /**
      Here we send a request to the API to deactivate the category (by setting categories.active = 0). If the data is successfully persisted to the database, we also update the state, which is then reflected in the view (the category panel disappears). It is important to keep the backend data and the front-end state syncronised
    **/
    deleteCategory(trigger) {
      this.$http.put('category/deactivate/'+trigger.catId, {}, {
        headers: {Authorization: JSON.parse(localStorage.user).token}

      }).then((res) => {
        if(res.status == 200) {
          // If the updates were successfully persisted to the database, update the state to reflect the changes
          this.$store.commit('deleteCategory', trigger.catIndex);
          this.showAlert('success', 'Your category was successfully deleted!');
        }

      }).catch((res) => {
        this.handleApiError(res);
      });
    },

    /**
      Here we send a request to the API to add the new item to the menu. If the data is successfully persisted to the database, we also update the state, which is then reflected in the view (the item appears at the top of its category's list). It is important to keep the backend data and the front-end state syncronised
    **/
    createNewItem(data, catId, catIndex) {
      // Something weird is happening: the values of the data object in the _then_ block are empty strings
      var newItem = {
        itemId: '',
        name: data.name,
        price: data.price,
        description: data.description
      }

      this.$http.post('item/create', {
        name: data.name,
        price: data.price,
        description: data.description,
        categoryId: catId
      },
        {headers: {Authorization: JSON.parse(localStorage.user).token}

      }).then((res) => {
        if(res.status == 200 || res.status == 201) {
          // Set the itemId that was assigned by the server
          newItem.itemId = res.body.data.createdItemId;
          this.$store.commit('addItem', {
            item: newItem,
            catIndex: catIndex
          });

          this.showAlert('success', 'Your new item was successfully added to your menu!');
        }
      }).catch((res) => {
        this.handleApiError(res);
      });
    },

    /**
      Here we send the updated item data to the API, and if it is successfully persisted to the database,
      we also update the state, which is then reflected in the view. It is important to keep the backend data and the
      front-end state syncronised
    **/
    updateItem(data, trigger) {
      // Something weird is happening: the values of the data object in the _then_ block are empty strings
      const updatedItem = {
        itemId: data.itemId,
        name: data.name,
        price: data.price,
        description: data.description
      }

      this.$http.put('item/update/'+updatedItem.itemId, {
        name: data.name,
        price: data.price,
        description: data.description
      }, {
        headers: {Authorization: JSON.parse(localStorage.user).token}

      }).then((res) => {
        const payload = {updatedItem, trigger};
        this.$store.commit('updateItem', payload); // Update the item state
        this.showAlert('success','Your item was successfully updated!'); // Display the alert if successful
      }).catch((res) => {
        this.handleApiError(res);
      });
    },

    /**
      Here we send a request to the API to deactivate the item (by setting items.active = 0). If the data is successfully persisted to the database, we also update the state, which is then reflected in the view (the item disappears). It is important to keep the backend data and the front-end state syncronised
    **/
    deleteItem(trigger) {
      this.$http.put('item/deactivate/'+trigger.itemId, {}, {
        headers: {Authorization: JSON.parse(localStorage.user).token}

      }).then((res) => {
        this.$store.commit('deleteItem', trigger);
        // Display the alert if successful
        this.showAlert('success', 'Your item was successfully deleted!');

      }).catch((res) => {
        this.handleApiError(res);
      });
    },

    showAddItemModal(catId, catIndex, catName) {
      this.showModalForm(
        'item_add',
        'Add a new item to ' + catName,
        'Save',
        {catIndex, catId}
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

  .accordion {
    border: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .panel {
    border: none !important;
  }

  .panel-body {
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    border-bottom: 0 !important;
  }

  .panel-heading {
    background-color: #151515;
    color: #469ada !important;
    padding-right: 3px;
  }

  .panel-title {
    height: 17.6px;
  }

  table {
    border: none !important;
    margin-bottom: 0 !important;
    font-family: 'grotesque';
    color: #fff;
  }

  thead {
    background-color: #262626;
  }

  .table>thead>tr>th {
    border: none;
  }

  .table>thead>tr {
    border-top: 1px solid #151515;
    border-bottom: 1px solid #151515;
  }

  .name, .price {
    border-right: 1px solid #151515 !important;
  }

  .glyphicon {
    padding-right: 10px;
    cursor: pointer;
    font-size: 10px;
  }

  .categoryName {
    background: none;
    border: none;
    text-align: center;
  }

  .categoryName:focus {
    outline: none;
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
  }

  .editMode {
    border-bottom: solid 2px white !important;
    display: inline;
    padding-bottom: 4px;
  }

  a {
    margin-left: 15px;
  }

</style>
