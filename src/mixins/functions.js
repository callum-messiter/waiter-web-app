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

    hideAlert() {
      bus.$emit('hideAlert', alert);
    },

    /**
      Our (mostly) warning messages which prompt the user to confirm their intentions. We send the data to the Modal
      component, which renders the modal accordingly. When the user clicks a modal button, the Modal component emits an event, 
      which is being listened to by this Item component (see the created() hook)
    **/
    showModal(name, title, btnPrimary, btnWarn, trigger) {
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
      This displays a special kind of modal, which contains a form. Used for adding a new item, addding a new category, 
      editing item/category data.
    **/
    showModalForm(name, title, btnPrimary, trigger, data={}, btnWarn='') {
      bus.$emit('showModalForm', {
        name: name,
        isVisible: true,
        title: title,
        trigger: trigger,
        buttons: {
          primary: btnPrimary,
          warning: btnWarn
        },
        data: data
      });
    },

    /**
      We will handle every API error like this, in the catch block of our promise
    **/
    handleApiError(err) {
      var msg = 'Oops! The waiter system experienced an error - please try again. If the issue persists, contact our support team.';
      if(err === undefined) return this.displayFlashMsg(msg, 'error');
      if(err.body === undefined) return this.displayFlashMsg(msg, 'error');
      
      if(err.body.userMsg === undefined) {
        console.log(err);
        return this.displayFlashMsg(msg, 'error');
      }
      msg = err.body.userMsg; /* The API returns a user-friendly error message */
      this.displayFlashMsg(msg, 'error');
    },

    displayFlashMsg(msg, type) {
      // if(type == 'error') { msg = 'Oops! ' + msg }
      this.flash().destroyAll();
      setTimeout(() => {
        this.flash(msg, type, { timeout: 5000 }); 
      }, 100);
    }
    
	}
}