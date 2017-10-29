<template>
<div class="container">
  <div class="col-md-6 col-md-offset-3">
    <div id="logbox" v-bind:class="{'raised': !loginFormIsVisible}">
      <!-- Registration form -->
      <form id="signup" v-if="!loginFormIsVisible">
        <h1>Sign up to waiter</h1>
        <input 
          class="input pass" 
          type="email" 
          placeholder="Email address" 
          v-model="form.signup.email"
        />
        <input 
          class="input pass" 
          type="password" 
          placeholder="Choose a password" 
          v-model="form.signup.password"
        />
        <input 
          class="input pass" 
          type="password" 
          placeholder="Confirm password" 
          v-model="form.signup.confirmPassword"
        />
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
      </form>
      <!-- Login form -->
      <form id="login" v-else>
        <h1>Login</h1>
        <input 
          class="input pass"
          type="email" 
          placeholder="Enter your email" 
          v-model="form.login.email"
        />
        <input 
          class="input pass" 
          type="password" 
          placeholder="Enter your password" 
          v-model="form.login.password"
        />
        <button 
          type="button"
          class="inputButton">
          Sign me in
        </button>
        <div class="text-center"">
            <a 
              class="formLink" 
              v-on:click="hideLoginForm">
              Sign up
            </a>
            - 
            <a 
              class="formLink">
              Forgot password
            </a>
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

export default {
  name: 'Home', 
  data() {
    return {
      loginFormIsVisible: false,
      form: {
        login: {
          email: '',
          password: '',
        },
        signup: {
          email: '',
          password: '',
          confirmPassword: ''
        }
      }
    }
  },

  created () {
  },
  
  methods: {
    showLoginForm() {
      this.loginFormIsVisible = true;
    },

    hideLoginForm() {
      this.loginFormIsVisible = false;
    },

    registerUser(email, password, confirmPassword) {
      // Validate the data
      // Make an API call
      this.$http.get("http://localhost:3000/api/auth/login?"+email+"&password="+password, {
      }).then((data) => {
        console.log(data);
      });
      // If 200, authenticate the user in the store
      // this.$router.push('/dashboard');
    }
  },

  computed: {
    comparePasswords() {
      return this.form.signup.password == this.form.signup.confirmPassword ? '' : 'Passwords do not match'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.raised {
  margin-top: 10px !important;
}

::selection {
  background-color: #b5e2e7;
}

::-moz-selection {
  background-color: #8ac7d8;
}

body {
  background: #3CC;
}

.container {
  display: -webkit-flex;
  display: flex;
  height: 100%;
}

#logbox {
  padding: 10px;
  margin: 50px auto;
  width: 340px;
  background-color: #fff;
  -webkit-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
}

h1 {
  text-align: center;
  font-size: 175%;
  color: #757575;
  font-weight: 300;
}

h1, input {
  font-family: "Open Sans", Helvetica, sans-serif;
}

.input {
  width: 75%;
  height: 50px;
  display: block;
  margin: 0 auto 15px;
  padding: 0 15px;
  border: none;
  border-bottom: 2px solid #ebebeb;
}

.input:focus {
  outline: none;
  border-bottom-color: #22262d !important;
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
  width: 85%;
  height: 50px;
  display: block;
  margin: 30px auto 30px;
  color: white;
  background-color: #22262d;
  border: none;
  -webkit-box-shadow: 0 5px 0 #6f7682;
  -moz-box-shadow: 0 5px 0 #6f7682;
  box-shadow: 0 5px 0 #6f7682;
}

.inputButton:hover {
  top: 2px;
  -webkit-box-shadow: 0 3px 0 #818ea5;
  -moz-box-shadow: 0 3px 0 #818ea5;
  box-shadow: 0 3px 0 #818ea5;
}

.inputButton:active {
  top: 5px;
  box-shadow: none;
}

.inputButton:focus {
  outline: none;
}

.formLink {
  cursor: pointer;
}

</style>
