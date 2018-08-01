import functions from '../../mixins/functions';
import cloneDeep from 'clone-deep';
import lodash from 'lodash';
import {Money} from 'v-money'
import config from '../../../config/config';

export default {
	name: 'Item',
	components: {Money},
	props: ['categoriesObj', 'categoryItems'],
	mixins: [functions],

	data() {
		return {}
	},

	created() {
	},

	computed: {
		/**
			This is a prop, passed down from the (parent) Category component. It is a clone of the state, and when
			the state is updated, the changes are reflected in the view
		**/
		category () {
			return this.categoryItems;
		},

		/**
			 The same as above, but it represents the entire categories array (every category in the menu, plus each category's items).
			 In order to get the index of the category, we are passing the entire categories object down as a prop. Is there a better way?
		**/
		categories () {
			return this.categoriesObj;
		},

		/**
			This is the actual state. We use this only to check if the view has departed from the state, which
			allows us to check, for example, if the user has actually changed an item.
			Based on this information, we may or not may display a "Sure you want to discard your changes" warning, for example
		**/
		categoryItemsState () {
			return this.$store.getters.getCategoriesAndItems;
		},

		money() {
			return config.money;
		}
	},

	methods: {

		showEditItemModal(itemIndex, catIndex) {
			/* 
				Get the current state of the selected item. We will use this data to check if the
				form data inputted by the user has departed from the state. If the user opens the modal
				but makes no changes to the item data, we shouldn't send the API request
			*/
			const data = this.categoryItemsState[catIndex].items[itemIndex];
			const itemId = data.itemId;
			const itemData = {
				name: data.name,
				price: data.price,
				description: data.description
			}
			/* Show the form */
			this.showModalForm(
				'item_edit',
				'Update your item ' + itemData.name,
				'Save',
				{itemId, itemIndex, catIndex},
				itemData,
				'Delete Item'
			);
		}

	}
}