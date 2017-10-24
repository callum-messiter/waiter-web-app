<template>
  <div class="menu-wrapper col-md-10 col-md-offset-1">
    <!-- Menu name/title, other information -->

    <!-- Notification alerts for item/category updates/deletions --> 
    <alert></alert>
    
    <!-- The menu content -->
    <div class="categories-accordion">
      <category :categoriesObj="categories"></category>
    </div>

    <!-- Confirmation modals triggered when the user initialises an "update" or "deletion" -->
    <modal></modal>

  </div>
</template>

<script>

// Dependencies
import cloneDeep from 'clone-deep';
import lodash from 'lodash';

import { bus } from '../main';

// Components
import Category from './Category';
import Modal from './Modal';
import Alert from './Alert';

export default {
  name: 'Menu',
  components: {
    'category': Category,
    'modal': Modal,
    'alert': Alert
  },
  data() {
    return {
      categories: []
    }
  },
  created() {
    // Clone the item's state so we can compare the view with the state
    this.categories = cloneDeep(this.categoryItemsState);

    bus.$on('updateCategoriesObj', () => {
      this.categories = cloneDeep(this.categoryItemsState);
    });

    // PROBLEM; if we listen for this event in the item component, all the items in a category are deleted.
    // This is because the item component is rendered four times in the for loop (item in category.items).
    // So the event is caught four times, by each item instance, if you delete any item that isn't the last one of the category.
    // This isn't a huge problem for resetting, updating items, because in this instance 
    bus.$on("userConfirmedDeleteIntention", (trigger) => {
      this.$store.commit('deleteItem', trigger);
      // this.categories = cloneDeep(this.categoryItemsState);
      bus.$emit('updateCategoriesObj');

      const alert = {
        isVisible: true,
        type: 'success',
        message: 'Your item was successfully deleted!'
      } 
      bus.$emit('showAlert', alert);
    });
  },
  methods: {},

  computed: {
    categoryItemsState() {
      return this.$store.getters.getCategoriesAndItems;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
