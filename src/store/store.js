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
		tables: {},
		stripeAccount: {
		  id: '',
		  object: '',
		  business_name: '',
		  business_url: '',
		  charges_enabled: false,
		  country: '',
		  created: '',
		  debit_negative_balances: true,
		  decline_charge_on: {
		    avs_failure: false,
		    cvc_failure: false
		  },
		  default_currency: '',
		  details_submitted: false,
		  display_name: '',
		  email: '',
		  external_accounts: {
		    object: 'list',
		    data: [],
		    has_more: false,
		    total_count: 0,
		    url: ''
		  },
		  legal_entity: {
		    additional_owners: [],
		    address: {
		      city: '',
		      country: '',
		      line1: '',
		      line2: '',
		      postal_code: '',
		      state: ''
		    },
		    business_name: '',
		    business_tax_id_provided: false,
		    dob: {
		      day: '',
		      month: '',
		      year: ''
		    },
		    first_name: '',
		    last_name: '',
		    personal_address: {
		      city: '',
		      country: '',
		      line1: '',
		      line2: '',
		      postal_code: '',
		      state: ''
		    },
		    type: '',
		   	verification: {
		      details: '',
		      details_code: '',
		      document: '',
		      document_back: '',
		      status: ''
		    }
		  },
		  tos_acceptance: {
		    date: '',
		    iovation_blackbox: '',
		    ip: '',
		    user_agent: ''
		  },
		  type: '',
		  verification: {
		    disabled_reason: '',
		    due_by: '',
		    fields_needed: []
		  }
		}
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
		setOrders(state, orders) {
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

		/*
			Tables (real-time info about the tables, e.g. how many people are sitting at a given table)
		*/
		setTable(state, tableInfo) {
			state.tableBreakdown = tableInfo;
		},

		/**
		incrementActiveUsersAtTable(state, tableNo) {
			const tb = state.tableBreakdown;
			if(tb.hasOwnProperty(tableNo)) return tb[tableNo]++;
			Vue.set(tb, tableNo, 1);
		},

		decrementActiveUsersAtTable(state, tableNo) {
			const tb = state.tableBreakdown;
			if(tb.hasOwnProperty(tableNo)) {
				if(tb[tableNo] > 1) return tb[tableNo]--;
				Vue.delete(tb, tableNo);
			}
		},
		**/

		addUserToTable(state, data) {
			const tables = state.tables;
			const tableNo = data.tableNo;
			const customerId = data.customerId;
			
			/* If user is already assigned to another table... */
			for(var table in tables) {
		        if(tables[table].includes(customerId)) {
		        	/* ...remove the user from this table */
		        	const tableWithoutUser = tables[table].filter(customerId => customerId != customerId);
		        	Vue.set(tables, table, tableWithoutUser);
		        }
			}
			
			/* Assign user to new table; if table already exists, add user */
			if(tables.hasOwnProperty(tableNo)) {
				const tableWithUser = tables[tableNo].push(customerId);
				Vue.set(tables, tableNo, tableWithUser);
			}
			/* If table doesn't exist yet, create it containing user */
			Vue.set(tables, tableNo, [customerId]);
		},

		removeUserFromTable(state, data) {
			const tables = state.tables;
			const tableNo = data.tableNo;
			if(tables.hasOwnProperty(tableNo)) {
				const tableWithoutUser = tables[tableNo].filter(customerId => customerId !== data.customerId);
	        	Vue.set(tables, tableNo, tableWithoutUser);
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

		getResolvedOrders(state) {
			var resolvedOrders = [];
			for(var order of state.orders) {
				if( 
					order.status == statuses.rejectedByKitchen ||
					order.status == statuses.acceptedByKitchen ||
					order.status == statuses.paymentFailed ||
					order.status == statuses.paymentSuccessful ||
					order.status == statuses.enRouteToCustomer
				) {
					resolvedOrders.push(order);
				}
			}
			return resolvedOrders;
		},

		/**
			Tables
		**/
		getLiveTableBreakdown(state) {
			// return state.tableBreakdown;
			return state.tables;
		},

		/**
			Restaurant Details
		**/
		getRestaurantStripeAccount(state) {
			return state.stripeAccount;
		}
	}
});