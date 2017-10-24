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

export default {
  name: 'Item',
  props: ['renderCategoryItems'],
  data() {
    return {
      editableItem: {
        id: null,
        catId: null,
        index: null,
        catIndex: null
      }
    }
  },
  computed: {
    category () {
      return this.renderCategoryItems;
    }
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