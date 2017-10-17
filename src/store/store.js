import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		count: 0,
		items: [
			{
				itemId: 1,
				name: 'Ribs',
				price: '10.00',
				description: 'Delicious bbq spare ribs glazed in sticky sauce',
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
			return state.items;
		},

		getItem(state, itemId) {
			const objIndex = state.items.findIndex((item => item.itemId == itemId));
			return state.items[obJIndex];
		}
	}
});