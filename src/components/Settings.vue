<template>
	<div class="container">

		<img 
	    src="../assets/shield.png" 
	    class="header-img"
	  >

	  <div class="row">

		  <div class="col-sm-4">
				<form id="companyDetails" v-on:keyup.enter="submit('companyDetails')" data-vv-scope="companyDetails">
					<h4>Company Details <icon class="header-icon" name="info"></icon></h4>
			    <div class="input-group">
			      <div class="input-row">
			        <icon name="building"></icon>
			        <input 
			        	name="legal_entity_business_name" 
			        	v-model="defaults.restaurantName"
			        	placeholder="Company Name"
			        	v-validate="{
			        		required: requiredFields['companyDetails'].includes('legal_entity_business_name'), 
			        		max: 200
			        	}"
			        	data-vv-as="company name"
			        />	
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyDetails'].includes('legal_entity_business_name')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="map-marker-alt"></icon>
			        <input 
			        	name="legal_entity_address_line1"
			        	v-model="forms['companyDetails'].legal_entity_address_line1"
			        	placeholder="Address Line 1"
			        	v-validate="{
			        		required: requiredFields['companyDetails'].includes('legal_entity_address_line1')
			        	}"
			        	data-vv-as="address line 1"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyDetails'].includes('legal_entity_address_line1')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="map-marker-alt"></icon>
			        <input 
			        	name="legal_entity_address_city"
			        	v-model="forms['companyDetails'].legal_entity_address_city" 
			        	placeholder="City"
			        	v-validate="{
			        		required: requiredFields['companyDetails'].includes('legal_entity_address_city')
			        	}"
			        	data-vv-as="city"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyDetails'].includes('legal_entity_address_city')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="map-marker-alt"></icon>
			        <!-- Dropdown list with country codes -->
			        <input 
			        	name="legal_entity_address_postal_code"
			        	v-model="forms['companyDetails'].legal_entity_address_postal_code" 
			        	placeholder="Postcode"
			        	v-validate="{
			        		required: requiredFields['companyDetails'].includes('legal_entity_address_postal_code')
			        	}"
			        	data-vv-as="postcode"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyDetails'].includes('legal_entity_address_postal_code')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="money-bill-alt"></icon>
			        <input 
			        	name="legal_entity_business_tax_id"
			        	v-model="forms['companyDetails'].legal_entity_business_tax_id"
			        	placeholder="Companies House Registration Number"
			        	v-validate="{
			        		required: requiredFields['companyDetails'].includes('legal_entity_business_tax_id'),
			        		max: 200
			        	}"
			        	data-vv-as="Companies House registration number"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyDetails'].includes('legal_entity_business_tax_id')"
			        >*</span>
			      </div>
			    </div>
			    
			    <button type="button" v-on:click="submit('companyDetails')">Save</button>
			  </form>
			</div>

			<div class="col-sm-4">
				<form id="companyRep" v-on:keyup.enter="submit('companyRep')" data-vv-scope="companyRep">
					<h4>Company Representative <icon class="header-icon" name="user"></icon></h4>
			    <div class="input-group">
			      <div class="input-row">
			        <icon name="user"></icon>
			        <input 
			        	name="legal_entity_first_name"
			        	v-model="defaults.comRep.firstName"
			        	placeholder="First Name"
			        	v-validate="{
			        		required: requiredFields['companyRep'].includes('legal_entity_first_name'), 
			        		max: 100
			        	}"
			        	data-vv-as="first name"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('legal_entity_first_name')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="user"></icon>
			        <input 
			        	name="legal_entity_last_name"
			        	v-model="defaults.comRep.lastName"
			        	placeholder="Last Name"
			        	v-validate="{
			        		required: requiredFields['companyRep'].includes('legal_entity_last_name'), 
			        		max: 100
			        	}"
			        	data-vv-as="last name"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('legal_entity_last_name')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="calendar"></icon>
			        <input 
			        	name="legal_entity_dob_day"
			        	v-model="forms['companyRep'].legal_entity_dob_day"
			        	placeholder="DoB (day)" 
			        	v-validate="{
			        		required: requiredFields['companyRep'].includes('legal_entity_dob_day'),
			        		numeric: true
			        	}"
			        	data-vv-as="DoB (day)"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('legal_entity_dob_day')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="calendar"></icon>
			        <input 
			        	name="legal_entity_dob_month"
			        	v-model="forms['companyRep'].legal_entity_dob_month"
			        	placeholder="DoB (month)" 
			        	v-validate="{
			        		required: requiredFields['companyRep'].includes('legal_entity_dob_month'),
			        		numeric: true
			        	}"
			        	data-vv-as="DoB (month)"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('legal_entity_dob_month')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="calendar"></icon>
			        <input 
			        	name="legal_entity_dob_year"
			        	v-model="forms['companyRep'].legal_entity_dob_year"
			        	placeholder="DoB (year)" 
			        	v-validate="{
			        		required: requiredFields['companyRep'].includes('legal_entity_dob_year'),
			        		numeric: true
			        	}"
			        	data-vv-as="DoB (year)"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('legal_entity_dob_year')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="address-book"></icon>
			        <input 
			        	name="legal_entity_personal_address_line1"
			        	v-model="forms['companyRep'].legal_entity_personal_address_line1" 
			        	placeholder="Line 1"
			        	v-validate="{
			        		required: requiredFields['companyRep'].includes('legal_entity_personal_address_line1')
			        	}"
			        	data-vv-as="personal address (line 1)"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('legal_entity_personal_address_line1')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="address-book"></icon>
			        <input 
			        	name="legal_entity_personal_address_city"
			        	v-model="forms['companyRep'].legal_entity_personal_address_city" 
			        	placeholder="City"
			        	v-validate="{
			        		required: requiredFields['companyRep'].includes('legal_entity_address_city')
			        	}"
			        	data-vv-as="personal address (city)"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('legal_entity_personal_address_city')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="address-book"></icon>
			        <!-- Dropdown list with country codes -->
			        <input 
			        	name="legal_entity_personal_address_postal_code"
			        	v-model="forms['companyRep'].legal_entity_personal_address_postal_code" 
			        	placeholder="Postcode"
			        	v-validate="{
			        		required: requiredFields['companyRep'].includes('legal_entity_address_postal_code')
			        	}"
			        	data-vv-as="personal address (postcode)"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyRep'].includes('legal_entity_personal_address_postal_code')"
			        >*</span>
			      </div>
			    </div>
			    
			    <button type="button" v-on:click="submit('companyRep')">Save</button>
			  </form>
			</div>

			<div class="col-sm-4">
				<form id="companyBankAccount" v-on:keyup.enter="submit('companyBankAccount')" data-vv-scope="companyBankAccount">
					<h4>Company Bank Account <icon class="header-icon" name="credit-card"></icon></h4>
			    <div class="input-group">
			      <div class="input-row">
			        <icon name="user"></icon>
			        <input 
			        	name="account_holder_name" 
			        	v-model="defaults.comRep.fullName"
			        	placeholder="Account Holder Name"
			        	v-validate="{
			        		required: requiredFields['companyBankAccount'].includes('account_holder_name'), 
			        		max: 205
			        	}"
			        	data-vv-as="account holder name"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyBankAccount'].includes('account_holder_name')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="credit-card"></icon>
			        <input 
			        	name="account_number"
			        	v-model="forms['companyBankAccount'].account_number"
			        	placeholder="Account Number"
			        	v-validate="{
			        		required: requiredFields['companyBankAccount'].includes('account_number'), 
			        		numeric: true
			        	}"
			        	data-vv-as="account number"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyBankAccount'].includes('account_number')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="credit-card"></icon>
			        <input 
			        	name="routing_number"
			        	v-model="forms['companyBankAccount'].routing_number"
			        	placeholder="Sort Code"
			        	v-validate="{
			        		required: requiredFields['companyBankAccount'].includes('routing_number'), 
			        		numeric: true
			        	}"
			        	data-vv-as="sort code"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyBankAccount'].includes('routing_number')"
			        >*</span>
			      </div>
			      <div class="input-row">
			        <icon name="globe"></icon>
			        <!-- Dropdown list with country codes -->
			        <input 
			        	name="country"
			        	v-model="forms['companyBankAccount'].country"
			        	placeholder="Country"
			        	v-validate="{
			        		required: requiredFields['companyBankAccount'].includes('country')
			        	}"
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
			        	v-model="forms['companyBankAccount'].currency"
			        	placeholder="Currency"
			        	v-validate="{
			        		required: requiredFields['companyBankAccount'].includes('currency')
			        	}"
			        />
			        <span 
			        	class="requiredMarker" 
			        	v-if="requiredFields['companyBankAccount'].includes('currency')"
			        >*</span>
			      </div>
			    </div>
			    
			    <button type="button" v-on:click="submit('companyBankAccount')">Save</button>
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

import settings from '../../config/settings';
const stripe = Stripe(settings.stripePubKey);

export default {
	name: 'Settings',
	components: {
    'clip-loader': ClipLoader
  },
  mixins: [functions],

	data() {
		return {
			// We should also get these details from Stripe's API and populate the inputs with them
			forms: {
				companyDetails: {
					legal_entity_address_line1: '',
					legal_entity_address_city: '',
					legal_entity_address_postal_code: '',
					legal_entity_business_tax_id: ''
				},
				companyRep: {
					tos_acceptance_date: '',
					tos_acceptance_ip: '',
					legal_entity_dob_day: '',
					legal_entity_dob_month: '',
					legal_entity_dob_year: '',
					legal_entity_personal_address_line1: '',
					legal_entity_personal_address_city: '',
					legal_entity_personal_address_postal_code: ''
				},
				// These details are sent to Stripe's API, and a token is returned. We store this token in the external_account param
				companyBankAccount: {
					country: '',
					currency: '',
					routing_number: '', // sort code
					account_number: '',
					account_holder_type: 'company',
				}
			},

			// We should call Stripe's API with the restaurant's Stripe Account ID, and check which verification params
			// are required. Then we should add them to these arrays.

			requiredFields: {
				companyDetails: [
					'legal_entity_business_name',
					//'email'
				],
				companyRep: [
					'legal_entity_first_name',
					'legal_entity_last_name',
					'legal_entity_dob_day',
					'legal_entity_dob_month',
					'legal_entity_dob_year'
				],
				companyBankAccount: [
					'country',
					'currency',
					'routing_number',
					'account_number',
					'account_holder_name'
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

	created () {
	},

	methods: {
		submit(scope) {

			// Check if the required fields are set
			this.$validator.validateAll(scope).then((result) => {
				if(this.errors.any(scope)) {
				  this.displayFlashMsg(this.errors.all(scope)[0], 'error');
				  return;
				}
				// If there are no errors, destroy any message that is visible
				this.flash().destroyAll();
			});

			// If the user clicks "Accept" to TOS, set the date and IP (we will only show the TOS once)
			const tosDate = Math.floor(Date.now() / 1000);

			var accToken = '';
			this.tokeniseBankAccount(scope, this.forms.companyBankAccount)
			.then((res) => {

				if(res.created) { accToken = res.token; }
				const account = this.buildAccountObject(tosDate, accToken);
				account.restaurantId = JSON.parse(localStorage.restaurant).restaurantId;

				if(!res.created) return true;
				return this.$http.patch('payment/updateStripeAccount', account, {
					headers: {Authorization: JSON.parse(localStorage.user).token}
				});

			}).then((res) => {

				if(res === true) return true;
				if(res.status == 200 || res.status == 201) {
					this.displayFlashMsg('Your details were successfully updated!', 'success');
				}

			}).catch((err) => {
				this.handleApiError(err);
			});
		},

		tokeniseBankAccount(scope, bankAcc) {
			return new Promise((resolve, reject) => {
				if(scope != 'companyBankAccount') return resolve({created: false, token: null});

				stripe.createToken('bank_account', bankAcc)
				.then((res) => {
					return resolve({
						created: true,
						token: res.token.id
					});
				}).catch((err) => {
					return reject(err);
				});
			});
		},

		buildAccountObject(tosDate='', accToken='') {
				return {
					external_account: accToken,
					tos_acceptance: {
						date: tosDate,
						ip: '' // set this on the server side: req.connection.remoteAddress
					},
					legal_entity: {
						first_name: this.defaults.comRep.firstName,
						last_name: this.defaults.comRep.lastName,
						type: 'company',
						business_name: this.defaults.restaurantName,
						business_tax_id: this.forms.companyDetails.legal_entity_business_tax_id,
						address : {
							line1: this.forms.companyDetails.legal_entity_address_line1,
							city: this.forms.companyDetails.legal_entity_address_city,
							postal_code: this.forms.companyDetails.legal_entity_address_postal_code
						},
						personal_address: {
							line1: this.forms.companyRep.legal_entity_personal_address_line1,
							city: this.forms.companyRep.legal_entity_personal_address_city,
							postal_code: this.forms.companyRep.legal_entity_personal_address_postal_code
						},
						dob: {
							day: this.forms.companyRep.legal_entity_dob_day,
							month: this.forms.companyRep.legal_entity_dob_month,
							year: this.forms.companyRep.legal_entity_dob_year
						}
					}
				}

		}

	},

	computed: {
		defaults() {
			var full = '';
			const fn = JSON.parse(localStorage.getItem('user')).firstName || '';
			const ln = JSON.parse(localStorage.getItem('user')).lastName || '';
			if(fn != '' && ln != '') { full = fn+' '+ln }
			
			return {
				restaurantName: JSON.parse(localStorage.getItem('restaurant')).name || '',
				comRep: {
					firstName: fn,
					lastName: ln,
					fullName: full
				}
			}
		}
	}
}

/**
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
	}

}

**/

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
