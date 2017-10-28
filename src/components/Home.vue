<template>
<div class="container" :style="{ 'background-image': 'url(' + backgroundImage + ')' }">
  <div class="col-md-6 col-md-offset-3">
    <div id="logbox" v-bind:class="{'raised': !loginFormIsVisible}">
      <form id="signin" v-if="loginFormIsVisible">
        <h1>Login</h1>
        <input type="email" placeholder="Enter your email" class="input pass"/>
        <input type="password" placeholder="Enter your password" required="required" class="input pass"/>
        <input type="submit" value="Sign me in!" class="inputButton"/>
        <div class="text-center"">
            <a v-on:click="hideLoginForm" href="#" id="">Sign up</a> - <a href="#" id="">Forgot password</a>
        </div>
      </form>
      <form id="signup" v-else>
        <h1>Sign up to waiter</h1>
        <input type="email" placeholder="Email address" class="input pass"/>
        <input type="password" placeholder="Choose a password"  class="input pass"/>
        <input type="password" placeholder="Confirm password" class="input pass"/>
        <input type="submit" value="Sign me up!" class="inputButton"/>
        <div class="text-center">
            Already have an account? <a v-on:click="showLoginForm" href="#" id="login_id">Login</a>
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
      backgroundImage: './src/assets/home-image.jpg',
      loginFormIsVisible: false
    }
  },

  created () {},
  
  methods: {
    showLoginForm() {
      this.loginFormIsVisible = true;
    },

    hideLoginForm() {
      this.loginFormIsVisible = false;
    }
  },

  computed: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.background-image {
  height: 1000px;
  width: 600px;
}

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
</style>
