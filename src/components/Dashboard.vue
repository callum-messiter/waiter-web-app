<template>
	<div class="container">
		<restaurant-menu></restaurant-menu>
	</div>
</template>

<script>
	import RestaurantMenu from './RestaurantMenu';

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
	    const token = JSON.parse(localStorage.user).token;
	    // Get the menu object and add it to the store
	    this.$http.get('http://localhost:3000/api/menu/'+menuId, { 
	      headers: {Authorization: token}
	    }).then((res) => {
	      this.$store.commit('setMenu', res.body.data);
	    }).catch((res) => {
	      if(res.body && res.body.error) {
	        // Display the error message
	        const alert = {
	          isVisible: true,
	          type: 'error',
	          message: res.body.msg
	        }
	        bus.$emit('showAlert', alert);

	      } else if(res.status && res.statusText) {
	        console.log(res.status + " " + res.statusText);
	      } else {
	        console.log(res);
	      }
	    });
	  },

		methods: {
			createNewMenu() {
				// Make sure it's not empty - if it is, show a modal
				// Api call (update state)
				// Show success/failure message
				// Move the restaurant info to the top left corner
				// Display the categories form
			},

			addCategoriesToMenu() {

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