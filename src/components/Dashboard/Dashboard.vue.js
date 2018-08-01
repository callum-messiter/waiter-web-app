import RestaurantMenu from '../RestaurantMenu/RestaurantMenu';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import functions from '../../mixins/functions';
import { bus } from '../../main';

export default {
	name: 'Dashboard',
	components: {
		'restaurant-menu': RestaurantMenu,
		'clip-loader': ClipLoader
	},
	mixins: [functions],

	data() {
		return {
			restaurant: {
				name: 'Spices',
				imageUrl: '',
			},
			menuName: 'Main Menu',
			loading: {
				still: true,
				spinnerColor: '#469ada',
				spinnerSize: '70px',
				msg: 'Loading your dashboard...'
			}
		}
	},

	/**
		When the Dashboard component is created, grab the user's entire menu object from the backend,
		and add it to the store. The child component Category, and its child component Item, will get this data
		from the store and render it.

		The user will always have a menu in the backend; the create-user endpoint (called on signup) creates
		the user, the user's restaurant, and the restaurant default menu, with five default categories.
	**/
	created () {
		const menuId = JSON.parse(localStorage.menu).menuId;
		// Get the menu object and add it to the store
		this.$http.get('menu/'+menuId, {
		  headers: {Authorization: JSON.parse(localStorage.user).token}
		}).then((res) => {
		  this.loading.still = false;
		  this.$store.commit('setMenu', res.body.data);

		}).catch((res) => {
		  this.handleApiError(res);
		});
	}
}