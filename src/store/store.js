import Vue from 'vue';
import Vuex from 'vuex';

import cloneDeep from 'clone-deep';
import moment from 'moment';

Vue.use(Vuex);

const statuses = {
	receivedByServer: 100,
	sentToKitchen: 200,
	receivedByKitchen: 300,
	acceptedByKitchen: 400,
	rejectedByKitchen: 999,
	enRouteToCustomer: 1000,
	// returnedByCustomer: 666,
	// eaten: 500 // May be set once the user has sent feedback
};

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
			// Different statuses require different actions
			switch(order.status) {
				case statuses.receivedByKitchen:
				case statuses.acceptedByKitchen:
					// Set the status of the order to the updated status received from the server
					state.orders[index].status = order.status;
					break;

				case statuses.rejectedByKitchen:
				case statuses.enRouteToCustomer:
					// Simply remove the order from the state, since it no longer has a status that makes it visible to the kitchen
					state.orders.splice(index, 1);
					break;
				default:
					console.log('Error updating order-status state. Order from server has status: ' +order.status);
					break;
			}
		},

		rejectOrder(state, order) {
			const index = state.orders.findIndex(orderState => orderState.orderId == order.orderId);
			console.log(JSON.stringify(state.orders));
			state.orders.splice(index, 1); // and update its status
			console.log(JSON.stringify(state.orders));
		},

		markOrderAsDelivered(state, order) {
			const index = state.orders.findIndex(orderState => orderState.orderId == order.orderId);
			console.log(JSON.stringify(state.orders));
			state.orders.splice(index, 1); // and update its status
			console.log(JSON.stringify(state.orders));
		},

		updateTimeSinceOrdersPlaced(state) {
			const orders = state.orders;
			if(orders.length > 0) {
				for(var i = 0; i < orders.length; i++) {
					orders[i].timeAgo = moment(orders[i].time).utc().fromNow();
					console.log(JSON.stringify(orders));
				}
			}
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