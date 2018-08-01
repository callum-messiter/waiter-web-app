import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import PacmanLoader from 'vue-spinner/src/PulseLoader.vue';
import functions from '../../mixins/functions';
import moment from 'moment';
import underscore from 'underscore';
const newOrderNotification = new Audio('./static/audio/quite-impressed.mp3');

export default {
	name: 'LiveOrders',
	components: {
		'clip-loader': ClipLoader,
		'pacman-loader': PacmanLoader
	},
	mixins: [functions],

	data() {
		return {
			statuses: {
				sentToServer: 50,
				receivedByServer: 100,
				sentToKitchen: 200,
				receivedByKitchen: 300,
				rejectedByKitchen: 999,
				acceptedByKitchen: 400,
				paymentFailed: 998,
				paymentSuccessful: 500,
				refunded: 600,
				enRouteToCustomer: 1000,
			},
			successMsg: {
				300: 'A new order just arrived!',
				400: 'Woohoo! You accepted an order - we\'re just processing the customer\'s payment...',
				500: 'Woohoo! The customer\'s payment was successful!',
				999: 'The order was rejected. The customer\'s hopes and dreams crumble before us.',
				1000: 'Great job! Another customer is about to fall in love with ' + JSON.parse(localStorage.restaurant).name
			},
			errorMsg: {
				998: 'Oh no! The customer\'s payment was unsuccessful. The order has been cancelled.'
			},
			loading: {
				still: true,
				spinnerColor: '#469ada',
				spinnerSize: '70px',
				msg: 'Loading your live orders...'
			},
			orderIncoming: {
				color: '#ff6a00',
				size: '5px',
				msg: 'Hold on - someone else from this table is currently placing an order.'
			},
			ordersAwaitingStatusUpdate: []
		}
	},

	created() {
		this.getAllOrdersForRestaurant();
		this.getUpToDateTableBreakdown();
		this.listenForNewOrdersFromServer();
		this.listenForTableUpdatesFromServer();
		this.listenForServerConfirmationOfOrderStatusUpdate();
		this.intermittentlyUpdateTimeSinceOrdersWerePlaced();
	},

	methods: {

		intermittentlyUpdateTimeSinceOrdersWerePlaced() {
			/* Intermittently update each order's "time ago" property */
			window.setInterval(() => {
				this.$store.commit('updateTimeSinceOrdersPlaced');
			}, 30000);
		},

		/**
			Once we emit an order-status update to the server, the server will update the order's ststus in the database, before
			emitting a confirmation of update back to us.

			Only then do we update the order status in the state
		**/
		listenForServerConfirmationOfOrderStatusUpdate() {
			this.$options.sockets['orderStatusUpdated'] = (order) => {
				/* 
					When we send a status update to the server, we show a loading spinner on the order
					When the server sends back a confirmation, we remove the spinner and set the card back to normal
				*/
				if(this.ordersAwaitingStatusUpdate.includes(order.orderId)) {
					const index = this.ordersAwaitingStatusUpdate.indexOf(order.orderId);
					this.ordersAwaitingStatusUpdate.splice(index, 1);
				}
				this.$store.commit('updateOrderStatus', order);

				if(this.successMsg.hasOwnProperty(order.status)) {
					this.displayFlashMsg(this.successMsg[order.status], 'success');
				}

				if(this.errorMsg.hasOwnProperty(order.status)) {
					this.displayFlashMsg(this.errorMsg[order.status], 'error');
				}

			};
		},

		/**
			The server finds all sockets which represent the restaurant who is the intended recipient of the order. It then
			emits the 'neworder' event to these sockets; here we handle this event
		**/
		listenForTableUpdatesFromServer() {
			this.$options.sockets['userJoinedTable'] = (data) => {
				this.$store.commit('addUserToTable', data);
			};

			this.$options.sockets['userLeftTable'] = (data) => {
				this.$store.commit('removeUserFromTable', data);
			};
		},

		listenForNewOrdersFromServer() {
			this.$options.sockets['newOrder'] = (order) => {
				/* 
					order.time is a utc timestamp (milliseconds); since 
					machine clocks are not necessarily synchronised, remove 20 secs from the time to avoid ("in a few seconds")
				*/
				order.timeAgo = moment(order.time - 10000).fromNow();
				/* Add the order to the state with the status set by the server: 200 (sentToKitchen) */
				this.$store.commit('addNewOrder', order);
				/* Whenever we receive a new orer, we should send an order-status update to the server: "receivedByKitchen" */
				this.sendUpdatedOrderStatusToBackend(order, this.statuses.receivedByKitchen);
				const newOrderNotification = document.getElementById("newOrderNotification"); 
				newOrderNotification.play();
			};
		},

		/**
			On refresh, get the up-to-date live order state for the restaurant, according to the backend
		**/
		getAllOrdersForRestaurant() {

			const restaurantId = JSON.parse(localStorage.restaurant).restaurantId;
			/* Get the live-orders object and add it to the store */
			this.$http.get('order/list/'+restaurantId, {
				headers: {Authorization: JSON.parse(localStorage.user).token}
			}).then((res) => {

				if(_.size(res.body) < 1) {
					this.loading.still = false; /* Stop loading spinner once server responds */
					return; /* If there are no orders, we need not do anything */
				}

				const orders = res.body;

				/* Set the timeAgo properties of all live orders */
				for(var i = 0; i < orders.length; i++) {
					orders[i].timeAgo = moment(orders[i].time).fromNow();
				}

				/* Push the updated orders to the store */
				this.$store.commit('setOrders', orders);

				/* Check if there are any orders with "erroeous" statuses */
				for(var i = 0; i < orders.length; i++) {
					/* For any orders that haven't been able to reach the restaurant, update their status */
					if(orders[i].status == this.statuses.receivedByServer || orders[i].status == this.statuses.sentToKitchen) {
						/* Update order status on backend; the server will send confirmation and the state will be updated accordingly */
						this.sendUpdatedOrderStatusToBackend(orders[i], this.statuses.receivedByKitchen);
					}
				}

				this.loading.still = false; /* Stop loading spinner once server responds */
				return;

			}).catch((res) => {
				this.handleApiError(res);
			});
		},

		getUpToDateTableBreakdown() {
			const restaurantId = JSON.parse(localStorage.restaurant).restaurantId;

			this.$http.get('table/users/'+restaurantId, {
				headers: {Authorization: JSON.parse(localStorage.user).token}
			}).then((res) => {
				const tableUsers = res.body.data;
				for(const user of tableUsers) {
					this.$store.commit('addUserToTable', user);
				}
			}).catch((err) => {
				this.handleApiError(err);
			});
		},

		sendUpdatedOrderStatusToBackend(order, status) {
			var eventName = 'orderStatusUpdate';
			if(status == this.statuses.acceptedByKitchen) {
					eventName = 'restaurantAcceptedOrder';
			}
			this.$socket.emit(eventName, {
				headers: {
					token: JSON.parse(localStorage.user).token
				},
				metaData: {
					orderId: order.orderId,
					customerId: order.customerId,
					restaurantId: this.restaurantId,
					status: status
				}
			});
			/* 
				When we send a status update to the server, we show a loading spinner on the order
				When the server sends back a confirmation, we find the orderId in the below array, and 
				remove the spinner
			*/
			this.ordersAwaitingStatusUpdate.push(order.orderId);
		}
	},

	computed: {
		restaurantId() {
			return JSON.parse(localStorage.restaurant).restaurantId;
		},

		restaurantName() {
			return JSON.parse(localStorage.restaurant).name;
		},

		/**
			Lots of manipulation of the orders array is required so that the orders can be displayed as required.
			But the following is a messy collection of hacks that hurts my eyes - IMRPROVE
		**/
		orders() {
			/* If there is a problem with the ordering of the orders, do not ORDER BY in api method for getting restaurant's orders */
			const orders = _.sortBy(this.$store.getters.getLiveOrders.orders, 'time').reverse();

			var orderObj = {
				received: [], 
				accepted: []
			};

			// 1) Create item pairs so we can display the order items as a 2 by X matrix
			for(var i = 0; i < orders.length; i++) {
				const items = orders[i].items;
				var itemPairs = [];
				for(var j = 0 ; j < items.length; j+=2) {
					if(items[j+1] !== undefined) {
							itemPairs.push([items[j], items[j+1]]);
					} else {
							itemPairs.push([items[j]]);
					}
					orders[i].itemPairs = itemPairs;
				}

				// Group orders by table
				var column;
				switch(orders[i].status) {
					case this.statuses.receivedByKitchen:
						column = 'received';
						break;
					case this.statuses.acceptedByKitchen:
					case this.statuses.paymentSuccessful:
						column = 'accepted';
						break;
					default:
						continue;
				}

				// 2) Group orders by table number but the table with the most recent order should be at the top of the list)

				/*
					orders: {
						 received: [
						 {
								tableNo: 10,
								orders: [
									{order1},
									{order2}
								]
						 }
					}
				*/
				const group = orderObj[column]; /* e.g. orders.received = [] */
				/* If no table obj has been created yet, create the first one */
				if(group.length < 1) {
					group.push( { tableNo: orders[i].tableNo, orders: [orders[i]] } );
				} else {
					/* Now loop through the table objects */
					var tableAlreadyExists = false;
					for(var j = 0; j < group.length; j++) {
						/* If the order is from this table, add it to the orders array of this table obj */
						if(group[j].tableNo == orders[i].tableNo) {
							group[j].orders.push(orders[i]);
							tableAlreadyExists = true;
						}
					}
					/* If this order's table is not yet represented by a table obj, create the table obj */
					if(!tableAlreadyExists) {
						group.push( { tableNo: orders[i].tableNo, orders: [orders[i]] } );
					}
				}

			}
			return orderObj;
		},

		numOrders() {
			return this.$store.getters.getLiveOrders.numOrders
		},

		tableBreakdown() {
			return this.$store.getters.getLiveTableBreakdown;
		}
	}
}