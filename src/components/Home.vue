<template>
  <div class="container">
    <div class="col-xs-12">
      <div id="logbox" v-bind:class="{'raised': !loginFormIsVisible}">
        <alert></alert>
        <!-- Registration form -->
        <form id="signup" v-if="!loginFormIsVisible">
          <div class="row">
            <h1>Sign up to waitr</h1>
          </div>
          <!-- First name -->
          <div class="row">
            <div class="col-sm-6">
              <input
                :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('firstName') }"
                name="firstName"
                type="text"
                v-bind:placeholder="form.signup.firstName.placeholder"
                v-model="form.signup.firstName.value"
                v-validate="{required: true, max: 100}"
                v-on:focus="hidePlaceholder('signup', 'firstName')"
                v-on:blur="updateInputStatus('signup', 'firstName')"
                data-vv-as="first name"
              />
              <span
                class="help is-danger"
                v-show="errors.has('firstName')">
                {{ errors.first('firstName') }}
              </span>
            </div>

            <!-- Last name -->
            <div class="col-sm-6">
              <input
                :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('lastName') }"
                name="lastName"
                type="text"
                v-bind:placeholder="form.signup.lastName.placeholder"
                v-model="form.signup.lastName.value"
                v-validate="{required: true, max: 100}"
                v-on:focus="hidePlaceholder('signup', 'lastName')"
                v-on:blur="updateInputStatus('signup', 'lastName')"
                data-vv-as="last name"
              />
              <span
                class="help is-danger"
                v-show="errors.has('lastName')">
                {{ errors.first('lastName') }}
              </span>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6">
              <!-- Email address -->
              <input
                :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('email') }"
                name="email"
                type="email"
                v-bind:placeholder="form.signup.email.placeholder"
                v-model="form.signup.email.value"
                v-validate="{required: true, max: 150}"
                v-on:focus="hidePlaceholder('signup', 'email')"
                v-on:blur="updateInputStatus('signup', 'email')"
              />
              <span
                class="help is-danger"
                v-show="errors.has('email')">
                {{ errors.first('email') }}
              </span>
            </div>
            <div class="col-sm-6">
              <!-- Restaurant name -->
              <input
                :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('restaurantName') }"
                name="restaurantName"
                type="restaurantName"
                v-bind:placeholder="form.signup.restaurantName.placeholder"
                v-model="form.signup.restaurantName.value"
                v-validate="{required: true, max: 150}"
                v-on:focus="hidePlaceholder('signup', 'restaurantName')"
                v-on:blur="updateInputStatus('signup', 'restaurantName')"
                data-vv-as="restaurant name"
              />
              <span
                class="help is-danger"
                v-show="errors.has('restaurantName')">
                {{ errors.first('restaurantName') }}
              </span>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6">
              <!-- Password -->
              <input
                :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('password') }"
                name="password"
                type="password"
                v-bind:placeholder="form.signup.password.placeholder"
                v-model="form.signup.password.value"
                v-validate="{required: true, min: 6, max: 30}"
                v-on:focus="hidePlaceholder('signup', 'password')"
                v-on:blur="updateInputStatus('signup', 'password')"
              />
              <span
                class="help is-danger"
                v-show="errors.has('password')">
                {{ errors.first('password') }}
              </span>
            </div>
            <div class="col-sm-6">
              <!-- Confirm Password -->
              <input
                :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('confirmPassword') && inputs.hasHadFocus.indexOf('confirmPassword') > -1}"
                name="confirmPassword"
                type="password"
                v-bind:placeholder="form.signup.confirmPassword.placeholder"
                v-model="form.signup.confirmPassword.value"
                v-validate="'confirmed:password|required'"
                v-on:focus="hidePlaceholder('signup', 'confirmPassword')"
                v-on:blur="updateInputStatus('signup', 'confirmPassword')"
                data-vv-as="confirm password"
              />
              <span
                class="help is-danger"
                v-show="errors.has('confirmPassword') && inputs.hasHadFocus.indexOf('confirmPassword') > -1">
                {{ errors.first('confirmPassword') }}
              </span>
            </div>
          </div>

          <div class="row">
            <!-- Registration button and links -->
            <button
              class="inputButton"
              v-on:click="registerUser()"
              type="button">
              Sign me up!
            </button>
            <div class="text-center">
              Already have an account?
              <a
                class="formLink"
                v-on:click="showLoginForm">
                Login
              </a>
            </div>
          </div>
        </form>

        <!-- Login form -->
        <form id="login" v-else>
          <h1>Login to waitr</h1>
          <input
            class="input pass"
            type="email"
            v-bind:placeholder="form.login.email.placeholder"
            v-model="form.login.email.value"
            v-on:focus="hidePlaceholder('login', 'email')"
            v-on:blur="updateInputStatus('login', 'email')"
          />
          <input
            class="input pass"
            type="password"
            v-bind:placeholder="form.login.password.placeholder"
            v-model="form.login.password.value"
            v-on:focus="hidePlaceholder('login', 'password')"
            v-on:blur="updateInputStatus('login', 'password')"
          />
          <button
            type="button"
            class="inputButton"
            v-on:click="logUserIn()">
            Sign me in
          </button>
          <div class="text-center"">
              Don't have an account?
              <a
                class="formLink"
                v-on:click="hideLoginForm">
                Sign up
              </a>
              <!--
              -
              <a
                class="formLink">
                Forgot password
              </a>
              -->
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

// Events bus
import { bus } from '../main';

// Components
import Alert from './Alert';

// Mixins
import functions from '../mixins/functions';

export default {
  name: 'Home',
  components: {
    'alert': Alert
  },
  mixins: [functions],
  data() {
    return {
      loginFormIsVisible: false,
      form: {
        login: {
          email: {
            value: '',
            placeholder: 'Email address'
          },
          password: {
            value: '',
            placeholder: 'Password'
          },
        },
        signup: {
          firstName: {
            value: '',
            placeholder: 'First name'
          },
          lastName: {
            value: '',
            placeholder: 'Last name'
          },
          email: {
            value: '',
            placeholder: 'Enter a valid email address'
          },
          restaurantName: {
            value: '',
            placeholder: 'Restaurant name'
          },
          password: {
            value: '',
            placeholder: 'Choose a password'
          },
          confirmPassword: {
            value: '',
            placeholder: 'Re-enter password'
          }
        }
      },
      formDefault: {
        login: {
          email: {
            value: '',
            placeholder: 'Email address'
          },
          password: {
            value: '',
            placeholder: 'Password'
          },
        },
        signup: {
          firstName: {
            value: '',
            placeholder: 'First name'
          },
          lastName: {
            value: '',
            placeholder: 'Last name'
          },
          email: {
            value: '',
            placeholder: 'Enter a valid email address'
          },
          restaurantName: {
            value: '',
            placeholder: 'Restaurant name'
          },
          password: {
            value: '',
            placeholder: 'Choose a password'
          },
          confirmPassword: {
            value: '',
            placeholder: 'Re-enter password'
          }
        }
      },
      inputs: {
        hasFocus: '',
        hasHadFocus: []
      },
      alert: {
        isVisible: true,
        type: null,
        summary: null,
        message: null,
      }
    }
  },

  created () {
    // If the user is logged in, redirect them to their dashboard when they visit the home page
    if(this.userIsAuthenticated) {
      this.$router.push('/dashboard');
    }
  },

  methods: {
    hidePlaceholder(form, input) {
      this.form[form][input].placeholder = '';
    },
    /**
      Using V-Validate, we check beore signing a user in whether the form has any errors.
      If no input has yet been clicked, and the user clicks the submit button, no errors
      will be registered yet, and so they request will be sent to the API.
      To avoid this, we also check if any inputs have had focus; hence, we track this here.
    **/
    updateInputStatus(form, input) {
      // Whenever an input loses focus, reset the placehodler to its default (because on focus, we set it to '')
      this.form[form][input].placeholder = this.formDefault[form][input].placeholder;
      // Set "focus history" of form
      if(form == 'signup') {
        this.inputs.hasFocus = input;
        this.inputs.hasHadFocus.push(input);
      }
    },
    showLoginForm() {
      // Reset the signup form
      this.form.signup = JSON.parse(JSON.stringify(this.formDefault.signup));
      this.loginFormIsVisible = true;
    },

    hideLoginForm() {
      // Reset the login form
      this.form.login = JSON.parse(JSON.stringify(this.formDefault.login));
      this.loginFormIsVisible = false;
    },

    logUserIn() {
      this.$http.get("auth/login?email="+this.form.login.email.value+"&password="+this.form.login.password.value, {
      }).then((res) => {
        if(res.status == 200 || res.status == 201) {
          // Add data to local storage
          localStorage.setItem('user', JSON.stringify(res.body.data.user));
          localStorage.setItem('isAuth', true);
          localStorage.setItem('restaurant', JSON.stringify(res.body.data.restaurant)); // restaurantId and name
          localStorage.setItem('menu', JSON.stringify(res.body.data.menu)); // menuId and name
          // Reset the login form 
          this.form.login = JSON.parse(JSON.stringify(this.formDefault.login));
          // Set auth state to true
          this.$store.commit('authenticateUser');
          // Redirect user to their dashboard
          this.$router.push('/dashboard');
        }
      }).catch((res) => {
        // Reset the login form 
        this.form.login = JSON.parse(JSON.stringify(this.formDefault.login));
        this.handleApiError(res);
      });
    },

    registerUser() {
      // Validate inputs (betters: if there are errors, set the button to red/unclickable using a computed property)
      if(!this.errors.any() && this.inputs.hasHadFocus.length > 0) {
        // Make the API call
        this.$http.post('user/create', {
          userType: 'restaurateur',
          firstName: this.form.signup.firstName.value,
          lastName: this.form.signup.lastName.value,
          restaurantName: this.form.signup.restaurantName.value,
          email: this.form.signup.email.value,
          password: this.form.signup.password.value
        }).then((res) => {
          // For now just log the user in; later we will handle email verification
          this.form.login.email.value = this.form.signup.email.value;
          this.form.login.password.value = this.form.signup.password.value;
          
          // Reset the signup form 
          this.form.signup = JSON.parse(JSON.stringify(this.formDefault.signup));
          this.logUserIn();
        }).catch((res) => {
          this.handleApiError(res);
        });
      }
    }
  },

  computed: {
    userIsAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  @font-face {
    font-family: grotesque;
    src: url("../fonts/grotesque.otf");
  }

  .help {
    color: #dd0d0d !important;
    font-size: 10px;
  }

  .is-danger-input {
    border-bottom: 2px solid #dd0d0d !important;
    margin-bottom: 0px !important;
  }

  .is-danger-input:focus {
    border-bottom: 2px solid #dd0d0d !important;
  }

  .container {
    display: -webkit-flex;
    display: flex;
    height: 100vh;
    width: 100vw;
    background-image: url('../assets/restaurant.jpg');
    background-size: cover;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
  }

  #logbox {
    padding: 10px;
    margin: 0 auto;
    width: 500px;
    height: 70vh;
    margin-top: 15vh;
    background-color: rgba(0, 0, 0, 0.8);
    padding: 30px 20px 20px 20px;
    color: #fff;
  }

@-webkit-keyframes autofill {
  to {
    background: none;
    color: #fff;
  }
}

input.input.pass:-webkit-autofill {
  -webkit-animation-name: autofill !important;
  -webkit-animation-fill-mode: both !important;
  -webkit-box-shadow: none !important;
}

  h1 {
    text-align: center;
    font-size: 2.5em;
    color: #fff;
  }

  h1, input {
    font-family: "grotesque", Helvetica, sans-serif;
  }

  .input {
    width: 100%;
    height: 50px;
    display: block;
    margin: 0 auto 15px;
    padding: 0 5px;
    border: none;
    background: transparent;
    border-bottom: 2px solid #fff;
    text-align: left;
    font-size: 14px;
  }

  ::-webkit-input-placeholder {
    color: #fff;
    text-align: left;
  }
  ::-moz-placeholder {
    color: #fff;
  }
  :-ms-input-placeholder {
    color: #fff;
  }
  :-moz-placeholder {
    color: #fff;
  }

  .input:focus {
    outline: none;
    border-bottom-color: #469ada !important;
  }

  .input:focus::-webkit-input-placeholder{
    color: #469ada;
  }

  .input:focus::-moz-placeholder{
    color: #469ada;
  }

  .input:focus:-ms-input-placeholder{
    color: #469ada;
  }

  .input:focus:-moz-placeholder{
    color: #469ada;
  }

  .input:hover {
    border-bottom-color: #dcdcdc;
  }

  .input:invalid {
    box-shadow: none;
  }

  .pass:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset;
  }

  .inputButton {
    position: relative;
    width: 40%;
    height: 50px;
    display: block;
    margin: 30px auto 30px;
    color: white;
    background-color: #469ada;
    border: 1px solid #469ada;
    border-radius: 3px;
    cursor: pointer;
  }

  .inputButton:focus {
    outline: none;
  }

  .formLink {
    cursor: pointer;
  }

  .text-center {
    color: #fff;
  }

  .text-center a {
    color: #fff;
    text-decoration: underline;
  }

  #login {
    padding-top: 50px;
  }

  @media (min-width: 1500px) and (min-height: 1000px) {
    #logbox {
      width: 600px;
      height: 50vh;
      margin-top: 25vh;
    }
    h1 {
      font-size: 50px !important;
    }
    input {
      height: 60px !important;
      font-size: 18px !important;
    }
    .inputButton {
      font-size: 25px;
      height: 60px;
    }
    .text-center {
      font-size: 18px !important;
    }
  }

  @media (min-width: 1800px) and (min-height: 1100px) {
    #logbox {
      width: 700px;
    }
    h1 {
      margin-bottom: 30px;
    }
    input {
      height: 70px !important;
      font-size: 22px !important;
    }
    .inputButton {
      margin-top: 50px;
      height: 70px;
    }
    .text-center {
      font-size: 24px !important;
    }
  }

  @media (min-width: 2300px) and (min-height: 1300px) {
    #logbox {
      width: 900px;
      padding: 60px;
    }
    h1 {
      font-size: 70px !important;
    }
    input {
      font-size: 25px !important;
      height: 80px !important;
    }
    .inputButton {
      height: 80px;
      font-size: 30px;
    }
  }

  @media (max-width: 767px) {
    #logbox {
      margin-top: 20px;
    }
    input {
      width: 75% !important;
      height: 35px !important;
    }
    .inputButton {
      height: 35px !important;
      width: 30% !important;
      margin-top: 12px !important;
    }
    h1 {
      font-size: 25px !important;
    }
    .text-center {
      margin-top: -15px !important;
    }
  }

  @media (max-width: 540px) {
    #logbox {
      width: 390px;
    }
  }

  @media (max-width: 440px) {
    #logbox {
      width: 320px;
    }
    .inputButton {
      width: 60% !important;
    }
  }

  @media (max-width: 375px) {
    #logbox {
      width: 290px;
    }
  }

  @media (max-height: 630px) {
    .container {
      height: auto;
      min-height: 100vh;
      padding-bottom: 40px;
    }
    #logbox {
      height: 70vh;
      min-height: 450px;
      margin-top: 15vh;
    }
  }


  @media (max-height: 590px) {
    .container {
      height: auto;
      min-height: 100vh;
      padding-bottom: 40px;
    }
    #logbox {
      height: 80vh;
      min-height: 450px;
      margin-top: 10vh;
    }
  }

</style>
