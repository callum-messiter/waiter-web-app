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
			        	v-model="forms.companyDetails.legal_entity_business_name"
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
			        	type="password"
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
			        	v-model="forms.companyRep.legal_entity_first_name"
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
			        	v-model="forms.companyRep.legal_entity_last_name"
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
			        	v-model="dateString"
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
			        	v-model="forms.companyBankAccount.account_holder_name"
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
			        	type="password"
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
			        	type="password"
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

import RestaurantMenu from './RestaurantMenu';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import functions from '../mixins/functions';
import underscore from 'underscore';
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
					legal_entity_type: 'company',
					legal_entity_business_name: JSON.parse(localStorage.getItem('restaurant')).name || '',
					legal_entity_address_line1: '',
					legal_entity_address_city: '',
					legal_entity_address_postal_code: '',
					legal_entity_business_tax_id: ''
				},
				companyRep: {
					tos_acceptance_date: '',
					tos_acceptance_ip: '',
					legal_entity_first_name: JSON.parse(localStorage.getItem('user')).firstName || '',
					legal_entity_last_name: JSON.parse(localStorage.getItem('user')).lastName || '',
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
					account_holder_name: JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName
				}
			},
			dateString: '',

			tosAccepted: '',
			loading: {
				still: true,
				spinnerColor: '#469ada',
				spinnerSize: '70px',
				msg: 'Loading your dashboard...'
			}
		}
	},

	created () {
		/* TODO: use loading spinner; only show the form data once the API returns the payload */
		this.getRestaurantStripeAccount();

		/* We should only show the ToS to the user  */
		if(!this.restaurantDetails.stripe.tosAccepted) {
			// TODO: show ToS
		}
	},

	methods: {

		createStripeAccount() {
			/* Submit all three forms simultaneously (one submit button) */
			/* Validate all fields */
			/* Show TOS */
			/* Build accont object */
			/* Set default values */
		},
		updateStripeAccount() {
			/* Submit a single form at once */
			/* Validate only the relevant form */
			/* Build account object */
		},

		getRestaurantStripeAccount() {
			this.$http.get('payment/stripeAccount/' + JSON.parse(localStorage.restaurant).restaurantId, {
				headers: {Authorization: JSON.parse(localStorage.user).token}
			}).then((res) => {
				this.$store.commit('setRestaurantStripeAccount', res.body);
				this.autoFillFormsWithRestaurantDetails(this.restaurantStripeAccount);
				// this.loading.still = false;
			}).catch((err) => {
				console.log(err);
				this.handleApiError(err);
			});
		},

		submit(scope) {
			/* Check if the required fields are set */
			this.validateFields(scope)
			.then(() => {
				return this.tokeniseBankAccount(scope, this.forms.companyBankAccount);
			}).then((res) => {
				var accToken, endpoint = '';

				/* The token is only set if the user has submitted the bankAccountDetails form */
				if(res.created) { accToken = res.token; }

				const account = this.buildAccountObject(accToken);
				console.log(account);
				if(_.isEmpty(account)) return true; /* Check if there is anything to sent to the API */
				
				/* If Stripe acct exists, just update details */
				if(this.isSetAndNotEmpty(this.restaurantStripeAccount.id)) {
					endpoint = 'payment/updateStripeAccount';
				} else {
					/* For now, we don't allow the user to set these details */
					account.legal_entity.le.additional_owners = '';
					account.country = 'GB';
					account.currency = 'gbp';
					account.email = JSON.parse(localStorage.user).email;
					endpoint = 'payment/createStripeAccount';
				}
				account.restaurantId = JSON.parse(localStorage.restaurant).restaurantId;
				
				return this.$http.patch(endpoint, account, {
					headers: {Authorization: JSON.parse(localStorage.user).token}
				});

			}).then((res) => {
				
				if(!res.hasOwnProperty('status')) return true;
				if(res.status == 200 || res.status == 201) {
					this.loading.still = false;
					this.displayFlashMsg('Your details were successfully updated!', 'success');
				}

			}).catch((err) => {
				console.log(err);
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

		/* lodash _.merge(dest, src) will do what we need */
		buildAccountObject(accToken='') {
			/* All the current form data */
			const cd = this.forms.companyDetails;
			const cr = this.forms.companyRep;
			const cba = this.forms.companyBankAccount;
			const stripe = this.restaurantStripeAccount;
			const acc = {};
			
			/* `tos` */
			if(isNaN(stripe.tos_acceptance.date)) {
				/* We will only show the tos if this is false */
				acc.tos_acceptance = { 
					date: Math.floor(Date.now() / 1000), 
					ip: '' /* Set by the server */
				};
			}

			/* TODO: think about how to edit the sensitive fields */
			if(this.isSetAndNotEmpty(accToken)) {
				acc.external_account = accToken;
				/* We will only store on the backend the account holder name and type */
				// acc.bankAccountHolderName = cba.account_holder_name;
				// acc.bankAccountHolderType = cba.account_holder_type;
			}

			/* `legal_entity` */
			const le = {};
			const stripe_le = stripe.legal_entity;
			if(this.isSetAndNotEmpty(cr.legal_entity_first_name)) {
				if(cr.legal_entity_first_name.trim() != stripe_le.first_name.trim()) {
					le.first_name = cr.legal_entity_first_name; /* Update the obj */
					acc.legal_entity = le; /* Set this obj as a prop of the parent obj; overwrite if already set */
				}
			}

			if(this.isSetAndNotEmpty(cr.legal_entity_last_name)) {
				if(cr.legal_entity_last_name.trim() != stripe_le.last_name.trim()) {
					le.last_name = cr.legal_entity_last_name;
					acc.legal_entity = le;
				}
			}

			if(this.isSetAndNotEmpty(cd.legal_entity_type)) {
				if(cd.legal_entity_type.trim() != stripe_le.type.trim()) {
					le.type = cd.legal_entity_type;
					acc.legal_entity = le;
				}
			}

			if(this.isSetAndNotEmpty(cd.legal_entity_business_name)) {
				if(cd.legal_entity_business_name.trim() != stripe_le.business_name.trim()) {
					le.business_name = cd.legal_entity_business_name;
					acc.legal_entity = le;
				}
			}

			/* Show a masked default string */
			if(this.isSetAndNotEmpty(cd.legal_entity_business_tax_id)) {
				if(cd.legal_entity_business_tax_id.trim() != '_cHRegNo') {
					le.business_tax_id = cd.legal_entity_business_tax_id;
					acc.legal_entity = le;
				}
			}
			
			/* `legal_entity.address` */
			var a = {};
			if(this.isSetAndNotEmpty(cd.legal_entity_address_line1)) {
				if(cd.legal_entity_address_line1.trim() != stripe_le.address.line1.trim()) {
					a.line1 = cd.legal_entity_address_line1;
					le.address = a;
					acc.legal_entity = le;
				}
			}

			if(this.isSetAndNotEmpty(cd.legal_entity_address_city)) {
				if(cd.legal_entity_address_city.trim() != stripe_le.address.city.trim()) {
					a.city = cd.legal_entity_address_city;
					le.address = a;
					acc.legal_entity = le;
				}
			}

			if(this.isSetAndNotEmpty(cd.legal_entity_address_postal_code)) {
				if(cd.legal_entity_address_postal_code.trim() != stripe_le.address.postal_code.trim()) {
					a.postal_code = cd.legal_entity_address_postal_code;
					le.address = a;
					acc.legal_entity = le;
				}
			}

			/* `legal_entity.personal_address` */
			var pa = {};
			if(this.isSetAndNotEmpty(cr.legal_entity_personal_address_line1)) {
				if(cr.legal_entity_personal_address_line1.trim() != stripe_le.personal_address.line1.trim()) {
					pa.line1 = cr.legal_entity_personal_address_line1;
					le.personal_address = pa;
					acc.legal_entity = le;
				}
			}

			if(this.isSetAndNotEmpty(cr.legal_entity_personal_address_city)) {
				if(cr.legal_entity_personal_address_city.trim() != stripe_le.personal_address.city.trim()) {
					pa.city = cr.legal_entity_personal_address_city;
					le.personal_address = pa;
					acc.legal_entity = le;
				}
			}

			if(this.isSetAndNotEmpty(cr.legal_entity_personal_address_postal_code)) {
				if(cr.legal_entity_personal_address_postal_code.trim() != stripe_le.personal_address.postal_code.trim()) {
					pa.postal_code = cr.legal_entity_personal_address_postal_code;
					le.personal_address = pa;
					acc.legal_entity = le;
				}
			}

			/* `legal_entity.dob` */
			if(this.isValidDate(this.dateString)) {
				const stripeDateString = this.generateDateString(stripe_le.dob);
				if(this.dateString != stripeDateString) {
					le.dob = this.setDob(this.dateString); /* Split datestring into day, month, year */
					acc.legal_entity = le;
				}
			}

			return acc;
		},

		autoFillFormsWithRestaurantDetails(stripe) {
			const cd = this.forms.companyDetails;
			const cr = this.forms.companyRep;
			const cba = this.forms.companyBankAccount;
			const stripe_le = stripe.legal_entity;

			cd.legal_entity_address_line1 = stripe_le.address.line1 || '';
			cd.legal_entity_address_city = stripe_le.address.city  || '';
			cd.legal_entity_address_postal_code = stripe_le.address.postal_code  || '';
			cr.legal_entity_personal_address_line1 = stripe_le.personal_address.line1  || '';
			cr.legal_entity_personal_address_city = stripe_le.personal_address.city  || '';
			cr.legal_entity_personal_address_postal_code = stripe_le.personal_address.postal_code  || '';
			cba.country = stripe.country  || '';
			cba.currency = stripe.default_currency  || '';

			/* Convert sections to datestring */
			const dob = stripe_le.dob;
			if(!isNaN(dob.year) && !isNaN(dob.month) && !isNaN(dob.day)) {
				this.dateString = this.generateDateString(dob);
			}
			
			/* If is not set, use the default value from the data props */
			if(this.isSetAndNotEmpty(stripe_le.business_name)) {
				cd.legal_entity_business_name = stripe_le.business_name;
			}
			if(this.isSetAndNotEmpty(stripe_le.first_name)) {
				cr.legal_entity_first_name = stripe_le.first_name;
			}
			if(this.isSetAndNotEmpty(stripe_le.last_name)) {
				cr.legal_entity_last_name = stripe_le.last_name;
			}
			if(stripe.external_accounts.data.length > 0) {
				cba.account_holder_name = stripe.external_accounts.data[0].account_holder_name;
				cba.account_holder_type = stripe.external_accounts.data[0].account_holder_type;
				/* These values will be masked just to indicate to the user that they have been set */
				cba.account_number = '_acctNum';
				cba.routing_number = '_routNum';
			}
			if(stripe_le.business_tax_id_provided == true) {
				cd.legal_entity_business_tax_id = '_cHRegNo';
			}
		},

		isSetAndNotEmpty(param) {
			if(param === undefined) return false;
			if(param.toString().replace(/\s+/g, '') == '') return false;
			return true;
		},

		/* Convert `{year: 1994, month: 7, day: 8}` to "1994-07-08" */
		generateDateString(dob) {
			dob.year = dob.year.toString();
			dob.month = dob.month.toString();
			dob.day = dob.day.toString();
			const vals = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
			if(vals.includes(dob.day)) {
				dob.day = '0' + dob.day;
			}
			if(vals.includes(dob.month)) {
				dob.month = '0' + dob.month;
			}
			return dob.year + '-' + dob.month + '-' + dob.day;
		},

		setDob(dateString) {
			const date = dateString.split('-'); /* e.g. ["1994", "07", "08"] */
			/* e.g. ["1994", "7", "8"] (Stripe removes the preceding zeros anyway) */
			return {
				year: Number(date[0]), 
				month: Number(date[1]), 
				day: Number(date[2])
			}
		},

		isValidDate(dateString) {
			const regEx = /^\d{4}-\d{2}-\d{2}$/;
			if(!dateString.match(regEx)) return false;  /* Invalid format */
			const d = new Date(dateString);
			if(!d.getTime() && d.getTime() !== 0) return false; /* Invalid date */
			return d.toISOString().slice(0,10) === dateString;
		},

	},

	computed: {
		restaurantStripeAccount() {
			return this.$store.getters.getRestaurantStripeAccount;
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
