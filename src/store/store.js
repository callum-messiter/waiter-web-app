import Vue from 'vue';
import Vuex from 'vuex';

import cloneDeep from 'clone-deep';

Vue.use(Vuex);

// We must define the default state, reflecting the entire object, in order for computed properties to be reactive
export default new Vuex.Store({
	state: {
		auth: {
			isUserAuthenticated: (localStorage.isAuth == true || localStorage.isAuth == 'true')
		},
		menu: {
			menuId: null,
			name: null,
			categories: []
		},
		orders: []
	},
	mutations: {
		/**
			Items
		**/
		addItem(state, data) {
			state.menu.categories[data.catIndex].items.unshift(data.item);
			console.log(state.menu.categories[data.catIndex]);
		},
		updateItem(state, trigger) {
			const itemState = state.menu.categories[trigger.catIndex].items[trigger.itemIndex];
			Object.assign(itemState, trigger.item);
		},
		deleteItem(state, trigger) {
			state.menu.categories[trigger.catIndex].items.splice(trigger.itemIndex, 1);
		},

		/**
			Categories
		**/
		addCategory(state, category) {
			console.log(category);
			state.menu.categories.unshift(category);
		},
		deleteCategory(state, catIndex) {
			state.menu.categories.splice(catIndex, 1);
		},
		updateCategoryName(state, cat) {
			state.menu.categories[cat.index].name = cat.name;
		},
		resetCategory(state) {
			state.menu = state.menu;
		},

		/**
			Auth
		**/
		authenticateUser(state) {
			state.auth.isUserAuthenticated = true;
		},
		deauthenticateUser(state) {
			state.auth.isUserAuthenticated = false;
		},

		/**
			Menu
		**/
		setMenu(state, menu) {
			state.menu = menu;
		},

		/**
			Orders
		**/
		setLiveOrders(state, orders) {
			state.orders = orders;
		},

		addNewOrder(state, order) {
			state.orders.push(order);
		},

		updateOrderStatus(state, order) {
			// Find the order by its ID
			const index = state.orders.findIndex(orderState => orderState.orderId == order.orderId);
			console.log(JSON.stringify(state.orders));
			state.orders[index].status = order.status; // and update its status
			console.log(JSON.stringify(state.orders));
		}
	},
	actions: {},
	getters: {
		/** 
			Categories and Items 
		**/
		getCategoriesAndItems(state) {
			return state.menu.categories;
		},
		getCategoriesAndItemsView(state) {
			return cloneDeep(state.menu.categories);
		},

		/**
			Auth
		**/
		isUserAuthenticated(state) {
			return state.auth.isUserAuthenticated;
		},

		/**
			Orders
		**/
		getLiveOrders(state) {
			return state.orders;
		}
	}
});