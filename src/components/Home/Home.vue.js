import Vue from 'vue';
import VueSocketio from 'vue-socket.io';
import settings from '../../../config/settings';
import functions from '../../mixins/functions';
import routes from '../../router/routes';

export default {
  name: 'Landing',
  components: {},
  mixins: [functions],
  data() {
    return {
      activeForm: 'signin',
      forms: {
        signin: {
          email: '',
          password: ''
        },
        signup: {
          firstName: '',
          lastName: '',
          restaurantName: '',
          email: '',
          password: '',
          confirmPassword: ''
        }
      }
    }
  },

  watch: {
    // Remove the flash message when the user toggles to another form
    activeForm: function() {
      this.flash().destroyAll();
    }
  },

  created () {
    // If the user is logged in, redirect them to...
    if(this.userIsAuthenticated) {
      this.$router.push(routes.liveOrders);
    }
  },

  methods: {
    signin(autoLogin=false) {
      var email, pass, targetRoute;
      // If the login is automatic, upon successful registration, then we use the details from the sign up form
      if(autoLogin) {
        email = this.forms.signup.email;
        pass = this.forms.signup.password;
        targetRoute = 'dashboard';
      } else {
        // If the login is manual (the user has used the signin form), we must validate it
        if(this.someFieldsAreEmpty(this.forms.signin)) {
          this.displayFlashMsg(
            'The username and password you entered did not match our records. Please double-check and try again.',
            'error'
          );
          return;
        }
        email = this.forms.signin.email;
        pass = this.forms.signin.password;
        targetRoute = 'kitchen';
      }

      const queryString = '?email='+email+'&password='+pass;
      this.$http.get('auth/login'+queryString, {
      }).then((res) => {
        console.log(res.body.data);
        if(res.status == 200 || res.status == 201) {
          // Add data to local storage
          localStorage.setItem('user', JSON.stringify(res.body.data.user));
          localStorage.setItem('isAuth', true);
          localStorage.setItem('restaurant', JSON.stringify(res.body.data.restaurant)); // restaurantId and name
          localStorage.setItem('menu', JSON.stringify(res.body.data.menu)); // menuId and name
          this.$store.commit('authenticateUser');
          this.connectToWebSocketsServer();
          /* TODO: once stable and tested, only connect to WS server if stripe account is verified */
          if(!res.body.data.restaurant.isStripeAccountVerified) { targetRoute = routes.account; }
          this.$router.push(targetRoute);
        }

      }).catch((res) => {
        this.handleApiError(res);
      });
    },

    signup(scope) {
      // Check validation errors
      this.$validator.validateAll(scope).then((result) => {
        if(this.errors.any()) {
          this.displayFlashMsg(this.errors.all()[0], 'error');
          return;
        }

        // Check for empty fields (v-validate doesn't catch this if the user doesn't give focus to the inputs)
        if(this.someFieldsAreEmpty(this.forms.signup)) {
          this.displayFlashMsg('Please fill in all the fields!', 'error');
          return;
        }

        this.$http.post('user/r', {
          firstName: this.forms.signup.firstName,
          lastName: this.forms.signup.lastName,
          restaurantName: this.forms.signup.restaurantName,
          email: this.forms.signup.email,
          password: this.forms.signup.password
        }).then((res) => {

          // For now just log the user in; later we will handle email verification
          this.signin(true);

        }).catch((res) => {
          this.handleApiError(res);
        });

      });
    },

    someFieldsAreEmpty(form) {
      for(var input in form) {
        const inputValMinusWhitespace = form[input].split(' ').join('');
        if(inputValMinusWhitespace == '') {
          return true;
        }
      }
      return false;
    },

    // Connect to LiveKitchen
    connectToWebSocketsServer() {
      if(localStorage.getItem('restaurant') !== null) {
        const r = JSON.parse(localStorage.restaurant);
        if(r.hasOwnProperty('restaurantId')) {
          Vue.use(VueSocketio, settings.webSocketsUrl+'?restaurantId='+r.restaurantId);
        }
      }
      return;
    }
  },

  computed: {
    userIsAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    }
  }
}