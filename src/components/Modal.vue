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
          <!-- Confirm Update Modal -->
          <button v-if="modal.name == 'confirm_update'" class="btn btn-danger" 
          v-on:click="emitUpdateConfirmation(modal.trigger)">{{modal.buttons.warning}}</button>
          <!-- Cancel Update Modal-->
          <button v-if="modal.name == 'cancel_update'" class="btn btn-danger" 
          v-on:click="emitDiscardConfirmation(modal.triggerItem.itemId, modal.indexes.itemIndex, modal.indexes.catIndex)">{{modal.buttons.warning}}</button>
          <!-- Confirm Delete Modal -->
          <button v-if="modal.name == 'confirm_delete'" class="btn btn-danger" 
          v-on:click="emitDeleteConfirmation(modal.triggerItem.itemId)">{{modal.buttons.warning}}</button>
          <!-- This button simply hides the modal when the primary button is clicked; appears on all modals -->
          <button class="btn btn-primary" 
          v-on:click="hideModal">{{modal.buttons.primary}}</button>
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
        indexes: {
          itemIndex: null, 
          catIndex: null
        },
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
    // The modal should be hidden once the user initiates a confirmation/conclusive action 
    hideModal() {
      this.modal.isVisible = false;
    },

    emitDiscardConfirmation(itemId, itemIndex, catIndex) {
      // When the user confirms they want to discard their item updates, we inform the menu, triggering a reset of the view item
      const itemData = {itemId: itemId, itemIndex: itemIndex, catIndex: catIndex};
      this.$emit('emitDiscardConfirmation', itemData);
      this.hideModal();
    },

    // When the user confirms they want to delete the item, we inform the menu, triggering item deletion
    emitDeleteConfirmation(itemId) {
      this.$emit('userConfirmedDeleteIntention', itemId);
      this.hideModal();
    },

    emitUpdateConfirmation(trigger) {
      this.$emit('userConfirmedUpdateIntention', trigger);
      this.hideModal();
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .modal-dialog {
    padding-top: 5%;
  }
</style>
