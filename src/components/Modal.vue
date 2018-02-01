<template>
  <transition name="modal" v-if="modal.isVisible">
   <div class="modal" style="display: block">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
          </h4>
        </div>

        <div class="modal-body">{{modal.title}}</div>

        <!--

          The modal will contain different buttons depending on the context in which it has been called. Here are a list of actions which trigger the modal:

          (x) name of button which triggers modal | component->method | component where we listen to the event sent back by the modal

          (1) Add Category (empty fields) | RestaurantMenu->addCategory | N/A (v-on:click="modal.isVisible = false;")
          (2) Save New Item (empty fields) | Item->createNewItem | N/A (v-on:click="modal.isVisible = false;")
          (3) Delete Category | Category->showDeleteCategoryModal | Category (userConfirmation_deleteCategory)
          (4) Delete Item | Item->showConfirmDeleteModal | Category (userConfirmation_deleteItem)
          (5) Save Item Changes | Item->showConfirmUpdateModal | Category (userConfirmation_saveItemChanges)
          (6) Discard Item Changes | Item->showConfirmDiscardModal | Item (userConfirmation_discardItemChanges)

          *****************************************************************************************************************************

          To add a new modal dynamically, simply follow these steps:

          (1) From within another component, call the showModal method from the function.js file, and pass to it the modal data. Choose a descriptive "modal name" which will be passed to the method as an argument

          (2) Decide which buttons your modal should include, and add their HTML inside the modal-footer div, below.
            (a) On click, you should call the emitUserConfirmation method, and make sure you pass in the event name as an argument.
            (b) The line `v-if="modal.name == '{modal_name}'"` is required; the modal_name must be equal to the modal_name parameter you pass to the showModal method in Step 1

          (3) When the user clicks an actionable button inside the modal, this component will then emit an event to the target component to alert it that the user has confirmed their intention. In this target component, which will execute the subsequent logic, you should add the following to the created hook:

            bus.$on({eventName}, (trigger) => {
              // execute logic
            });

          Ensure that the first argument of the above callback function matches the first argument you pass to the emitUserConfirmation method in this component. The event names must be the same; the target component will be listening for it.
        -->
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
            v-on:click="emitUserConfirmation('userConfirmation_deleteCategory', modal.trigger)">
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
            v-on:click="emitUserConfirmation('userConfirmation_deleteItem', modal.trigger)">
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
            v-on:click="emitUserConfirmation('userConfirmation_saveItemChanges', modal.trigger)">
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
            v-on:click="emitUserConfirmation('userConfirmation_discardItemChanges', modal.trigger)">
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

  created () {
    bus.$on('showModal', (modal) => {
      Object.assign(this.modal, modal);
    });
  },

  methods: {
    /**
      We use the event bus to communicate between other components and this modal component. This means that we don't need to repeat the modal HTML/CSS markup in every component which triggers the modal to be displayed.

      First, the trigger component emits and event to this modal component, which renders the modal with the data passed to it, making it visible to the user.

      Then, when one of the actional modal buttons is clicked (e.g. Confirm Delete Category), this modal, via the below method, emits and event back to the target component. The target component will be listening to the relevant event, and once receiving it, will execute the necessary logic (e.g. by calling the deleteCategory method.)
    **/
    emitUserConfirmation(eventName, trigger) {
      bus.$emit(eventName, trigger);
      this.modal.isVisible = false;
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @font-face {
    font-family: 'grotesque';
    src: url("../fonts/grotesque.otf");
  }

  .modal-dialog {
    padding-top: 10%;
    width: 400px !important;
  }

  .modal-content {
    background-color: #151515;
    font-family: 'grotesque';
    color: #fff;
    border: 3px solid #469ada;
    border-radius: 3px;
    padding: 10px;
  }

  .modal-header {
    border: none;
  }

  .modal-body {
    font-size: 16px;
  }

  .modal-footer {
    border: none;
    text-align: center;
    padding: 15px;
  }

  .btn {
    font-size: 14px;
    padding: 5px 10px;
    background-color: #469ada;
    border: 1px solid #469ada;
    border-radius: 3px;
    font-weight: bold;
  }

  @media (min-width: 768px) {
    .modal-dialog {
      width: 400px !important;
    }
  }

</style>
