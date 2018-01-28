<template>
	<transition name="fade" v-if="alert.isVisible">
		<div class="alert">
			<div class="col-sm-2">
				<span class="glyphicon glyphicon-remove" v-if="alert.type == 'error'"></span>
				<span class="glyphicon glyphicon-ok" v-if="alert.type == 'success'"></span>
			</div>
			<div class="col-sm-10">
				<h4 v-if="alert.type == 'error'">Something went wrong...</h4>
				<h4 v-if="alert.type == 'success'">Success!</h4>
				<p>{{alert.message}}</p>
			</div>
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
      }, 5000);
		}
	}
}
</script>

<style scoped>
	@font-face {
		font-family: 'grotesque';
		src: url("../fonts/grotesque.otf");
	}

	.fade-enter-active, .fade-leave-active {
	    transition: opacity .5s
	}

	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0
	}

	.alert {
		width: 450px;
		background-color: #3a3a3a;
		border: 3px solid #469ada;
		font-family: 'grotesque';
		font-weight: bold;
		color: #fff;
		position: absolute;
		bottom: 20px;
		right: 20px;
		z-index: 1000;
	}

	p {
		text-align: left;
		font-size: 13px;
	}

	h4 {
		font-weight: bold;
		text-align: left;
		margin-top: 5px;
	}

	.glyphicon {
		font-size: 40px;
		margin-top: 22px; /** For centering vertically: is there a better way? **/
		margin-right: 10px;
	}
</style>
