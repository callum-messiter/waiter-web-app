<template>
  <div class="container-fluid">
    <audio id="newOrderNotification" src="./static/audio/quite-impressed.mp3"></audio>
    <div class="loading" v-if="loading.still">
      <clip-loader  
        :color="loading.spinnerColor" 
        :size="loading.spinnerSize"
      >
      </clip-loader>
      <p class="loadingMsg">{{loading.msg}}</p>
    </div>
    <div class="inner" v-else>
    <!-- If there are no live orders, inform the user -->
    <div 
      class="row zeroOrders" 
      v-if="Object.keys(orders.received).length < 1 && Object.keys(orders.accepted).length < 1"
    >
      <img class="zeroOrdersIcon" src="../assets/safebox.png"/>
      <h4 class="zeroOrdersMsg">{{restaurantName}} has no live orders right now...</h4>
    </div>
    <!-- Orders received by the kitchen, yet to be accpeted. Ordered by recency (most recent at top)-->
    <div class="row" v-else>
      <div class="received-container col-sm-6">
        <h3>New Orders <img src="../assets/waiter-icon.png"/></h3>
        <div v-for="table in orders.received" class="table">
          <h4 style="color: white">Table {{table.tableNo}} <icon name="users"></icon></h4>

          <div 
            class="orderIncoming row"
            v-if="tableBreakdown.hasOwnProperty(table.tableNo) && tableBreakdown[table.tableNo].length > 0"
          >
            <pacman-loader :color="orderIncoming.color" :size="orderIncoming.size"></pacman-loader>
            <p class="orderIncomingMsg">Hold on - someone else from table {{table.tableNo}} is currently placing an order</p>
          </div>

          <div 
            v-for="order in table.orders"
            class="panel panel-default"
            :class="{ 'orderCard_loading': ordersAwaitingStatusUpdate.includes(order.orderId) }" 
            v-if="order.status == statuses.receivedByKitchen"
          >
            <!-- This is displayed when an order status update is sent to the server, and we are awaiting confirmation of receipt -->
            <clip-loader
              v-if="ordersAwaitingStatusUpdate.includes(order.orderId)"
              class="orderLoadingSpinner"
              :color="loading.spinnerColor"
            >
            </clip-loader>

            <!-- Main order-card content -->
            <div class="panel-heading orderCardHeader container-fluid">
              <div class="row">
                <h3 class="panel-title text-left col-xs-4 timeAgo">{{order.timeAgo}}</h3>
                <h3 class="panel-title text-center col-xs-4">Table {{order.tableNo}}</h3>
                <!-- Reject-Order Icon -->
                <span
                  class="glyphicon glyphicon-remove pull-right"
                  v-if="!ordersAwaitingStatusUpdate.includes(order.orderId)"
                  v-on:click="sendUpdatedOrderStatusToBackend(order, statuses.rejectedByKitchen)">
                </span>
                <!-- Accept-Order Icon -->
                <span
                  class="glyphicon glyphicon-ok pull-right"
                  v-if="!ordersAwaitingStatusUpdate.includes(order.orderId)"
                  v-on:click="sendUpdatedOrderStatusToBackend(order, statuses.acceptedByKitchen)">
                </span>
              </div>
            </div>
            <div class="panel-body text-left">
              <div class="row">
                <div class="col-md-2">
                  <img src="../assets/menu-icon.png"/>
                </div>
                  <div class="item-container">
                    <div class="pairWrapper" v-for="pair in order.itemPairs">
                      <ul class="items">
                        <li class="item-name" v-for="item in pair">{{item.name}}</li>
                      </ul>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Orders accepted by the kitchen, and thus in progress. Ordered by recency (oldest at top)-->
      <div class="accepted-container col-sm-6">
        <h3>Orders We've Accepted<img src="../assets/cutlery-icon.png"></h3>

        <div v-for="table in orders.accepted" class="table">
          <h4 style="color: white">Table {{table.tableNo}} <icon name="users"></icon></h4>
          <!-- If the order card is awaiting a status update confirmation from the server, we reduce the opacity
            and display the loading spinner -->
          <div
            v-for="order in table.orders" 
            class="panel panel-default"
            :class="{ 
              'orderCard_loading': ordersAwaitingStatusUpdate.includes(order.orderId) 
              || order.status == statuses.acceptedByKitchen
            }" 
            v-if="order.status == statuses.acceptedByKitchen || order.status == statuses.paymentSuccessful"
          >
            <!-- This is displayed when an order status update is sent to the server, and we are awaiting confirmation of receipt -->
            <clip-loader
              v-if="ordersAwaitingStatusUpdate.includes(order.orderId) || order.status == statuses.acceptedByKitchen"
              class="orderLoadingSpinner"
              :color="loading.spinnerColor"
            >
            </clip-loader>
 
            <!-- Main order-card content -->
            <div class="panel-heading orderCardHeader container-fluid">
              <div class="row">
                <h3 class="panel-title text-left col-xs-4 timeAgo">{{order.timeAgo}}</h3>
                <h3 class="panel-title text-center col-xs-4">Table {{order.tableNo}}</h3>
                <!-- Send-Order-to-Custom Icon -->
                <span
                  class="glyphicon glyphicon-send pull-right"
                  v-if="!ordersAwaitingStatusUpdate.includes(order.orderId)"
                  v-on:click="sendUpdatedOrderStatusToBackend(order, statuses.enRouteToCustomer)">
                </span>
              </div>
            </div>
            <div class="panel-body text-left">
              <div class="row">
                <div class="col-md-2">
                  <img src="../assets/menu-icon.png"/>
                </div>
                <div class="item-container">
                  <div class="pairWrapper" v-for="pair in order.itemPairs">
                    <ul class="items">
                      <li class="item-name" v-for="item in pair">{{item.name}}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>

var newOrderNotification = new Audio('./static/audio/quite-impressed.mp3');

// Components
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import PacmanLoader from 'vue-spinner/src/PulseLoader.vue';

// Mixins
import functions from '../mixins/functions';

// Dependencies
import moment from 'moment';
import underscore from 'underscore';

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
        enRouteToCustomer: 1000,
        // returnedByCustomer: 666,
        // eaten: 500 // May be set once the user has sent feedback
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
      // Intermittently update each order's "time ago" property
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
        // When we send a status update to the server, we show a loading spinner on the order
        // When the server sends back a confirmation, we remove the spinner and set the card back to normal
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
        //this.$store.commit('incrementActiveUsersAtTable', data.tableNo);
      };

      this.$options.sockets['userLeftTable'] = (data) => {
        this.$store.commit('removeUserFromTable', data);
        // this.$store.commit('decrementActiveUsersAtTable', data.tableNo);
      };
    },

    listenForNewOrdersFromServer() {
      this.$options.sockets['newOrder'] = (order) => {
        // order.time is a utc timestamp (milliseconds); since 
        // machine clocks are not necessarily synchronised, remove 20 secs from the time to avoid ("in a few seconds")
        order.timeAgo = moment(order.time - 10000).fromNow();
        // Add the order to the state with the status set by the server: 200 (sentToKitchen)
        this.$store.commit('addNewOrder', order);
        // Whenever we receive a new orer, we should send an order-status update to the server: "receivedByKitchen"
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
      // Get the live-orders object and add it to the store
      this.$http.get('order/list/'+restaurantId, {
        headers: {Authorization: JSON.parse(localStorage.user).token}
      }).then((res) => {

        if(_.size(res.body) < 1) {
          this.loading.still = false; // Stop loading spinner once server responds
          return true; // If there are no orders, we need not do anything
        }

        const orders = res.body;

        // Set the timeAgo properties of all live orders
        for(var i = 0; i < orders.length; i++) {
          orders[i].timeAgo = moment(orders[i].time).fromNow();
        }

        // Push the updated orders to the store
        this.$store.commit('setLiveOrders', orders);

        // Check if there are any orders with "erroeous" statuses
        for(var i = 0; i < orders.length; i++) {
          // For any orders that haven't been able to reach the restaurant, update their status
          if(orders[i].status == this.statuses.receivedByServer || orders[i].status == this.statuses.sentToKitchen) {
            // Update order status on backend; the server will send confirmation and the state will be updated accoringly
            this.sendUpdatedOrderStatusToBackend(orders[i], this.statuses.receivedByKitchen);
          }
        }

        this.loading.still = false; // Stop loading spinner once server responds
        return true;

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
        for(var user of tableUsers) {
          this.$store.commit('addUserToTable', user);
          // this.$store.commit('incrementActiveUsersAtTable', user.tableNo);
        }
      }).catch((err) => {
        this.handleApiError(err);
      });
    },

    sendUpdatedOrderStatusToBackend(order, status) {
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
      // When we send a status update to the server, we show a loading spinner on the order
      // When the server sends back a confirmation, we find the orderId in the below array, and 
      // remove the spinner
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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  @font-face {
    font-family: 'grotesque';
    src: url("../fonts/grotesque.otf");
  }

  .container-fluid {
    font-family: 'grotesque';
    margin: 0;
    padding: 0;
  }

  .glyphicon {
    margin-right: 10px;
    cursor: pointer;
    color: #469ada;
  }

  .panel-title {
    font-size: 14px;
    color: #469ada
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
    padding: 10px !important;
  }

  .panel-body img {
    float: left;
    height: 60px;
    width: 60px;
    margin-top: 10px;
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

</style>
