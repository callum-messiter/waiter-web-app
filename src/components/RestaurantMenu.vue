<template>
  <div class="menu-wrapper col-md-10 col-md-offset-1">
    <!-- Menu name/title, other information -->
    <div class="row">
      <div class="col-md-8">
        <h2 class="pull-left restaurantName">{{restaurant.name}}</h2>
      </div>
      <div class="input-group col-md-4 pull-right newCatInput">
        <input 
          class="form-control"
          type="text" 
          placeholder="E.g. Starters"
          v-model="newCategory.name"
        >
        <span class="input-group-btn">
          <button 
            class="btn btn-primary" 
            type="button"
            v-on:click="addCategory"
            >Add Category
          </button>
        </span>
      </div>
    </div>
    <div class="row">
      <!-- The menu content -->
      <div class="categories-accordion">
        <alert></alert>
        <category></category>
      </div>
    </div>
  </div>
</template>

<script>

// Events bus
import { bus } from '../main';

// Components
import Category from './Category';
import Alert from './Alert';

export default {
  name: 'RestaurantMenu',
  components: {
    'category': Category,
    'alert': Alert
  },
  data() {
    return {
      newCategory: {
        categoryId: null,
        name: null,
        items: []
      }
    }
  },

  created () {
    const menuId = JSON.parse(localStorage.menu).menuId;
    const token = JSON.parse(localStorage.user).token;
    // Get the menu object and add it to the store
    this.$http.get('http://localhost:3000/api/menu/' + menuId, { 
      headers: {Authorization: token}
    }).then((res) => {
      this.$store.commit('setMenu', res.body.data);
    }).catch((res) => {
      if(res.body && res.body.error) {
        // Display the error message
        const alert = {
          isVisible: true,
          type: 'error',
          message: res.body.msg
        }
        bus.$emit('showAlert', alert);

      } else if(res.status && res.statusText) {
        console.log(res.status + " " + res.statusText);
      } else {
        console.log(res);
      }
    });
  },
  
  methods: {
    addCategory() {
      const newCategory = this.newCategory;
      // Check that the user has provided a category name
      if(newCategory.name == null || newCategory.name == '') {
        const modalData = {
          name: 'empty_fields',
          isVisible: true,
          title: "Every category must have a name!",
          buttons: {
            primary: 'Back to the menu',
          }
        }
        bus.$emit('showModal', modalData);
      } else {
        // For testing, we need unique IDs (these will be assigned by the server)
        newCategory.categoryId = new Date().getTime();
        this.$store.commit('addCategory', newCategory);
        this.resetNewCategory();
      }
    },

    resetNewCategory() {
      this.newCategory = {
        categoryId: null,
        name: null,
        items: []
      }
    }
  },

  computed: {
    restaurant() {
      return this.$store.getters.getRestaurant;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .categories-accordion {
    margin-top: 20px;
  }

  img {
    left: 20px;
    height: 70px;
    width: 70px;
  }

  .restaurantName {
    margin-top: 42px;
  }

  .newCatInput {
    top: 40px;
  }
</style>
