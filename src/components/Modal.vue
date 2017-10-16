<template>
  <transition name="modal" v-if="modal.isVisible">
   <div class="modal" style="display: block">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
          </h4>
        </div>
        
        <div class="modal-body">
          <h5>{{modal.title}}</h5>
          <button class="btn btn-primary pull-left align-middle" 
          v-on:click="hideModal">{{modal.buttons.continueEditing}}</button>
          <button class="btn btn-primary pull-left align-middle" 
          v-on:click="discardChanges(modal.triggerItemId)">{{modal.buttons.discardChanges}}</button>
        </div>
        
        <div class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>

export default {
  name: 'Modal',
  props: ['showCancelUpdateModal'],
  data: function() {
    return {
      defaultModal: {
        isVisible: false,
        triggerItemId: null,
        title: null,
        buttons: {}
      }
    }
  },
  computed: {
    modal () {
      return this.showCancelUpdateModal;
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
