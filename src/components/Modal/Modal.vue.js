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
			We use the event bus to communicate between other components and this modal component. This means that we don't need to repeat 
			the modal HTML/CSS markup in every component which triggers the modal to be displayed. First, the trigger component emits and 
			event to this modal component, which renders the modal with the data passed to it, making it visible to the user. Then, when one 
			of the actional modal buttons is clicked (e.g. Confirm Delete Category), this modal, via the below method, emits and event back 
			to the target component. The target component will be listening to the relevant event, and once receiving it, will execute the 
			necessary logic (e.g. by calling the deleteCategory method.)
		**/
		emitUserConfirmation(eventName, trigger) {
			bus.$emit(eventName, trigger);
			this.modal.isVisible = false;
		}
	}
}