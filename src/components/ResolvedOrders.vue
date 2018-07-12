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
		<h1 v-else>Previous Orders</h1>
	</div>
</template>

<script>

import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import functions from '../mixins/functions';

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
		this.loading.still = false;
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
