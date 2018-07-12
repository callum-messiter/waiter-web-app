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
		<div class="container" v-else>
			<h1>Previous Orders</h1>
			<div v-for="order in orders">
				<p style="color: white">{{order.orderId}} ({{order.status}}) - {{order.timeAgo}}</p>
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
			}
		}
	},

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
        const orders = res.body;
        for(var i = 0; i < orders.length; i++) {
          orders[i].timeAgo = moment(orders[i].time).fromNow();
        }

        // Push the updated orders to the store
        this.$store.commit('setLiveOrders', orders);
        this.loading.still = false; // Stop loading spinner once server responds
        return true;

      }).catch((res) => {
        this.handleApiError(res);
      });
    }

	},

	computed: {
		orders() {
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

</style>
