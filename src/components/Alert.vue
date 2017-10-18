<template>
	<transition name="fade" v-if="alert.isVisible">
		<div class="alert" 
		v-bind:class="{'alert-success': alert.type == 'success', 'alert-danger': alert.type == 'error'}">
			<strong>{{alert.summary}}</strong> {{alert.message}}
		</div>
	</transition>
</template>

<script>
export default {
	name: 'Alert',
	props: ['showAlert'],
	data() {
		return {
			defaultAlert: {
		        isVisible: false,
		        itemModificationSuccess: false,
		        itemModificationError: false,
		        summary: null,
		        message: null,
	      	}
		}
	},
	computed: {
	    alert () {
	      return this.showAlert;
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