<template>
  <transition name="modal" v-if="modal.isVisible">
   <div class="modal" style="display: block">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
          </h4>
        </div>

        <div class="modal-body">{{modal.title}}</div>

        <!-- The modal will contain different buttons depending on the context in which it has been called -->
        <div class="modal-footer">

          <!-- 
            (1) User clicks "Add new category" but has left the category-name field blank 
            (2) User clicks "Save new item" but at least one of the fields is blank
          -->
          <button 
            class="btn btn-primary"
            v-if="modal.name == 'newCategory_fields_blank' || modal.name == 'newItem_fields_blank'"
            v-on:click="modal.isVisible = false;">
            {{modal.buttons.primary}}
          </button>

          <!--
            (3) User clicks the "Delete Category" icon; we show a modal asking the user to confirm that they really want to delete it
          -->
          <button 
            class="btn btn-primary"
            v-if="modal.name == 'category_confirm_delete'"
            v-on:click="modal.isVisible = false;">
            {{modal.buttons.primary}}
          </button>

          <button 
            class="btn btn-danger"
            v-if="modal.name == 'category_confirm_delete'" 
            v-on:click="emitDeleteCategoryConf(modal.trigger)">
            {{modal.buttons.warning}}
          </button>

          <!--
            (4) User clicks the "Delete Item" button; we show a modal asking the user to confirm that they really want to delete it
          -->
          <button 
            class="btn btn-primary"
            v-if="modal.name == 'item_confirm_delete'"
            v-on:click="modal.isVisible = false;">
            {{modal.buttons.primary}}
          </button>

          <button 
            class="btn btn-danger"
            v-if="modal.name == 'item_confirm_delete'" 
            v-on:click="emitDeleteItemConf(modal.trigger)">
            {{modal.buttons.warning}}
          </button>

          <!-- 
            (5) User clicks the "Save Item Changes" button; we show a modal asking the user to confirm that they really want to save the changes
          -->
          <button 
            class="btn btn-primary"
            v-if="modal.name == 'item_confirm_save_changes'"
            v-on:click="modal.isVisible = false;">
            {{modal.buttons.primary}}
          </button>

          <button 
            class="btn btn-danger" 
            v-if="modal.name == 'item_confirm_save_changes'"
            v-on:click="emitSaveItemChangesConf(modal.trigger)">
            {{modal.buttons.warning}}
          </button>

          <!--
            (6) User clicks the "Discard Item Changes" button; we show a modal asking the user to confirm that they really want to discard the changes they have made
          -->
          <button 
            class="btn btn-primary"
            v-if="modal.name == 'item_confirm_discard_changes'"
            v-on:click="modal.isVisible = false;">
            {{modal.buttons.primary}}
          </button>

          <button 
            class="btn btn-danger" 
            v-if="modal.name == 'item_confirm_discard_changes'"
            v-on:click="emitDiscardItemChangesConf(modal.trigger)">
            {{modal.buttons.warning}}
          </button>

        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>

import { bus } from '../main';

export default {
  name: 'Modal',

  data () {
    return {
      modal: {
        name: null,
        isVisible: false,
        trigger: {},
        title: null,
        buttons: {}
      }
    }
  },
  /**
    The Modal component listens to the "showModal" event. Whenever we need to display a modal, we emit this event from
    the relevant component. 

    The event we emit will contain the modal data, including the button texts, the message, and the item and/or category that was clicked to trigger the modal.

    We specify the name of the modal in the base component, and as you can see in the template above, we render certain buttons depending on which type of modal is to be displayed. 

    We also specify the name of the base component in modal.trigger.component. If the Item component sends a event with modal.name 'confirm_delete', and the category component sends the same, we can handle this without repeating the methods below for each component, by affixing the component name to the event name, and listening for the events in the respective components. E.g. the Item component may listen for an event named "confirm_delete_item". This ensures events are sent to the correct component, which will then handle the resource modification (update, discard, delete).
  **/
  created () {
    bus.$on('showModal', (modal) => {
      Object.assign(this.modal, modal);
    });
  },

  methods: {

    /**

      List of actions which trigger the modal 
      
      (x) name of button which triggers modal | component->method | component where we listen to the event sent back by the modal

      (1) Add Category (empty fields) | RestaurantMenu->addCategory | N/A (v-on:click="modal.isVisible = false;")
      (2) Save New Item (empty fields) | Item->createNewItem | N/A (v-on:click="modal.isVisible = false;")
      (3) Delete Category | Category->showDeleteCategoryModal | Category (confirm_delete)
      (4) Delete Item | Item->showConfirmDeleteModal | Category (confirm_delete)
      (5) Save Item Changes | Item->showConfirmUpdateModal | Category (confirm_update)
      (6) Discard Item Changes | Item->showConfirmDiscardModal | Item (confirm_discard_changes)

    **/

    // (3) Emit this event when the user clicks the modal's "Delete Category" button. The component listening for this event
    // will then delete the category
    emitDeleteCategoryConf(trigger) {
      bus.$emit('userConfirmation_deleteCategory', trigger);
      this.modal.isVisible = false;
    },


    // (4) Emit this event when the user clicks the modal's "Delete Item" button. The component listening for this event
    // will then delete the item
    emitDeleteItemConf(trigger) {
      bus.$emit('userConfirmation_deleteItem', trigger);
      this.modal.isVisible = false;
    },

    // (5) Emit this event when the user clicks the modal's "Save Item Changes" button. The component listening for this event
    // will then save the changes
    emitSaveItemChangesConf(trigger) {
      bus.$emit('userConfirmation_saveItemChanges', trigger);
      this.modal.isVisible = false;
    },

    // (6) Emit this event when the user clicks the modal's "Cancel Item Changes" button. The component listening for this event
    // will then reset the view to its pre-edit state
    emitDiscardItemChangesConf(trigger) {
      bus.$emit('userConfirmation_discardItemChanges', trigger);
      this.modal.isVisible = false;
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .modal-dialog {
    padding-top: 10%;
  }
</style>
