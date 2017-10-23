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
            v-on:click="hideModal">
            {{modal.buttons.primary}}
          </button>

        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>

export default {
  name: 'Modal',
  props: ['showModal'],
  data: function() {
    return {
      defaultModal: {
        modalName: null,
        isVisible: false,
        trigger: {},
        title: null,
        buttons: {}
      }
    }
  },
  // Create a computed property, which is a clone of the menu prop (see defaultModal for a template), that is bound to the template
  computed: {
    modal () {
      return this.showModal;
    }
  },
  methods: {
    // When the user confirms they want to discard their item updates, we inform the menu component, triggering a reset of the view item
    emitDiscardConfirmation(trigger) {
      this.$emit('emitDiscardConfirmation', trigger);
      this.hideModal();
    },

    // When the user confirms they want to delete the item, we inform the menu component, triggering item deletion
    emitDeleteConfirmation(trigger) {
      this.$emit('userConfirmedDeleteIntention', trigger);
      this.hideModal();
    },

    // When the user confirms they want to save the updates made to their item, we inform the menu component, triggering item update
    emitUpdateConfirmation(trigger) {
      this.$emit('userConfirmedUpdateIntention', trigger);
      this.hideModal();
    },

    // The modal should be hidden once the user initiates a confirmation/conclusive action 
    hideModal() {
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
