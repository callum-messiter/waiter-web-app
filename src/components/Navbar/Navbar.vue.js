import routes from '../../router/routes';

export default {
	name: 'Navbar',
	components: {},
	data() {
		return {
			user: {
				firstName: 'Callum',
				lastName: 'Messiter'
			},
			routes: routes
		}
	},

	created () {},

	methods: {
		logUserOut() {
			localStorage.removeItem('user');
			localStorage.removeItem('restaurant');
			localStorage.removeItem('menu');
			this.$store.commit('deauthenticateUser');
			localStorage.isAuth = false;
			this.$router.push({ path: routes.home, query: { logout: true } });
		}
	},

	computed: {
		userIsSignedIn () {
			return this.$store.getters.isUserAuthenticated;
		}
	}
}