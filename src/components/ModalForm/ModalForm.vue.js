import {Money} from 'v-money';
import lodash from 'lodash';
import { bus } from '../../main';
import config from '../../../config/config';

export default {
	name: 'ModalForm',
	components: {Money},

	data () {
		return {
			modal: {
				name: null,
				isVisible: false,
				title: null,
				trigger: {},
				buttons: {},
				data: {}
			},
			form: {
				item: {
					name: '',
					price: '',
					description: ''
				},
				category: {
					name: ''
				}
			},
			event: {
				add: 'userConfirmation_addNew',
				update: 'userConfirmation_update',
				delete: 'userConfirmation_delete'
			}
		}
	},

	/**
		We use the event bus to communicate between other components and this modal component. This means that we don't need 
		to repeat the modal HTML/CSS markup in every component which triggers the modal to be displayed First, the trigger 
		component emits and event to this modal component, which renders the modal with the data passed to it, making it visible to the user.
		Then, when one of the actional modal buttons is clicked (e.g. Add new category), this modal, via the below method, emits and event
		back to the target component. The target component will be listening to the relevant event, and upon receiving it, will execute the 
		necessary logic (e.g. by calling the addCategory method.)
	**/
	created () {
		bus.$on('showModalForm', (modal) => {
			// The modal data (title, msg, etc.) is sent by the trigger component in the event. Here we set it and render it to the DOM
			Object.assign(this.modal, modal);

			// For editing data, we should prefill the form with the current data (which is also sent in the event)
			const modalName = this.modal.name;
			if(modalName.indexOf('edit') !== -1) {
				const formName = modalName.substr(0, modalName.indexOf('_')); // e.g. 'item_edit' -> 'item'
				// Check that the modalName contains a valid form name (e.g. 'item', 'category')
				if(!this.form.hasOwnProperty(formName)) {
					console.log('Invalid modal name: ' + modalName);
				} else {
					Object.assign(this.form[formName], modal.data);
				}
			}
		});
	},

	computed: {
		money() {
			return config.money;
		}
	},

	methods: {
		/**
			Add some new data object to the database (e.g. an item or category). This method will send an event,
			containing the new data, to the original component, which will execute the API call
		**/
		sendAddNewEvent() {
			// Determine which form is active
			const formName = this.modal.name.substr(0, this.modal.name.indexOf('_')); // e.g. 'item_edit' => 'item'
			var fields = this.form[formName];
			var allFieldsFilled = true;
			Object.keys(fields).forEach((key) => {
				if(fields[key].toString().trim() === "") { allFieldsFilled = false; }
			});

			// Only send the event if there are no form errors, and no empty fields
			if(!this.errors.any() && allFieldsFilled === true) {
				const eventName = this.event.add + this.capitalise(formName);
				const data = this.form[formName];
				console.log('EventName: ' + eventName);
				bus.$emit(eventName, data, this.modal.trigger);
				this.modal.isVisible = false;
				this.resetFormData(this.modal.name);
			}
		},

		/**
			Update some data in the database (e.g. an item or category). This method will send an event,
			containing the new data, to the original component, which will execute the API call
		**/
		sendUpdateEvent() {
			const formName = this.modal.name.substr(0, this.modal.name.indexOf('_')); // e.g. 'item_edit' => 'item'
			// Only emit the event (which will trigger the API call) if the user has made changes
			if(!_.isEqual(this.form[formName], this.modal.data)) {
				// TODO: this is complicated, can't we organise the data in the trigger component?
				if(formName == 'item') {
					this.form.item.itemId = this.modal.trigger.itemId;
				}
				const eventName = this.event.update + this.capitalise(formName);
				bus.$emit(eventName, this.form[formName], this.modal.trigger);
			}
			// In any case, hide the modal and reset the form
			this.closeModal(this.modal.name);
		},

		/**
			Delete some data from the database (e.g. an item or category). This method will send an event,
			containing the data reference point (e.g. an item or category ID), to the original component, 
			which will execute the API call
		**/
		sendDeleteEvent() {
			const formName = this.modal.name.substr(0, this.modal.name.indexOf('_')); // e.g. 'item_edit' => 'item'
			const eventName = this.event.delete + this.capitalise(formName);
			bus.$emit(eventName, this.modal.trigger);
			this.modal.isVisible = false;
			this.resetFormData(this.modal.name); // The delete button is accessed by the respective edit form (so clear it!)
		},

		/**
			This code is implicit in the above action functions, but this method is required since it is called directly
			when the user clicks the "x" icon
		**/
		closeModal(modalName) {
			this.modal.isVisible = false;
			this.resetFormData(modalName);
		},

		/**
			Whenever the user selects to close the modal, we should reset whichever form was active
		**/
		resetFormData(modalName) {
			// Determine which form is active
			const formName = modalName.substr(0, modalName.indexOf('_')); // e.g. 'item_edit' => 'item'
			// Then set all properties of the form object to an empty string
			var obj = this.form[formName];
			Object.keys(obj).forEach((key) => {
				obj[key] = '';
			});
		},

		capitalise(string) {
			return string[0].toUpperCase() + string.slice(1);
		}

	}
}