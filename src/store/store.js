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
				isUpdatable: false
			},
			{
				itemId: 2,
				name: 'Sausages',
				price: '5.00',
				description: '100% British beef sausages',
				isUpdatable: false
			},
			{
				itemId: 3,
				name: 'Potatoes',
				price: '7.00',
				description: 'Irish potatoes with a golden shine',
				isUpdatable: false
			}
		]
	},
	mutations: {
		addItem(state) {
			// add item to state.items
		},
		deleteItem(state, itemId) {
			// Find the item by the ID
			const item = state.items.find(item => {
				return item.itemId == itemId;
			});
			// Delete this item
			state.items.splice(state.items.indexOf(item), 1);
		},
		makeItemUpdatable(state, itemId) {
			// Only one item at a time can be updatable, so first we must check if any are already updatable
			var areAnyItemsAlreadyUpdatable = false;
			state.items.forEach((item) => {
				// The editable item may be the current item
			    if(item.isUpdatable && item.itemId != itemId) {
			    	areAnyItemsAlreadyUpdatable = true;
			    }
			});
			// If there currently are no updatable items, then make this item updatable
			if(areAnyItemsAlreadyUpdatable) {
				// 
				alert('Please finish editing the other item!');
			} else {
				// Find the item by referencing the ID
				const objIndex = state.items.findIndex((item => item.itemId == itemId));
				// Change the isUpdatable property of this item
				state.items[objIndex].isUpdatable = true;
			}
		},
		updateItem(item){}
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