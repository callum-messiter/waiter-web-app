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