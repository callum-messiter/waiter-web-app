<template>
  <div class="menu-wrapper col-md-10 col-md-offset-1">
    <!-- Menu name/title, other information -->
    <div class="row">
      <div class="col-md-6">
        <h2 class="pull-left restaurantName">{{restaurant.name}} | Menu</h2>
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
// Components
import Category from './Category';
import Alert from './Alert';

// Mixins
import functions from '../mixins/functions';

// Events bus
import { bus } from '../main';

export default {
  name: 'RestaurantMenu',
  components: {
    'category': Category,
    'alert': Alert
  },
  mixins: [functions],

  data() {
    return {
      newCategory: {
        categoryId: null,
        name: null,
        items: []
      }
    }
  },

  computed: {
    /**
      The API login endpoint returns the user object, the restaurant object, and the menu object/
      We store each in local storage, so that these fundamental details are globally accessible to the application
    **/
    restaurant() {
      return JSON.parse(localStorage.restaurant);
    },

    /** 
      This is the actual state. We use this only to check if the view has departed from the state, which
      allows us to check, for example, if the user has actually changed a category name. 
      Based on this information, we may or not may display a "Sure you want to discard your changes" warning, for example
    **/
    categoriesState () {
      return this.$store.getters.getCategoriesAndItems;
    }
  },
  
  methods: {

    /**
      Here we send a request to the API to add the new category to the menu. If the data is successfully persisted to the database, we also update the state, which is then reflected in the view (the category panel  appears at the top of its accordion). It is important to keep the backend data and the front-end state syncronised
    **/
    addCategory() {
      const newCategory = this.newCategory;
      // Check that the user has provided a category name
      if(newCategory.name == null || newCategory.name == '') {
        this.showModal(
          'newCategory_fields_blank', 
          'Every category must have a name!',
          'Back to the menu'
        );
      } else {
        // If the user has filled in the categoryName field, post it to the API
        this.$http.post('category/create', {
          name: newCategory.name,
          menuId: JSON.parse(localStorage.menu).menuId
        }, {
          headers: {Authorization: JSON.parse(localStorage.user).token}
        }).then((res) => {
          if(res.status == 200) {
            newCategory.categoryId = res.body.data.createdCategoryId;
            this.$store.commit('addCategory', newCategory);
            this.resetNewCategory();
            this.showAlert('success', 'New category "' + newCategory.name + '" was successfully added to your menu!');
          }

        }).catch((res) => {
          this.handleApiError(res);
        });
      }
    },

    /**
      The "new category" data property is bound to the new-category input. The user can fill out the field, and once
      he clicks to add the new category, or discard it, we have to reset it back to its default state
    **/
    resetNewCategory() {
      this.newCategory = {
        categoryId: null,
        name: null,
        items: []
      }
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
    word-break: keep-all  
  }

  .newCatInput {
    top: 40px;
  }
  
</style>
