<template>
	<transition name="fade" v-if="alert.isVisible">
		<div class="alert" 
		v-bind:class="{'alert-success': alert.type == 'success', 'alert-danger': alert.type == 'error'}">
		{{alert.message}}
		</div>
	</transition>
</template>

<script>

import { bus } from '../main';

export default {
	name: 'Alert',
	data() {
		return {
			alert: {
        isVisible: false,
        type: null,
        message: null,
    	}
		}
	},
	created () {
		bus.$on('showAlert', (alert) => {
			this.displayFlashMsg(alert);
		});
	},
	methods: {
		displayFlashMsg(alert) {
			Object.assign(this.alert, alert);
      setTimeout(() => { 
        this.alert.isVisible = false;
      }, 2000);
		}
	}
}
</script>

<style scoped>
	.fade-enter-active, .fade-leave-active {
	    transition: opacity .5s
	}

	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0
	}
</style>