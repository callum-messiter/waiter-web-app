// Events bus
import { bus } from '../main';

export default {
	methods: {

		/**
      Our success and error flash messages (the event is listened for by the Alert component). We send the data to the
      Alert component, which renders it before making it invisible after some number of seconds
    **/
    showAlert(type, msg) {
      const alert = {
        isVisible: true,
        type: type,
        message: msg
      }
      bus.$emit('showAlert', alert);
    },

    /**
      OUr (mostly) warning messages which prompt the user to confirm their intentions. We send the data to the Modal
      component, which renders the modal accordingly. When the user clicks a modal button, the Modal component emits an event, 
      which is being listened to by this Item component (see the created() hook)
    **/
    showModal(name, title, btnPrimary, btnWarn, trigger) {
      trigger.component = this.$options.name, // specifies the component which calls this function
      bus.$emit('showModal', {
        name: name,
        isVisible: true,
        title: title,
        trigger: trigger,
        buttons: {
          primary: btnPrimary,
          warning: btnWarn
        }
      });
    },

    /**
      We will handle every API error like this, in the catch block of our promise
    **/
    handleApiError(res) {
      if(res.body && res.body.error) {
        // Display the error message
        this.showAlert('error', res.body.msg);
      } else if(res.status && res.statusText) {
        // Save to server logs (once implemented)
        console.log(res.status + " " + res.statusText);
      } else {
        // Save to server logs (once implemented)
        console.log(res);
      }
    }
    
	}
}