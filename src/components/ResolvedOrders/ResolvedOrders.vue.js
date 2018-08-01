import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import functions from '../../mixins/functions';
import moment from 'moment';
import underscore from 'underscore';
import statuses from '../../mixins/orderStatuses';

export default {
	name: 'ResolvedOrders',
	components: {
		'clip-loader': ClipLoader
	},
	mixins: [functions],

	data() {
		return {
			loading: {
				still: true,
				spinnerColor: '#469ada',
				spinnerSize: '70px',
				msg: 'Loading your previous orders...'
			},
			orders: [],
			orderIdSearch: '',
			customerNameSearch: '',
			statuses: {
				50: 'In progress',
				100: 'In progress',
				200: 'In progress',
				300: 'In progress',
				999: 'Rejected', // cross
				400: 'Accepted',
				998: 'User payment failed',
				500: 'Accepted and paid',
				600: 'Refunded',
				1000: 'Sent to customer',
			}
		}
	},


	/**
		The core of this component is filtering. We get a list of orders, and the user can filter that list
		by a number parameters (e.g. orderId).


	**/

	created () {
		this.getAllOrdersForRestaurant();
		this.listenForServerConfirmationOfOrderStatusUpdate();
	},

	methods: {
		/**
			On refresh, get the up-to-date live order state for the restaurant, according to the backend
		**/
		getAllOrdersForRestaurant() {
			const restaurantId = JSON.parse(localStorage.restaurant).restaurantId;
			this.$http.get('order/list/'+restaurantId, {
				headers: {Authorization: JSON.parse(localStorage.user).token}
			}).then((res) => {

				if(_.size(res.body) < 1) {
					this.loading.still = false; // Stop loading spinner once server responds
					return true; // If there are no orders, we need not do anything
				}

				// Set the timeAgo properties of all live orders
				var orders = res.body;
				orders = this.groupItemsIntoPairs(orders);
				orders = this.addTimeAgoPropToItems(orders);
				/* Set the local data prop first, since this is what is being rendered (not the computed prop) */
				this.orders = orders.filter(order => statuses.resolved.hasOwnProperty(order.status));
				this.$store.commit('setOrders', orders); // Push the updated orders to the store
				this.loading.still = false; // Stop loading spinner once server responds
				return true;

			}).catch((res) => {
				this.handleApiError(res);
			});
		},

		emitRefundRequestToServer(order) {
			/* Once we request a refund, we must start the loading spinner, then listen for the update order status (600) */
			this.$socket.emit('processRefund', {
				headers: {
					token: JSON.parse(localStorage.user).token
				},
				metaData: {
					orderId: order.orderId,
					restaurantId: order.restaurantId,
					customerId: order.customerId
				}
			});
		},

		/* Listen also for the error event (should the refund fail) */
		listenForServerConfirmationOfOrderStatusUpdate() {
			this.$options.sockets['orderStatusUpdated'] = (order) => {
				console.log('order status updated');
				if(order.status != 600) return;
				this.$store.commit('updateOrderStatus', order);
				this.displayFlashMsg('The order was successfully refunded!', 'success');
			}
		},

		groupItemsIntoPairs(orders) {
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
			}
			return orders;
		},

		addTimeAgoPropToItems(orders) {
			for(var i = 0; i < orders.length; i++) {
				orders[i].timeAgo = moment(orders[i].time).fromNow();
			}
			return orders;
		},

		resetOrderList() {
			this.orderIdSearch = '';
			this.customerNameSearch = '';
			this.orders = this.ordersState;
		},

		/* We filter the orders state, and we assign the result to the local data prop, which is rendered to the UI */
		filterOrders(type, value=null) {
			if(type != 'orderId') {
				this.orderIdSearch = '';
			}
			switch(type) {
				case 'all':
				 this.orders = this.ordersState;
				 break;
				case 'today':
					this.orders = this.ordersState.filter((order) => {
						return moment(order.time).isSame(moment(), 'day');
					});
					break;
				case 'thisWeek':
					this.orders = this.ordersState.filter((order) => {
						return moment(order.time).isSame(moment(), 'week');
					});
					break;
				case 'thisMonth':
					this.orders = this.ordersState.filter((order) => {
						return moment(order.time).isSame(moment(), 'month');
					});
					break;
				case 'orderId':
					if(value.trim() == '') return this.orders = this.ordersState;
					this.orders = this.ordersState.filter((order) => {
						const orderIdLower = order.orderId.toLowerCase();
						return orderIdLower.indexOf( value.toLowerCase() ) >= 0;
					});
					break;
				case 'customerName':
					if(value.trim() == '') return this.orders = this.ordersState;
					this.orders = this.ordersState.filter((order) => {
						const nameLower = order.customerFName.concat(' ' + order.customerLName).toLowerCase();
						return nameLower.indexOf( value.toLowerCase() ) >= 0;
					});
					break;
				default:
					this.orders = this.ordersState;
			}
		}

	},

	computed: {
		/* We use the state as the source of truth when filtering the orders */
		ordersState() {
			return this.$store.getters.getResolvedOrders;
		}
	}

}