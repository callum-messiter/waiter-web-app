<template>
  <div class="panel-group" id="accordion">
    <div v-for="category in categories" class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a data-toggle="collapse" data-parent="#accordion" v-bind:href="'#' + category.categoryId">
          {{category.name}}</a>
        </h4>
      </div>
      <div 
        class="panel-collapse collapse"
        v-bind:id="category.categoryId"  
        v-bind:class="{'in': categories.indexOf(category) == 0}"
      >
        <!-- Each category is a collapsable panel, containing a table of the category's items -->
        <div class="panel-body">
          <table class="table table-bordered">
            <thead class="thead-default">
              <tr>
                  <th class="text-center">Name</th>
                  <th class="text-center">Price</th>
                  <th class="text-center">Description</th>
              </tr>
            </thead>
            <!-- Each item is a row (<tr>) in the table body (<tbody>) -->
            <item :renderCategoryItems="category"></item>
          </table>
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
import Item from './Item';

export default {
  name: 'Category',
  props: ['renderCategories'],
  components: {
    'item': Item
  },
  data() {
    return {
    }
  },
  computed: {
    categories () {
      return this.renderCategories;
    }
  }
}
</script>

<style scoped>
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
    background-color: #8d8d8e !important;
    color: white !important;
  }

  table {
    border: 0 !important;
    margin-bottom: 0 !important;
  }

</style>