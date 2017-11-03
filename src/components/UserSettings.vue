<template>
	<div>
		<button v-on:click="logUserOut">Logout</button>
	</div>
</template>

<script>
	import { bus } from '../main';

	export default {
		name: 'UserSettings',
		data() {
			return {
				alert: {
			        isVisible: true,
			        type: null,
			        summary: null,
			        message: null,
	      		}
			}
		},
		methods: {
			logUserOut() {
				localStorage.removeItem('user');
				localStorage.removeItem('restaurant');
				this.$store.commit('deauthenticateUser');
				this.$store.commit('resetRestaurant');
				localStorage.isAuth = false;
        		this.$router.push('/');
			}
		}
	}
</script>

<style scoped>
</style>