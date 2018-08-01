import Item from '../Item/Item';
import functions from '../../mixins/functions';
import { bus } from '../../main';
import lodash from 'lodash';

export default {
	name: 'Category',
	components: {
		'item': Item
	},
	mixins: [functions],

	data() {
		return {}
	},

	created() {
		/**
			If we listen for these event in the Item component, the action function fires n times, where n = num of items (all of which are deleted). 
			This seems to be caused by there being, effectivey, n "copies" of the item template. Why doesn't the same thing happen with deleting categories?
		**/
		bus.$on('userConfirmation_addNewItem', (data, trigger) => {
			this.createNewItem(data, trigger.catId, trigger.catIndex)
		});

		bus.$on('userConfirmation_deleteItem', (trigger) => {
			this.deleteItem(trigger);
		});

		bus.$on('userConfirmation_updateItem', (data, trigger) => {
			this.updateItem(data, trigger);
		});
	},

	computed: {
		categories() {
			return this.$store.getters.getCategoriesAndItems;
		}
	},

	methods: {

		showEditCategoryModal(catId, catIndex) {
			const catName = this.categories[catIndex].name;
			this.showModalForm(
				'category_edit',
				'Update your category ' + catName,
				'Save',
				{catIndex, catId},
				{name: catName},
				'Delete Category'
			);
		},

		/**
			Here we display a warning message to the user once they've clicked to delete a category. The Modal component
			listens for the event we fire here
		**/
		showDeleteCategoryModal(catId, catIndex, catName, numItems) {
			// We display this modal to force the user to confirm that they indeed wish to delete the category
			const prefix = 'Are you sure you want to delete your category "' + catName + '"? ';
			var noun, msg;
			if(numItems < 1) {
				msg = 'It will become invisible to your customers.';
			} else {
				(numItems == 1) ? noun = 'item' : noun = 'items';
				msg = 'The category, and its ' + numItems  + ' ' + noun + ', will become invisible to your customers.';
			}

			this.showModal(
				'category_confirm_delete',
				 prefix + msg,
				'Cancel',
				'Delete Category',
				{catIndex, catId}
			);
		},

		/**
			Here we send a request to the API to add the new item to the menu. If the data is successfully persisted to the database, we also update the state, which is then reflected in the view (the item appears at the top of its category's list). It is important to keep the backend data and the front-end state syncronised
		**/
		createNewItem(data, catId, catIndex) {
			// Something weird is happening: the values of the data object in the _then_ block are empty strings
			var newItem = {
				itemId: '',
				name: data.name,
				price: data.price,
				description: data.description
			}

			this.$http.post('item/create', {
				name: data.name,
				price: data.price,
				description: data.description,
				categoryId: catId
			},
				{headers: {Authorization: JSON.parse(localStorage.user).token}

			}).then((res) => {
				if(res.status == 200 || res.status == 201) {
					// Set the itemId that was assigned by the server
					newItem.itemId = res.body.data.createdItemId;
					this.$store.commit('addItem', {
						item: newItem,
						catIndex: catIndex
					});
					this.displayFlashMsg('Your new item was successfully added to your menu!', 'success');
				}
			}).catch((res) => {
				this.handleApiError(res);
			});
		},

		/**
			Here we send the updated item data to the API, and if it is successfully persisted to the database,
			we also update the state, which is then reflected in the view. It is important to keep the backend data and the
			front-end state syncronised
		**/
		updateItem(data, trigger) {
			// Something weird is happening: the values of the data object in the _then_ block are empty strings
			const updatedItem = {
				itemId: data.itemId,
				name: data.name,
				price: data.price,
				description: data.description
			}

			this.$http.put('item/update/'+updatedItem.itemId, {
				name: data.name,
				price: data.price,
				description: data.description
			}, {
				headers: {Authorization: JSON.parse(localStorage.user).token}

			}).then((res) => {
				const payload = {updatedItem, trigger};
				this.$store.commit('updateItem', payload); // Update the item state
				this.displayFlashMsg('Your item was successfully updated!', 'success');
			}).catch((res) => {
				this.handleApiError(res);
			});
		},

		/**
			Here we send a request to the API to deactivate the item (by setting items.active = 0). If the data is successfully persisted to the database, we also update the state, which is then reflected in the view (the item disappears). It is important to keep the backend data and the front-end state syncronised
		**/
		deleteItem(trigger) {
			this.$http.put('item/deactivate/'+trigger.itemId, {}, {
				headers: {Authorization: JSON.parse(localStorage.user).token}

			}).then((res) => {
				this.$store.commit('deleteItem', trigger);
				// Display the alert if successful
				this.displayFlashMsg('Your item was successfully deleted!', 'success');

			}).catch((res) => {
				this.handleApiError(res);
			});
		},

		showAddItemModal(catId, catIndex, catName) {
			this.showModalForm(
				'item_add',
				'Add a new item to ' + catName,
				'Save',
				{catIndex, catId}
			);
		}

	}
}