<template>
	<div class="container">
		<restaurant-menu></restaurant-menu>
	</div>
</template>

<script>
	import RestaurantMenu from './RestaurantMenu';

	// Events bus
	import { bus } from '../main';

	export default {
		name: 'Dashboard',
		components: {
	    'restaurant-menu': RestaurantMenu
	  },
		data() {
			return {
				restaurant: {
					name: 'Spices',
					imageUrl: '',
				},
				menuName: 'Main Menu'
			}
		},

		// When the dashboard is created, add the menu object to the store.
		// The grandchild component, Category, will get the categories data from this menu object in the store
		created () {
	    const menuId = JSON.parse(localStorage.menu).menuId;
	    // Get the menu object and add it to the store
	    this.$http.get('http://localhost:3000/api/menu/'+menuId, { 
	      headers: {Authorization: JSON.parse(localStorage.user).token}
	    }).then((res) => {
	      this.$store.commit('setMenu', res.body.data);

	    }).catch((res) => {
	      this.handleApiError(res);
	    });
	  },

	  methods: {

	  	/**
	      Our success and error flash messages (the event is listened for by the Alert component)
	    **/
	    showAlert(type, msg) {
	      const alert = {
	        isVisible: true,
	        type: type,
	        message: msg
	      }
	      bus.$emit('showAlert', alert);
	    },

	    /**
	      We will handle every API error like this, in the catch block of our promise
	    **/
	    handleApiError(res) {
	      if(res.body && res.body.error) {
	        // Display the error message
	        this.showAlert('error', res.body.msg);
	      } else if(res.status && res.statusText) {
	        // Save to server logs (once implemented)
	        console.log(res.status + " " + res.statusText);
	      } else {
	        // Save to server logs (once implemented)
	        console.log(res);
	      }
	    }

	  }
	}
</script>

<style scoped>
	h1 {
		margin-bottom: 50px;
	}
	.container {
		padding-top: 10px;
		padding-bottom: 20px;
		margin-top: 10px;
		margin-bottom: 40px;
		background-color: #e7e7e7;
	}
</style>