<template>
	<div class="container">

		<div class="row">
			
			<div class="col-xs-12 text-left">
				<h3 style="color: white">
					<img src="../assets/shield.png" class="header-img"> 
					Account Verification
				</h3>
			</div>
		</div>

	  <div class="row">

		  <div class="col-sm-4">
				<form id="companyDetails" v-on:keyup.enter="submit('companyDetails')" data-vv-scope="companyDetails">
					<h4 class="formTitle">Company Details <icon class="header-icon " name="info"></icon></h4>
			    <div class="input-group">
			      <div class="input-row">
			        <icon name="building"></icon>
			        <input 
			        	name="legal_entity_business_name" 
			        	v-model="defaults.restaurantName"
			        	placeholder="Company Name"
			        	v-validate="{ max: 200, required: true }"
			        	data-vv-as="Company Name"
			        />	
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			      <div class="input-row">
			        <icon name="map-marker-alt"></icon>
			        <input 
			        	name="legal_entity_address_line1"
			        	v-model="forms['companyDetails'].legal_entity_address_line1"
			        	placeholder="Address Line 1"
			        	v-validate="{ required: true }"
			        	data-vv-as="Address Line 1"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			      <div class="input-row">
			        <icon name="map-marker-alt"></icon>
			        <input 
			        	name="legal_entity_address_city"
			        	v-model="forms['companyDetails'].legal_entity_address_city" 
			        	placeholder="City"
			        	v-validate="{ required: true }"
			        	data-vv-as="City"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			      <div class="input-row">
			        <icon name="map-marker-alt"></icon>
			        <!-- Dropdown list with country codes -->
			        <input 
			        	name="legal_entity_address_postal_code"
			        	v-model="forms['companyDetails'].legal_entity_address_postal_code" 
			        	placeholder="Postcode"
			        	v-validate="{ required: true }"
			        	data-vv-as="Postcode"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			      <div class="input-row">
			        <icon name="money-bill-alt"></icon>
			        <input 
			        	name="legal_entity_business_tax_id"
			        	v-model="forms['companyDetails'].legal_entity_business_tax_id"
			        	placeholder="Companies House Reg Number"
			        	v-validate="{ max: 200, required: true }"
			        	data-vv-as="Companies House Reg Number"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			    </div>
			    
			    <button type="button" v-on:click="submit('companyDetails')">Update</button>
			  </form>
			</div>

			<div class="col-sm-4">
				<form id="companyRep" v-on:keyup.enter="submit('companyRep')" data-vv-scope="companyRep">
					<h4 class="formTitle">Company Representative <icon class="header-icon" name="user"></icon></h4>
			    <div class="input-group">
			      <div class="input-row">
			        <icon name="user"></icon>
			        <input 
			        	name="legal_entity_first_name"
			        	v-model="defaults.comRep.firstName"
			        	placeholder="First Name"
			        	v-validate="{ max: 100, required: true }"
			        	data-vv-as="First Name"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			      <div class="input-row">
			        <icon name="user"></icon>
			        <input 
			        	name="legal_entity_last_name"
			        	v-model="defaults.comRep.lastName"
			        	placeholder="Last Name"
			        	v-validate="{ max: 100, required: true }"
			        	data-vv-as="Last Name"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			      <!-- v-model="forms['companyRep'].legal_entity_dob_month" -->
			      <div class="input-row">
			        <icon name="calendar"></icon>
			        <input 
			        	type="text" 
			        	placeholder="Date of Birth"
			        	onfocus="(this.type='date')" 
			        	onblur="(this.type='text')"
			        	v-model="malformedDob"
			        	v-validate="{ required: true }"
			        	data-vv-as="Date of Birth"
			        />
			      </div>
			        <!-- <span class="requiredMarker">*</span> -->
			      <div class="input-row">
			        <icon name="address-book"></icon>
			        <input 
			        	name="legal_entity_personal_address_line1"
			        	v-model="forms['companyRep'].legal_entity_personal_address_line1" 
			        	placeholder="Line 1"
			        	v-validate="{ required: true }"
			        	data-vv-as="Personal Address (Line 1)"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			      <div class="input-row">
			        <icon name="address-book"></icon>
			        <input 
			        	name="legal_entity_personal_address_city"
			        	v-model="forms['companyRep'].legal_entity_personal_address_city" 
			        	placeholder="City"
			        	v-validate="{ required: true }"
			        	data-vv-as="Personal Address (City)"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			      <div class="input-row">
			        <icon name="address-book"></icon>
			        <!-- Dropdown list with country codes -->
			        <input 
			        	name="legal_entity_personal_address_postal_code"
			        	v-model="forms['companyRep'].legal_entity_personal_address_postal_code" 
			        	placeholder="Postcode"
			        	v-validate="{ required: true }"
			        	data-vv-as="Personal Address (Postcode)"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			    </div>
			    
			    <button type="button" v-on:click="submit('companyRep')">Update</button>
			  </form>
			</div>

			<div class="col-sm-4">
				<form id="companyBankAccount" v-on:keyup.enter="submit('companyBankAccount')" data-vv-scope="companyBankAccount">
					<h4 class="formTitle">Company Bank Account <icon class="header-icon" name="credit-card"></icon></h4>
			    <div class="input-group">
			      <div class="input-row">
			        <icon name="user"></icon>
			        <input 
			        	name="account_holder_name" 
			        	v-model="defaults.comRep.fullName"
			        	placeholder="Account Holder Name"
			        	v-validate="{ max: 205, required: true }"
			        	data-vv-as="Account Holder Name"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			      <div class="input-row">
			        <icon name="credit-card"></icon>
			        <input 
			        	name="account_number"
			        	v-model="forms['companyBankAccount'].account_number"
			        	placeholder="Account Number"
			        	v-validate="{ numeric: true, required: true }"
			        	data-vv-as="Account Number"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			      <div class="input-row">
			        <icon name="credit-card"></icon>
			        <input 
			        	name="routing_number"
			        	v-model="forms['companyBankAccount'].routing_number"
			        	placeholder="Sort Code"
			        	v-validate="{ numeric: true, required: true }"
			        	data-vv-as="Sort Code"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			      <div class="input-row">
			        <icon name="globe"></icon>
			        <!-- Dropdown list with country codes -->
			        <input
			        	readonly 
			        	name="country"
			        	v-model="forms['companyBankAccount'].country"
			        	placeholder="Country"
			        	v-validate="{ required: true }"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			      <div class="input-row">
			        <icon name="pound-sign"></icon>
			        <!-- Dropdown list with country codes -->
			        <input 
			        	readonly
			        	name="currency"
			        	v-model="forms['companyBankAccount'].currency"
			        	placeholder="Currency"
			        	v-validate="{ required: true }"
			        />
			        <!-- <span class="requiredMarker">*</span> -->
			      </div>
			    </div>
			    
			    <button type="button" v-on:click="submit('companyBankAccount')">Update</button>
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
					country: 'GB',
					currency: 'gbp',
					routing_number: '', // sort code
					account_number: '',
					account_holder_type: 'company',
				}
			},
			malformedDob: '',

			loading: {
				still: true,
				spinnerColor: '#469ada',
				spinnerSize: '70px',
				msg: 'Loading your dashboard...'
			}
		}
	},

	created () {
		this.getRestaurantDetailsFromBackend();
	},

	methods: {

		getRestaurantDetailsFromBackend() {
			this.$http.get('restaurant/' + JSON.parse(localStorage.restaurant).restaurantId, {
				headers: {Authorization: JSON.parse(localStorage.user).token}
			}).then((res) => {
				/* Set state */
				/* Hide loading spinner */
				// this.loading.still = false;
				console.log(res);
			}).catch((err) => {
				this.handleApiError(err);
			});
		},

		submit(scope) {
			/* If the user clicks "Accept" to TOS, set the date and IP (we will only show the TOS once) */
			const tosDate = Math.floor(Date.now() / 1000);
			var accToken = '';

			/* Check if the required fields are set */
			this.validateFields(scope)
			.then(() => {
				return this.tokeniseBankAccount(scope, this.forms.companyBankAccount);
			}).then((res) => {

				if(res.created) { accToken = res.token; }

				var dob = {};
				if(this.malformedDob != "") {
					if(!this.isValidDate(this.malformedDob)) {
						throw {fieldsInvalid: true, error: 'Please provide a valid date of birth.'};
					}
					dob = this.setDob(this.malformedDob); /* Split date into its three component */
				}

				const account = this.buildAccountObject(tosDate, accToken, dob);
				account.restaurantId = JSON.parse(localStorage.restaurant).restaurantId;
				return this.$http.patch('payment/updateStripeAccount', account, {
					headers: {Authorization: JSON.parse(localStorage.user).token}
				});

			}).then((res) => {

				if(res.status == 200 || res.status == 201) {
					this.loading.still = false;
					this.displayFlashMsg('Your details were successfully updated!', 'success');
				}

			}).catch((err) => {

				if(err !== undefined && err.hasOwnProperty('fieldsInvalid')) {
					return this.displayFlashMsg(err.error, 'error');
				}
				this.loading.still = false;
				this.handleApiError(err);
			
			});
		},

		validateFields(scope) {
			return new Promise((resolve, reject) => {
				this.$validator.validateAll(scope)
				.then(() => {

					var response = {fieldsInvalid: false, error: null};
					if(this.errors.any(scope)) {
						response.fieldsInvalid = true;
						response.error = this.errors.all(scope)[0];
						return reject(response);
					}
					return resolve(response);

				}).catch((err) => {
					return reject(err);
				});
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

		setDob(malformedDob) {
			const date = malformedDob.split('-'); /* e.g. ["1994", "07", "08"] */
			return {
				year: date[0], 
				month: date[1], 
				day: date[2]
			}
		},

		isValidDate(dateString) {
			const regEx = /^\d{4}-\d{2}-\d{2}$/;
			if(!dateString.match(regEx)) return false;  /* Invalid format */
			const d = new Date(dateString);
			if(!d.getTime() && d.getTime() !== 0) return false; /* Invalid date */
			return d.toISOString().slice(0,10) === dateString;
		},

		buildAccountObject(tosDate='', accToken='', dob) {
			return {
				external_account: accToken,
				tos_acceptance: {
					date: tosDate,
					ip: '' /* Set this on the server side: req.connection.remoteAddress */
				},
				legal_entity: {
					first_name: this.defaults.comRep.firstName,
					last_name: this.defaults.comRep.lastName,
					type: 'company',
					business_name: this.defaults.restaurantName,
					business_tax_id: this.forms.companyDetails.legal_entity_business_tax_id,
					additional_owners: '', /* Later, we may provide an option for user to provide this info */
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
						day: dob.day || this.forms.companyRep.legal_entity_dob_day,
						month: dob.month || this.forms.companyRep.legal_entity_dob_month,
						year: dob.year || this.forms.companyRep.legal_entity_dob_year
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
  font-size: 16px;
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

.formTitle {
	float: left;
}

.header-icon {
	color: #8bd9ed ;
}

.requiredMarker {
	font-size: 25px;
	color: red;
}

input[type=date]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
}

::-webkit-clear-button
{
    display: none; /* Hide the button */
    -webkit-appearance: none; /* turn off default browser styling */
}

input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px white inset;
}

</style>
