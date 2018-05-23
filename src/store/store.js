import Vue from 'vue';
import Vuex from 'vuex';
import cloneDeep from 'clone-deep';
import moment from 'moment';
import underscore from 'underscore';

Vue.use(Vuex);

const statuses = {
	sentToServer: 50,
	receivedByServer: 100,
	sentToKitchen: 200,
	receivedByKitchen: 300,
	rejectedByKitchen: 999,
	acceptedByKitchen: 400,
	paymentFailed: 998,
	paymentSuccessful: 500,
	enRouteToCustomer: 1000,
	// receivedByCustomer: 2000 // would be set by deliverer of food
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
		orders: [],
		stripeAccount: {}
	},
	mutations: {
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
			Items
		**/
		addItem(state, data) {
			state.menu.categories[data.catIndex].items.unshift(data.item);
		},
		updateItem(state, payload) {
			const trigger = payload.trigger;
			const data = payload.updatedItem;
			var itemState = state.menu.categories[trigger.catIndex].items[trigger.itemIndex];
			Object.assign(itemState, data);
		},
		deleteItem(state, trigger) {
			state.menu.categories[trigger.catIndex].items.splice(trigger.itemIndex, 1);
		},

		/**
			Categories
		**/
		addCategory(state, category) {
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
				case statuses.paymentSuccessful:
					// Set the status of the order to the updated status received from the server
					state.orders[index].status = order.status;
					break;

				case statuses.rejectedByKitchen:
				case statuses.paymentFailed:
				case statuses.enRouteToCustomer:
					// Simply remove the order from the state, since it no longer has a status that makes it visible to the kitchen
					state.orders.splice(index, 1);
					break;
				default:
					console.log('Error updating order-status state. Order from server has status: ' +order.status);
					break;
			}
		},

		updateTimeSinceOrdersPlaced(state) {
			const orders = state.orders;
			if(orders.length > 0) {
				for(var i = 0; i < orders.length; i++) {
					orders[i].timeAgo = moment(orders[i].time).utc().fromNow();
				}
			}
		},

		/**
			Restaurant details
		**/
		setRestaurantStripeAccount(state, account) {
			Object.assign(state.stripeAccount, account);
		}

	},
	actions: {},
	getters: {
		/**
			Auth
		**/
		isUserAuthenticated(state) {
			return state.auth.isUserAuthenticated;
		},
		
		/** 
			Categories and Items 
		**/
		getCategoriesAndItems(state) {
			return state.menu.categories;
		},

		/**
			Orders
		**/
		getLiveOrders(state) {
			var received = 0;
			var accepted = 0;
			for(var i = 0; i < state.orders.length; i++) {
				if(state.orders[i].status == statuses.receivedByKitchen) {
					received++;
				}
				if(state.orders[i].status == statuses.acceptedByKitchen) {
					accepted++;
				}
			}
			return {
				orders: state.orders,
				numOrders: {received: received, accepted: accepted}
			}
		},

		/**
			Restaurant Details
		**/
		getRestaurantStripeAccount(state) {
			return state.stripeAccount;
		}
	}
});