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
          <!-- This button simply hides the modal when the primary button is clicked; appears on all modals -->
          <button class="btn btn-primary" 
          v-on:click="hideModal">{{modal.buttons.primary}}</button>
          <!-- Cancel Update Modal-->
          <button v-if="modal.name == 'cancel_update'" class="btn btn-danger" 
          v-on:click="discardChanges(modal.triggerItem.itemId)">{{modal.buttons.warning}}</button>
          <!-- Confirm Delete Modal -->
          <button v-if="modal.name == 'confirm_delete'" class="btn btn-danger" 
          v-on:click="deleteItem(modal.triggerItem.itemId)">{{modal.buttons.warning}}</button>
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
        triggerItem: null,
        title: null,
        buttons: {}
      }
    }
  },
  computed: {
    modal () {
      return this.showModal;
    }
  },
  methods: {
    hideModal() {
      this.modal.isVisible = false;
    },
    discardChanges(itemId) {
      // Emit and event to the parent component, triggering the item to be reset
      this.$emit('discardChanges', itemId);
      this.modal.isVisible = false;
    },
    deleteItem(itemId) {
      // Delete the item from the state and update the clone
      // this.$store.commit('deleteItem', itemId);
      //this.items = cloneDeep(this.itemsState);
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
