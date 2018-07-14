<template>
	<div class="container">
		<div class="loading" v-if="loading.still">
			<clip-loader  
				:color="loading.spinnerColor" 
				:size="loading.spinnerSize"
			>
			</clip-loader>
			<p class="loadingMsg">{{loading.msg}}</p>
		</div>
		<div class="wrapper" v-else>
			<div class="row filterOptions">
				<h3>Previous Orders <img src="../assets/menu-icon.png"/></h3>
				<button v-on:click="filterOrders('all')">All</button>
				<button v-on:click="filterOrders('today')">Today</button>
				<button v-on:click="filterOrders('thisWeek')">This Week</button>
				<button v-on:click="filterOrders('thisMonth')">This Month</button>
				<input
					v-model="orderIdSearch" 
					v-on:keyup="filterOrders('orderId', orderIdSearch)"
					v-on:blur="resetOrderList()"
					placeholder="Search by orderId"
				></input>
				<input 
					v-model="customerNameSearch" 
					v-on:keyup="filterOrders('customerName', customerNameSearch)"
					v-on:blur="resetOrderList()"
					placeholder="Search by customer"
				></input>
			</div>
			<div class="container">
				
				<div 
          v-for="order in orders"
          class="panel panel-default"
        >

					<div class="panel-heading orderCardHeader container-fluid">
            <div class="row">
            	<div class="col-xs-3">
            		<h3 class="panel-title text-center">{{order.timeAgo}}</h3>
              	<p class="panel-title text-center">£{{parseFloat(order.price).toFixed(2)}}</p>
            	</div>
              <div class="col-xs-6">
              	<h3 style="color: white" class="panel-title text-center orderTitle">Order
              		<span style="text-decoration: underline">{{order.orderId}}</span>
              	</h3>
              	<p class="panel-title">{{statuses[order.status]}}</p>
            	</div>
              <div class="col-xs-3 customerAndTable">
              	<h3 class="panel-title text-center">{{order.customerFName}} {{order.customerLName}}</h3>
              	<h3 class="panel-title text-center">Table {{order.tableNo}}</h3>
            	</div>
            </div>
          </div>

          <div class="panel-body text-left">
            <div class="row">
            	<div class="col-xs-10">
	              <div class="item-container">
	                <div class="pairWrapper" v-for="pair in order.itemPairs">
	                  <ul class="items">
	                    <li class="item-name" v-for="item in pair">{{item.name}}</li>
	                  </ul>
	                </div>
	              </div>
	            </div>
	            <div class="col-xs-2">
            		<button
								  class="refundBtn"
									v-if="order.status == 500 || order.status == 1000"
									v-on:click="">Refund
								</button>
            	</div>
            </div>
          </div>

        </div>

			</div>
		</div>
	</div>
</template>

<script>

import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import functions from '../mixins/functions';
import moment from 'moment';
import underscore from 'underscore';

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
        this.orders = orders; /* Set the local data prop first, since this is what is being rendered (not the computed prop) */
        this.$store.commit('setOrders', orders); // Push the updated orders to the store
        this.loading.still = false; // Stop loading spinner once server responds
        return true;

      }).catch((res) => {
        this.handleApiError(res);
      });
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
</script>

<style scoped>
	h1 {
		margin-bottom: 50px;
		color: white;
	}

	.container {
		width: 80%;
		padding-top: 10px;
		padding-bottom: 20px;
		margin-top: 10px;
		margin-bottom: 40px;
		background-color: #1b1c23;
	}

	.loading {
		position: fixed;
		top: 50% !important;
		left: 50% !important;
		transform: translate(-50%, -50%);
	}

	.loadingMsg {
		font-size: 16px;
		color: #469ada;;
	}

	button {
	  height: 30px;
	  margin-top: 10px;
	  margin-bottom: 10px;
	  padding-left: 20px;
	  padding-right: 20px;
	  background-color: #343959;
	  border: 1px solid #343959;
	  border-radius: 3px;
	  color: #ffffff;
	  font-size: 12px;
	  font-weight: 500;
	}

	.refundBtn {
		height: 30px;
		font-size: 14px;
		background-color: red;
    border: 1px solid red;
	}

	input {
	  height: 30px;
	  padding-left: 8px;
	  margin-top: 2px;
	  margin-left: 10px;
	  border: 1px;
	  font-size: 12px;
	  outline: none;
	  background-color: white !important;
	  border-radius: 3px;
	}

	.order {
		border: 1px solid white;
	}

  @font-face {
    font-family: 'grotesque';
    src: url("../fonts/grotesque.otf");
  }

  .container-fluid {
    font-family: 'grotesque';
    margin: 0;
    padding: 0;
  }

  .price {
    cursor: pointer;
    color: #469ada;
    margin-right: 10px;
  }

  .panel-title {
    font-size: 14px;
    color: #469ada;
    padding-bottom: 3px;
  }

  .panel-body {
    padding-top: 10px !important;
    padding-bottom: 3px !important;
    padding-left: 15px !important;
    font-size: 12px;
    background-color: #3a3a3a;
    color: #fff;
  }

  /**
    There is a panel-heading class in the Dashboard component, causing conflicts here.
    We should add two new distinct class name and reference them in the CSS, instead.
  **/

  .orderCardHeader {
    background-color: #262626 !important;
    border: 1px solid #262626 !important;
    min-height: 35px;
    padding-top: 10px !important;
  }

  .panel-body img {
    float: left;
    height: 60px;
    width: 60px;
    margin-top: 1	0px;
  }

  .panel-body ul {
    margin-left: 0px;
    margin-top: 10px;
  }

  .panel {
    margin: 20px auto;
    position: relative;
  }

  .panel-loading {
    opacity: 0.4 !important;
  }

  .panel-default {
    border: none;
  }

  .inner {
    padding: 20px;
  }

  .item-name {
    font-weight: bold;
    margin-bottom: 3px;
  }

  .timeAgo {
    font-size: 12px !important;
  }

  ul.items {
    list-style: none;
    padding-left: 0;
    float: right;
  }

  ul.items > li {
      margin-left: 15px;
      font-size: 14px;
  }

  /* Prevent nested li's from getting messed up */
  ul.items > li::before {
      content: "- ";
      margin-left: -15px;
  }

  h3 {
    color: #fff;
  }

  img {
    width: 70px;
    height: 70px;
  }

  /**
    Icons display when there are zero orders
  **/
  .zeroOrdersIcon {
    height: 150px;
    width: auto;
  }

  .zeroOrders {
    padding-top: 140px; /** In order to vertically center; is there a more robust way? **/
    color: white;
  }

  .pairWrapper {
    display: table-cell;
    padding: 10px 7px;
  }

  .item-container {
  	width: 75%;
  	overflow-x: scroll;
  	white-space: nowrap;
    margin: 0 auto;
  }

  ::-webkit-scrollbar {
  -webkit-appearance: none;
  /*width: 0px;*/
  height: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: #262626;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 1);
    -webkit-box-shadow: none;
  }

  .loading {
    position: fixed;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%);
  }

  .loadingMsg {
    font-size: 16px;
    color: #469ada;;
  }

  .orderCard_loading {
    opacity: 0.4;
  }

  .orderLoadingSpinner {
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%);
  }

  .table {
    padding-top: 20px !important;
  }

  .orderIncomingMsg {
    color: #ff6a00;
  }

  .mainOrderDetails {
  	padding-bottom: 3px;
  }

  .orderTitle {
  	font-size: ;
  }

  .glyphicon-ok, .glyphicon-gbp, .acceptedPaid {
  	color: #4edd1a;
  }

  .glyphicon-remove, .glyphicon-credit-card, .rejected {
  	color: red;
  }

  .glyphicon-send, .sent {
  	color: #4edd1a;
  }

</style>
