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
        // 
        this.$http.post('http://localhost:3000/api/category/create', {
          name: newCategory.name,
          menuId: JSON.parse(localStorage.menu).menuId
        }, {
          headers: {Authorization: JSON.parse(localStorage.user).token}
        }).then((res) => {
          if(res.status == 200) {
            newCategory.categoryId = res.body.data.createdCategoryId;
            this.$store.commit('addCategory', newCategory);
            this.resetNewCategory();

            const alert = {
              isVisible: true,
              type: 'success',
              message: 'New category "' + newCategory.name + '" was successfully added to your menu!' // Must update these to user-friendly messages (API -> devMsg, userMsg)
            }
            bus.$emit('showAlert', alert);
          }
        }).catch((res) => {
          this.resetNewCategory();
          if(res.body && res.body.error) {
            // Display the error message
            const alert = {
              isVisible: true,
              type: 'error',
              message: res.body.msg // Must update these to user-friendly messages (API -> devMsg, userMsg)
            }
            bus.$emit('showAlert', alert);

          } else if(res.status && res.statusText) {
            console.log(res.status + " " + res.statusText);
          } else {
            console.log(res);
          }
        });
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
      return JSON.parse(localStorage.restaurant);
    },

    categoriesState () {
      return this.$store.getters.getCategoriesAndItems;
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
