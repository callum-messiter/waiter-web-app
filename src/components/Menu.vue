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
                    <input type="text" class="form-control" :value="item.name" 
                    v-bind:readonly="!item.isUpdatable" v-on:click="makeItemUpdatable(item.itemId)">
                  </td>
                  <td class="item-price text-left col-md-1">
                    <input type="text" class="form-control" :value="item.price" 
                    v-bind:readonly="!item.isUpdatable" v-on:click="makeItemUpdatable(item.itemId)">
                  </td>
                  <td class="item-description text-left col-md-5">
                    <input type="text" class="form-control" :value="item.description" 
                    v-bind:readonly="!item.isUpdatable" v-on:click="makeItemUpdatable(item.itemId)">
                  </td>
                  <td class="buttons col-md-4">
                    <button v-if="!item.isUpdatable" class="btn btn-danger pull-left align-middle" v-on:click="deleteItem(item.itemId)">Delete</button>
                    <button v-if="item.isUpdatable" class="btn btn-primary pull-left align-middle">Save</button>
                    <button v-if="item.isUpdatable" class="btn btn-danger pull-left align-middle" id="cancelUpdateBtn"
                    v-on:click="cancelUpdate(item)">Cancel</button>
                  </td>
              </tr>
          </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data: function() {
    return {
    }
  },
  methods: {
    deleteItem(itemId) {
      this.$store.commit('deleteItem', itemId);
    },
    // When a user clicks on a row (item), we want to make each input in this row writable
    makeItemUpdatable(itemId) {
      this.$store.commit('makeItemUpdatable', itemId);
    },
    cancelUpdate(item) {
      
    }
  },
  computed: {
    items() {
      return this.$store.getters.getItems;
    },
    item(itemId) {
      return this.$store.getters.getItem;
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
