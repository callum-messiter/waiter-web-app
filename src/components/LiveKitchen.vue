<template>
  <div class="container-fluid">
    <alert></alert>
    <!-- If there are no live orders, inform the user -->
    <div class="row" v-if="orders.length < 1">
      <h3 v-if="orders.length < 1">Your restaurant has no live orders right now!</h3>
    </div>
    <!-- Orders received by the kitchen, yet to be accpeted. Ordered by recency (most recent at top)-->
    <div class="row" v-else>
      <div class="received-container col-sm-4 col-sm-offset-2">
        <h3>Received Orders</h3>
        <div class="panel panel-default" v-for="order in orders" v-if="order.status == statuses.receivedByKitchen">
          <div class="panel-heading container-fluid">
            <div class="row">
              <h3 class="panel-title text-left col-sm-4">{{order.timeAgo}}</h3>
              <h3 class="panel-title text-center col-sm-4">Table {{order.tableNo}}</h3>
              <!-- Reject-Order Icon -->
              <a href="#" v-on:click="updateOrderStatus(order, statuses.rejectedByKitchen)">
                <span class="glyphicon glyphicon-remove pull-right"></span>
              </a>
              <!-- Accept-Order Icon -->
              <a href="#" v-on:click="updateOrderStatus(order, statuses.acceptedByKitchen)">
                <span class="glyphicon glyphicon-ok pull-right"></span>
              </a>
            </div>
          </div>
          <div class="panel-body text-left">
            <ul class="items">
              <li class="item-name" v-for="item in order.items">{{item.name}}</li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Orders accepted by the kitchen, and thus in progress. Ordered by recency (oldest at top)-->
      <div class="accepted-container col-sm-4">
        <h3>Accepted Orders</h3>
        <div class="panel panel-default" v-for="order in orders" v-if="order.status == statuses.acceptedByKitchen">
          <div class="panel-heading container-fluid">
            <div class="row">
              <h3 class="panel-title text-left col-sm-4">{{order.timeAgo}}</h3>
              <h3 class="panel-title text-center col-sm-4">Table {{order.tableNo}}</h3>
              <!-- Send-Order-to-Custom Icon -->
              <a href="#" v-on:click="updateOrderStatus(order, statuses.enRouteToCustomer)">
                <span class="glyphicon glyphicon-send pull-right"></span>
              </a>
            </div>
          </div>
          <div class="panel-body text-left">
            <ul class="items">
              <li class="item-name" v-for="item in order.items">{{item.name}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Components
import Alert from './Alert';

// Mixins
import functions from '../mixins/functions';

// Dependencies
import moment from 'moment';
import underscore from 'underscore';

export default {
  name: 'LiveKitchen',
  components: {
    'alert': Alert
  },
  mixins: [functions],

  data() {
    return {
      statuses: {
        receivedByServer: 100,
        sentToKitchen: 200,
        receivedByKitchen: 300, // this would be a notification of receipt
        acceptedByKitchen: 400,
        rejectedByKitchen: 999,
        enRouteToCustomer: 1000,
        // returnedByCustomer: 666,
        // eaten: 500 // May be set once the user has sent feedback
      },
      successMsg: {
        300: 'A new order just arrived!',
        400: 'Woohoo! You accepted an order - the customer was notified and accidentally screamed a bit.',
        999: 'The order was rejected. The customer\'s hopes and dreams crumble before us.',
        1000: 'Great job! Another customer is about to fall in love with ' + JSON.parse(localStorage.restaurant).name
      }
    }
  },

  created() {
    /**
      On refresh, get the up-to-date live order state for the restaurant, according to the backend
    **/
    const restaurantId = JSON.parse(localStorage.restaurant).restaurantId;
    // Get the live-orders object and add it to the store
    this.$http.get('http://localhost:3000/api/order/getAllLive/'+restaurantId, { 
      headers: {Authorization: JSON.parse(localStorage.user).token}
    }).then((res) => {
      const orders = res.body.data;
      
      // Check if there are any orders with status 200 (sentToKitchen) - then we can set them to receivedByKitchen
      for(var i = 0; i < orders.length; i++) {
        if(orders[i].status == this.statuses.sentToKitchen) {
          // In each case, send an order-status update event to the server, and subsequently update the order's state
          // once the server has confirmed the status has been updated in the database
          this.updateOrderStatus(orders[i], this.statuses.receivedByKitchen);
        }

        // Only orders with status 200, 300, 400 should be sent to the restaurant
        if(!this.statusesVisibleToKitchen.includes(orders[i].status)) {
          console.log('Error: "api/order/getAllLive" returned an order with status: ' + orders[i].status);
        }

        // Set the time ago property
        orders[i].timeAgo = moment(orders[i].time).utc().fromNow();
      }

      this.$store.commit('setLiveOrders', orders);

    }).catch((res) => {
      this.handleApiError(res);
    });

    /**
      The server broadcasts order events to all connected sockets, but affixes the restaurantId to the order name. Here we listen for order events with the restaurantId affixed, so the restaurant will only receive their own orders
    **/
    this.$options.sockets[this.orderEventName] = (order) => {
      order.timeAgo = moment(order.time).utc().fromNow();
      // Add the order to the state with the status set by the server: 200 (sentToKitchen)
      this.$store.commit('addNewOrder', order);
      // Whenever we receive a new orer, we should send an order-status update to the server: "receivedByKitchen"
      this.updateOrderStatus(order, this.statuses.receivedByKitchen);
    };

    /**
      Once we emit an order-status update to the server, the server will update the order's ststus in the database, before 
      emitting a confirmation of update back to us.

      Only then do we update the order status in the state
    **/
    this.$options.sockets['orderStatusUpdated'] = (order) => {
      this.$store.commit('updateOrderStatus', order);
      this.showAlert('success', this.successMsg[order.status]);
    };

    // Intermittently update each order's "time ago" property
    window.setInterval(() => {
      this.$store.commit('updateTimeSinceOrdersPlaced');
    }, 30000);
  },
  
  methods: {
    updateOrderStatus(order, status) {
      this.$socket.emit('orderStatusUpdate', {
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
    }
  },

  computed: {
    restaurantId() {
      return JSON.parse(localStorage.restaurant).restaurantId;
    },

    orderEventName() {
      return 'order_'+JSON.parse(localStorage.restaurant).restaurantId;
    },

    orders() {
      return _.sortBy(this.$store.getters.getLiveOrders, 'time');
    },

    statusesVisibleToKitchen() {
      return [
        this.statuses.sentToKitchen, 
        this.statuses.receivedByKitchen,
        this.statuses.acceptedByKitchen
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .glyphicon {
    margin-right: 15px;
  }

  .panel-title {
    font-size: 12px;
  }

  .panel-body {
    padding-top: 10px;
    padding-bottom: 3px;
    font-size: 12px
  }

  .panel-heading {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .item-name {
    font-weight: bold;
    margin-bottom: 3px;
  }

  ul.items {
    list-style: none;
    padding-left: 0;
  }

  ul.items > li {
      margin-left: 15px;  
  }

  /* Prevent nested li's from getting messed up */
  ul.items > li::before {
      content: "- ";
      margin-left: -15px;
  }

</style>