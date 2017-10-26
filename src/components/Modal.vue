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

        <div class="modal-footer">

          <!-- Triggers Confirm Update Modal -->
          <button 
            class="btn btn-danger" 
            v-if="modal.name == 'confirm_update'"
            v-on:click="emitUpdateConfirmation(modal.trigger)">
            {{modal.buttons.warning}}
          </button>

          <!-- Triggers Cancel Update Modal-->
          <button 
            class="btn btn-danger" 
            v-if="modal.name == 'cancel_update'" 
            v-on:click="emitDiscardConfirmation(modal.trigger)">
            {{modal.buttons.warning}}
          </button>

          <!-- Triggers Confirm Delete Modal -->
          <button 
            class="btn btn-danger"
            v-if="modal.name == 'confirm_delete'" 
            v-on:click="emitDeleteConfirmation(modal.trigger)">
            {{modal.buttons.warning}}
          </button>

          <!-- This button simply hides the modal when the primary button is clicked; appears on all modals -->
          <button 
            class="btn btn-primary" 
            v-on:click="modal.isVisible = false;">
            {{modal.buttons.primary}}
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
      },
      alert: {
        isVisible: true,
        type: null,
        summary: null,
        message: null,
      }
    }
  },
  created () {
    bus.$on('showModal', (modal) => {
      Object.assign(this.modal, modal);
    });
  },

  methods: {
    // When the user confirms they want to discard their item updates, we inform the menu component, triggering a reset of the view item
    emitDiscardConfirmation(trigger) {
      // PROBLEM: We could do this by directly calling a setter in the store, which would reset the clone of the state
      bus.$emit('userConfirmedDiscardIntention', trigger);
      
      // Hide the modal
      this.modal.isVisible = false;
    },

    // When the user confirms they want to delete the item, we inform the menu component, triggering item deletion
    emitDeleteConfirmation(trigger) {
      // Update the item state
      this.$store.commit('deleteItem', trigger);

      // Display the alert if successfu
      const alert = {
        isVisible: true,
        type: 'success',
        message: 'Your item was successfully deleted!'
      }
      bus.$emit('showAlert', alert);
      bus.$emit('userConfirmedDeleteIntention');

      // Hide the modal
      this.modal.isVisible = false;
    },

    // When the user confirms they want to save the updates made to their item, we inform the menu component, triggering item update
    emitUpdateConfirmation(trigger) {
      // Update the item state
      this.$store.commit('updateItem', trigger);

      // Display the alert if successful
      const alert = {
        isVisible: true,
        type: 'success',
        message: 'Your item "' + trigger.itemStateName + '" was successfully updated!'
      }
      bus.$emit('showAlert', alert);

      // Notify the item component so edit mode is exited
      bus.$emit('userConfirmedUpdateIntention');

      // Hide the modal
      this.modal.isVisible = false;
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .modal-dialog {
    padding-top: 5%;
  }
</style>
