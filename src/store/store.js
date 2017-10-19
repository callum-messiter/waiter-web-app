import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		categories: [
			{
				categoryId: 1,
				name: 'Main Menu',
				items: [
					{
						itemId: 1,
						name: 'Lamb',
						price: '15.00',
						description: 'Roast lamb with vegetables',
						isEditable: false
					},
					{
						itemId: 2,
						name: 'Sausages',
						price: '5.00',
						description: '100% British beef sausages',
						isEditable: false
					},
					{
						itemId: 3,
						name: 'Potatoes',
						price: '7.00',
						description: 'Irish potatoes with a golden shine',
						isEditable: false
					}
				]
			},
			{
				categoryId: 2,
				name: 'Starters',
				items: [
					{
						itemId: 4,
						name: 'Ribs',
						price: '10.00',
						description: 'Delicious bbq spare ribs glazed in sticky sauce',
						isEditable: false
					},
					{
						itemId: 5,
						name: 'Nachos',
						price: '7.00',
						description: 'Nacho chips, salsa, jalapeños, guac.',
						isEditable: false
					},
					{
						itemId: 6,
						name: 'Soup',
						price: '4.00',
						description: 'Our delicious house soup, served hot',
						isEditable: false
					}
				]
			}
		]
		
	},
	mutations: {
		deleteItem(state, itemId) {
			// Find the item by the ID
			const item = state.items.find(item => {
				return item.itemId == itemId;
			});
			// Delete this item
			state.items.splice(state.items.indexOf(item), 1);
		}
	},
	actions: {},
	getters: {
		getItems(state) {
			return state.categories;
		},

		getItem(state, itemId) {
			const objIndex = state.items.findIndex((item => item.itemId == itemId));
			return state.items[obJIndex];
		}
	}
});