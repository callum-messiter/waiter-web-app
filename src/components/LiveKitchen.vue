<template>
  <div class="container-fluid">
    <div class="accepted-container col-sm-6">
      <h3>Accepted Orders</h3>
      <div class="panel panel-default" v-for="order in orders" v-if="order.status === statuses.accepted">
        <div class="panel-heading container-fluid">
          <div class="row">
            <h3 class="panel-title text-left col-sm-4">#{{order.orderId}}</h3>
            <h3 class="panel-title text-center col-sm-4">Table {{order.tableNo}}</h3>
            <a href="#" v-on:click="markOrderAsDelivered(orders.indexOf(order))">
              <span class="glyphicon glyphicon-send pull-right"></span>
            </a>
          </div>
        </div>
        <div class="panel-body text-left">
          <h4 v-for="item in order.items">{{item.name}}</h4>
        </div>
      </div>
    </div>
    
    <div class="received-container col-sm-6">
      <h3>Received Orders</h3>
      <div class="panel panel-default" v-for="order in orders" v-if="order.status === statuses.received">
        <div class="panel-heading container-fluid">
          <div class="row">
            <h3 class="panel-title text-left col-sm-4">#{{order.orderId}}</h3>
            <h3 class="panel-title text-center col-sm-4">Table {{order.tableNo}}</h3>
            <a href="#" v-on:click="rejectOrder(orders.indexOf(order))">
              <span class="glyphicon glyphicon-remove pull-right"></span>
            </a>
            <a href="#" v-on:click="acceptOrder(orders.indexOf(order))">
              <span class="glyphicon glyphicon-ok pull-right"></span>
            </a>
          </div>
        </div>
        <div class="panel-body text-left">
          <h4 v-for="item in order.items">{{item.name}}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LiveKitchen',
  components: {},
  data() {
    return {
      statuses: {
        received: 0,
        accepted: 4,
        rejected: 9,
        delivered: 10
      },
      orders: [
        {
          orderId: 1,
          tableNo: 12,
          timePlaced: '10 mins ago',
          status: 4,
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
          status: 0,
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
    }
  },

  created () {},
  
  methods: {
    acceptOrder(index) {
      // show the warning modal
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.glyphicon {
  margin-right: 15px;
}
</style>