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

          <!-- 
            A confirm_update event is emitted by a component to ask the user to confirm that he wants to save the updates he has made. The component name can be found in modal.trigger.component. 

            The name of an event emitted by the Modal should have the name of the target component appended.
           -->
          <button 
            class="btn btn-danger" 
            v-if="modal.name == 'confirm_update'"
            v-on:click="emitUpdateConfirmation(modal.trigger)">
            {{modal.buttons.warning}}
          </button>

          <!-- 
            A discard_changes event is emitted by a component to ask the user to confirm that he wants to discard the updates he has made. The component name can be found in modal.trigger.component. 

            The name of an event emitted by the Modal should have the name of the target component appended.
           -->
          <button 
            class="btn btn-danger" 
            v-if="modal.name == 'discard_changes'" 
            v-on:click="emitDiscardChangesConfirmation(modal.trigger)">
            {{modal.buttons.warning}}
          </button>

          <!-- 
            A confirm_delete event is emitted by a component to ask the user to confirm that he wants to delete the item/category etc. The component name can be found in modal.trigger.component. 

            The name of an event emitted by the Modal should have the name of the target component appended.
           -->
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

    emitDiscardChangesConfirmation(trigger) {
      bus.$emit('confirm_discard_changes', trigger);
      this.modal.isVisible = false;
    },

   
    emitUpdateConfirmation(trigger) {
      bus.$emit('confirm_update', trigger);
      this.modal.isVisible = false;
    },

    emitDeleteConfirmation(trigger) {
      bus.$emit('confirm_delete', trigger);
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
