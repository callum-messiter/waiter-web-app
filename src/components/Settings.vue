<template>
	<div class="container">

		<img 
	    src="../assets/shield.png" 
	    class="header-img"
	  >

	  <div class="row">

		  <div class="col-sm-4">
				<form id="companyDetails" data-vv-scope="companyDetails">
					<h4>Company Details <icon class="header-icon" name="info"></icon></h4>
			    <div class="input-group">
			      <div class="input-row">
			        <icon name="building"></icon>
			        <input 
			        	name="business_name" 
			        	placeholder="Company Name"
			        	v-validate="{required: true, max: 200}"
			        	data-vv-as="company name"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyDetails'].includes('business_name')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="globe"></icon>
			        <!-- Dropdown list with country codes -->
			        <input 
			        	name="country" 
			        	placeholder="Country"
			        	v-validate="{required: true}"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyDetails'].includes('country')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="pound-sign"></icon>
			        <!-- Dropdown list with country codes -->
			        <input 
			        	name="currency" 
			        	placeholder="Currency"
			        	v-validate="{required: true}"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyDetails'].includes('currency')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="map-marker-alt"></icon>
			        <input 
			        	name="line1" 
			        	placeholder="Address Line 1"
			        	v-validate="{required: true}"
			        	data-vv-as="address line 1"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyDetails'].includes('line1')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="map-marker-alt"></icon>
			        <input 
			        	name="city" 
			        	placeholder="City"
			        	v-validate="{required: true}"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyDetails'].includes('city')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="map-marker-alt"></icon>
			        <!-- Dropdown list with country codes -->
			        <input 
			        	name="postal_code" 
			        	placeholder="Postcode"
			        	v-validate="{required: true}"
			        	data-vv-as="postcode"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyDetails'].includes('postal_code')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="money-bill-alt"></icon>
			        <input 
			        	name="business_tax_id" 
			        	placeholder="Companies House Registration Number"
			        	v-validate="{required: true, max: 200}"
			        	data-vv-as="Companies House registration number"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyDetails'].includes('business_tax_id')"
			        >*</span>
			      </div>
			    </div>
			    
			    <button type="button">Save</button>
			  </form>
			</div>

			<div class="col-sm-4">
				<form id="companyRep" data-vv-scope="companyRep">
					<h4>Company Representative <icon class="header-icon" name="user"></icon></h4>
			    <div class="input-group">
			      <div class="input-row">
			        <icon name="user"></icon>
			        <input 
			        	name="firstName" 
			        	placeholder="First Name"
			        	v-validate="{required: true, max: 100}"
			        	data-vv-as="first name"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('firstName')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="user"></icon>
			        <input 
			        	name="lastName" 
			        	placeholder="Last Name"
			        	v-validate="{required: true, max: 100}"
			        	data-vv-as="last name"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('lastName')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="calendar"></icon>
			        <input 
			        	name="dob_day" 
			        	placeholder="DoB (day)" 
			        	v-validate="{required: true}"
			        	data-vv-as="DoB (day)"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('dob_day')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="calendar"></icon>
			        <input 
			        	name="dob_month" 
			        	placeholder="DoB (month)" 
			        	v-validate="{required: true}"
			        	data-vv-as="DoB (month)"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('dob_month')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="calendar"></icon>
			        <input 
			        	name="dob_year" 
			        	placeholder="DoB (year)" 
			        	v-validate="{required: true}"
			        	data-vv-as="DoB (year)"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('dob_year')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="address-book"></icon>
			        <input 
			        	name="personal_address_line1" 
			        	placeholder="Line 1"
			        	v-validate="{required: true}"
			        	data-vv-as="personal address (line 1)"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('personal_address_line1')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="address-book"></icon>
			        <input 
			        	name="personal_address_city" 
			        	placeholder="City"
			        	v-validate="{required: true}"
			        	data-vv-as="personal address (city)"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('personal_address_city')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="address-book"></icon>
			        <!-- Dropdown list with country codes -->
			        <input 
			        	name="personal_address_postal_code" 
			        	placeholder="Postcode"
			        	v-validate="{required: true}"
			        	data-vv-as="personal address (postcode)"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('personal_address_postal_code')"
			        >*</span>
			      </div>
			    </div>
			    
			    <button type="button">Save</button>
			  </form>
			</div>

			<div class="col-sm-4">
				<form id="companyBankAccount" data-vv-scope="companyBankAccount">
					<h4>Company Bank Account <icon class="header-icon" name="credit-card"></icon></h4>
			    <div class="input-group">
			      <div class="input-row">
			        <icon name="user"></icon>
			        <input 
			        	name="accountHolderName" 
			        	placeholder="Account Holder Name"
			        	v-validate="{required: true, max: 205}"
			        	data-vv-as="account holder name"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyBankAccount'].includes('accountHolderName')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="credit-card"></icon>
			        <input 
			        	name="accountNum" 
			        	placeholder="Account Number"
			        	v-validate="{required: true, numeric: true}"
			        	data-vv-as="account number"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyBankAccount'].includes('accountNum')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="credit-card"></icon>
			        <input 
			        	name="sortCode" 
			        	placeholder="Sort Code"
			        	v-validate="{required: true, numeric: true}"
			        	data-vv-as="sort code"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyBankAccount'].includes('sortCode')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="globe"></icon>
			        <!-- Dropdown list with country codes -->
			        <input 
			        	name="country" 
			        	placeholder="Country"
			        	v-validate="{required: true}"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyBankAccount'].includes('country')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="pound-sign"></icon>
			        <!-- Dropdown list with country codes -->
			        <input 
			        	name="currency" 
			        	placeholder="Currency"
			        	v-validate="{required: true}"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyBankAccount'].includes('currency')"
			        >*</span>
			      </div>
			    </div>
			    
			    <button type="button">Save</button>
			  </form>
			</div>
		</div>
	</div>
</template>

<script>

// Components
import RestaurantMenu from './RestaurantMenu';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';

// Mixins
import functions from '../mixins/functions';

// Events bus
import { bus } from '../main';

export default {
	name: 'Settings',
	components: {
    'clip-loader': ClipLoader
  },
  mixins: [functions],

	data() {
		return {
			stripeParams: {
				
				individual: {
					external_account: '', // required (get from Stripe Api)
					tos_acceptance: {
						date: '', // required
						ip: '' // required
					},
					legal_entity: {
						first_name: '', // required
						last_name: '', // required
						type: 'individual', // required
						address : {
							city: '',
							line1: '',
							postal_code: ''
						},
						dob: {
							day: '', // required
							month: '', // required
							year: '' // required
						}
					}
				},

				company: {
					external_account: '', // required (get from Stripe Api)
					tos_acceptance: {
						date: '', // required
						ip: '' // required
					},
					legal_entity: {
						first_name: '', // required
						last_name: '', // required
						type: 'company', // required
						business_name: '', // required
						business_tax_id: '', // Companies House Registration Number (CRN)
						personal_address: {
							city: '',
							line1: '',
							postal_code: ''
						},
						address : {
							city: '',
							line1: '',
							postal_code: ''
						},
						dob: {
							day: '', // required
							month: '', // required
							year: '' // required
						}
					}
				}

			},

			// These details are sent to Stripe's API, and a token is returned. We store this token in the external_account param
			bankAccountParams: {
				country: '',
				currency: '',
				routing_number: '', // sort code
				account_number: '',
				account_holder_name: '',
				account_holder_type: '',
			},

			requiredFields: {
				companyDetails: [
					'business_name',
					'country',
					'currency'
				],
				companyRep: [
					'firstName',
					'lastName',
					'dob_day',
					'dob_month',
					'dob_year'
				],
				companyBankAccount: [
					'country',
					'currency',
					'sortCode',
					'accountNum',
					'accountHolderName'
				]
			},

			loading: {
				still: true,
				spinnerColor: '#469ada',
				spinnerSize: '70px',
				msg: 'Loading your dashboard...'
			}
		}
	},

	created () {}
}

</script>

<style scoped>

@font-face {
  font-family: 'grotesque';
  src: url("../fonts/grotesque.otf");
}

.container {
  /**background-image: url('../../assets/restaurant.jpg');**/
  background-color: #1b1c23;
  display: -webkit-flex;
  display: flex;
  height: 100vh;
  width: 100vw;
  background-size: cover;
  padding: 0 10px;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
 }

.header-img {
  height: 50px;
  width: auto;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
  margin-bottom: 30px;
}
  
#signinForm {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 300px;
}

.input-group {
  width: 100%;
  border-radius: 3px !important;
  padding-top: 10px;
}

.input-row {
  display: flex;
  align-items: center;
  background-color: white;
  padding-left: 8px;
  padding-right: 8px;
  border-bottom: 1px solid #eee;
}

input {
  width: 100%;
  height: 45px;
  padding-left: 8px;
  border: none;
  font-size: 14px;
  outline: none;
}
  
button {
  width: 100%;
  height: 45px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #343959;
  border: 1px solid #343959;
  border-radius: 3px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
}

span {
  cursor: pointer;
}

.link-view {
  color: #ffffff;
  font-size: 13px;
}

.link-text {
  text-decoration: underline;
  color: #8bd9ed;
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

h4 {
	color: white;
	text-align: center
}

.row {
	width: 80%;
}

.header-icon {
	color: #8bd9ed ;
}

.requiredMarker {
	font-size: 25px;
	color: red;
}

</style>
