<template>
  <div class="container-fluid">
    <!-- Orders received by the kitchen, yet to be accpeted. Ordered by recency (most recent at top)-->
    <div class="received-container col-sm-4 col-sm-offset-2">
      <h3>Received Orders</h3>
      <div class="panel panel-default" v-for="order in orders" v-if="order.status == statuses.receivedByKitchen">
        <div class="panel-heading container-fluid">
          <div class="row">
            <h3 class="panel-title text-left col-sm-4">10 mins ago</h3>
            <h3 class="panel-title text-center col-sm-4">Table {{order.tableNo}}</h3>
            <a href="#" v-on:click="rejectOrder(orders.indexOf(order))">
              <span class="glyphicon glyphicon-remove pull-right"></span>
            </a>
            <a href="#" v-on:click="acceptOrder(orders.indexOf(order), order)">
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
            <h3 class="panel-title text-left col-sm-4">0 mins ago</h3>
            <h3 class="panel-title text-center col-sm-4">Table {{order.tableNo}}</h3>
            <a href="#" v-on:click="markOrderAsDelivered(orders.indexOf(order))">
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
</template>

<script>
// Mixins
import functions from '../mixins/functions';

export default {
  name: 'LiveKitchen',
  components: {},
  mixins: [functions],

  data() {
    return {
      statuses: {
        receivedByServer: 100,
        sentToKitchen: 200,
        receivedByKitchen: 300, // this would be a notification of reception
        acceptedByKitchen: 400,
        rejectedByKitchen: 999,
        enRouteToCustomer: 1000,
        // returnedByCustomer: 666,
        // eaten: 500 // May be set once the user has sent feedback
      },
      /**
      orders: [
        {
          orderId: 1,
          tableNo: 12,
          timePlaced: '10 mins ago',
          status: 400,
          customerId: '',
          items: [
            {
              name: 'BBQ Spare Ribs'
            },
            {
              name: 'Fish and Chips'
            },
          ]
        },
        {
          orderId: 2,
          tableNo: 4,
          timePlaced: '0 mins ago',
          status: 300,
          customerId: '',
          items: [
            {
              name: 'Sunday Roast'
            },
            {
              name: 'Onion Rings'
            },
          ]
        }
      ]
      **/ 
    }
  },

  created () {
    /**
      The server broadcasts order events to all connected sockets, but affixes the restaurantId to the order name.
      Here we listen for order events with the restaurantId affixed, so that restaurant will only receive their own orders
    **/
    this.$options.sockets[this.orderEventName] = (order) => {
      // Add the order to the state with status 200 (sentToKitchen)
      this.$store.commit('addNewOrder', order);
      // Whenever we receive a new orer, we should send an order-status update to the server "receivedByKitchen"
      this.$socket.emit('orderStatusUpdate', {
        orderId: order.orderId,
        customerId: order.customerId,
        restaurantId: order.restaurantId,
        status: this.statuses.receivedByKitchen
      });
      console.log('order added, statusUpdate sent');
    };

    /**
      Once we emit an order-status update to the server, the server will update the order's ststus in the database, before 
      emitting a confirmation of update back to us.

      Only then do we add the order to the frontend state
    **/
    this.$options.sockets['orderStatusUpdated'] = (order) => {
      this.$store.commit('updateOrderStatus', order);
    };

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
        if(orders[i].status == 200) {
          orders[i].status = this.statuses.receivedByKitchen;
        }
      }

      this.$store.commit('setLiveOrders', orders);

    }).catch((res) => {
      this.handleApiError(res);
    });

  },
  
  methods: {
    acceptOrder(index, order) {
      // show the warning modal
      const acceptedOrder = {
        orderId: order.orderId,
        customerId: order.customerId,
        restaurantId: this.restaurantId,
        status: this.statuses.acceptedByKitchen
      };
      
      console.log(acceptedOrder);

      this.$socket.emit('orderStatusUpdate', {
        orderId: order.orderId,
        customerId: order.customerId,
        restaurantId: this.restaurantId,
        status: this.statuses.acceptedByKitchen
      }); 

      this.orders[index].status = this.statuses.accepted;
      // emit event to server with new order status
      // update the status of the order in the store
    },

    rejectOrder(index) {
      // show the warning modal
      // emit event to server with new order status
      // remove the order from the state
      this.orders.splice(index, 1);
    },

    markOrderAsDelivered(index) {
      // show the warning modal
      // emit event to server with new order status
      // remove the order from the state
      this.orders.splice(index, 1);
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
      return this.$store.getters.getLiveOrders;
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