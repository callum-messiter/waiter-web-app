import RestaurantMenu from '../RestaurantMenu/RestaurantMenu';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import functions from '../../mixins/functions';
import underscore from 'underscore';
import moment from 'moment';
import settings from '../../../config/settings';
const stripe = Stripe(settings.stripePubKey);

export default {
	name: 'Account',
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
			today: moment(new Date()).format('YYYY-MM-DD'),
			
			tosAccepted: '',
			
			editMode: {
				companyDetails: false,
				companyRep: false,
				companyBankAccount: false
			},

			loading: {
				main: {
					still: true,
					spinnerColor: '#469ada',
					spinnerSize: '70px',
					msg: 'Loading your settings...'
				},
				stripe: {
					companyDetails: false,
					companyRep: false,
					companyBankAccount: false,
					color: '#ffffff',
					size: '50px',
					msg: 'Updating your settings...'
				}
			}
		}
	},

	created () {
		this.getRestaurantStripeAccount();
	},

	methods: {

		getRestaurantStripeAccount() {
			this.$http.get('payment/stripeAccount/' + JSON.parse(localStorage.restaurant).restaurantId, {
				headers: {Authorization: JSON.parse(localStorage.user).token}
			}).then((res) => {
				console.log(res);
				if(res.status == 200 || res.status == 201) {
					if(!_.isEmpty(res.body)) {
						this.$store.commit('setRestaurantStripeAccount', res.body);
						this.autoFillFormsWithRestaurantDetails(this.restaurantStripeAccount);
					}
					this.loading.main.still = false;
				}
			}).catch((err) => {
				console.log(err);
				this.handleApiError(err);
			});
		},

		updateStripeAccount(scope) {
			this.validateFields(scope)
			.then(() => {
				return this.tokeniseBankAccount(scope, this.forms.companyBankAccount);
			}).then((res) => {
				/* The token is only set if the user has submitted the bankAccountDetails form */
				var accToken = '';
				if(res.created) { accToken = res.token; }
				const account = this.buildAccountObject(accToken);
				console.log(account);
				if(_.isEmpty(account)) return this.editMode[scope] = false; /* Check if there is anything to sent to the API */
				this.editMode[scope] = false;
				this.loading.stripe[scope] = true;
				account.restaurantId = JSON.parse(localStorage.restaurant).restaurantId;
				if(this.restaurantStripeAccount.id == '') {
					/* `tos` */
					if(!this.isSetAndNotEmpty(this.restaurantStripeAccount.tos_acceptance.date)) {
						account.tos_acceptance = { 
							date: Math.floor(Date.now() / 1000), 
							ip: '' /* Set by the server */
						};
					}
					/* For now, we don't allow the user to set these details */
					account.legal_entity.additional_owners = '';
					account.type = 'custom';
					account.country = 'GB';
					account.email = JSON.parse(localStorage.user).email;
					return this.$http.post('payment/stripeAccount' , account, {
						headers: {Authorization: JSON.parse(localStorage.user).token}
					});
				}

				return this.$http.patch('payment/stripeAccount', account, {
					headers: {Authorization: JSON.parse(localStorage.user).token}
				});

			}).then((res) => {
				if(!res.hasOwnProperty('status')) return true;
				if(res.status == 200 || res.status == 201) {
					this.$store.commit('setRestaurantStripeAccount', res.body);
					console.log('updated state: ' + JSON.stringify(this.restaurantStripeAccount));
					this.loading.stripe[scope] = false;
					this.displayFlashMsg('Your details were successfully updated!', 'success');
				}
			}).catch((err) => {
				console.log(err);
				this.editMode[scope] = true;
				if(err !== undefined && err.hasOwnProperty('fieldsInvalid')) {
					return this.displayFlashMsg(err.error, 'error');
				}
				this.loading.stripe[scope] = false;
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

		validateAllFields() {
			return new Promise((resolve, reject) => {
				this.$validator.validateAll()
				.then(() => {
					var response = {fieldsInvalid: false, error: null};
					if(this.errors.any()) {
						response.fieldsInvalid = true;
						response.error = this.errors.all()[0];
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

		activateEditMode(form) {
			switch(form) {
				case 'companyDetails':
					this.forms.companyDetails.legal_entity_business_tax_id = '';
					break;
				case 'companyBankAccount':
					this.forms.companyBankAccount.account_number = '';
					this.forms.companyBankAccount.routing_number = '';
					break;
				default: 
					break;
			}

			/* If any other form is currently in edit mode, cancel the edits and deactivate edit mode */
			for(var key in this.editMode) {
				if(key == form) {
					this.editMode[form] = true;
				} else {
					if(this.editMode[key]) {
						this.editMode[key] = false;
						this.discardEdits(key);
					}
				}
			}
		},

		discardEdits(form) {
			/* Reset form values to match StripeAccount state */
			this.autoFillFormsWithRestaurantDetails(this.restaurantStripeAccount);
			this.editMode[form] = false;
		},

		/* lodash _.merge(dest, src) will do what we need */
		buildAccountObject(accToken='') {
			/* All the current form data */
			const cd = this.forms.companyDetails;
			const cr = this.forms.companyRep;
			const cba = this.forms.companyBankAccount;
			const stripe = this.restaurantStripeAccount;
			const acc = {};

			/* TODO: think about how to edit the sensitive fields */
			if(this.isSetAndNotEmpty(accToken)) {
				acc.external_account = accToken;
			}

			/* `legal_entity` */
			const le = {};
			const stripe_le = stripe.legal_entity;
			if(this.paramSetAndHasChanged(cr.legal_entity_first_name, stripe_le.first_name)) {
				le.first_name = cr.legal_entity_first_name; /* Update the obj */
				acc.legal_entity = le; /* Set this obj as a prop of the parent obj; overwrite if already set */
			}

			if(this.paramSetAndHasChanged(cr.legal_entity_last_name, stripe_le.last_name)) {
				le.last_name = cr.legal_entity_last_name;
				acc.legal_entity = le;
			}

			if(this.paramSetAndHasChanged(cd.legal_entity_type, stripe_le.type)) {
				le.type = cd.legal_entity_type;
				acc.legal_entity = le;
			}

			if(this.paramSetAndHasChanged(cd.legal_entity_business_name, stripe_le.business_name)) {
				le.business_name = cd.legal_entity_business_name;
				acc.legal_entity = le;
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
			if(this.paramSetAndHasChanged(cd.legal_entity_address_line1, stripe_le.address.line1)) {
				a.line1 = cd.legal_entity_address_line1;
				le.address = a;
				acc.legal_entity = le;
			}

			if(this.paramSetAndHasChanged(cd.legal_entity_address_city, stripe_le.address.city)) {
				a.city = cd.legal_entity_address_city;
				le.address = a;
				acc.legal_entity = le;
			}

			if(this.paramSetAndHasChanged(cd.legal_entity_address_postal_code, stripe_le.address.postal_code)) {
				a.postal_code = cd.legal_entity_address_postal_code;
				le.address = a;
				acc.legal_entity = le;
			}

			/* `legal_entity.personal_address` */
			var pa = {};
			if(this.paramSetAndHasChanged(cr.legal_entity_personal_address_line1, stripe_le.personal_address.line1)) {
				pa.line1 = cr.legal_entity_personal_address_line1;
				le.personal_address = pa;
				acc.legal_entity = le;
			}

			if(this.paramSetAndHasChanged(cr.legal_entity_personal_address_city, stripe_le.personal_address.city)) {
				pa.city = cr.legal_entity_personal_address_city;
				le.personal_address = pa;
				acc.legal_entity = le;
			}

			if(this.paramSetAndHasChanged(cr.legal_entity_personal_address_postal_code, stripe_le.personal_address.postal_code)) {
				pa.postal_code = cr.legal_entity_personal_address_postal_code;
				le.personal_address = pa;
				acc.legal_entity = le;
			}

			/* `legal_entity.dob` */
			if(this.dateString != '') {
				const stripeDateString = this.generateDateString(stripe_le.dob);
				if(this.dateString != stripeDateString) {
					le.dob = this.setDob(this.dateString); /* Split datestring into day, month, year */
					acc.legal_entity = le;
				}
			}

			return acc;
		},

		/* We do this when we first retrieve the account details, but also when a user resets a form */
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

			/* If is not set, use the default value from the data props */
			const dob = stripe_le.dob;
			if(this.isSetAndNotEmpty(dob.year) && this.isSetAndNotEmpty(dob.month) && this.isSetAndNotEmpty(dob.day)) {
				this.dateString = this.generateDateString(dob);
			} else {
				this.dateString = '';
			}
			
			if(this.isSetAndNotEmpty(stripe_le.business_name)) {
				cd.legal_entity_business_name = stripe_le.business_name;
			} else {
				cd.legal_entity_business_name = JSON.parse(localStorage.getItem('restaurant')).name || '';
			}

			if(this.isSetAndNotEmpty(stripe_le.first_name)) {
				cr.legal_entity_first_name = stripe_le.first_name;
			} else {
				cd.legal_entity_first_name = JSON.parse(localStorage.getItem('user')).firstName || '';
			}

			if(this.isSetAndNotEmpty(stripe_le.last_name)) {
				cr.legal_entity_last_name = stripe_le.last_name;
			} else {
				cd.legal_entity_last_name = JSON.parse(localStorage.getItem('user')).lastName || '';
			}

			if(stripe.external_accounts.data.length > 0) {
				cba.account_holder_name = stripe.external_accounts.data[0].account_holder_name;
				cba.account_holder_type = stripe.external_accounts.data[0].account_holder_type;
				/* These values will be masked just to indicate to the user that they have been set */
				cba.account_number = '_acctNum';
				cba.routing_number = '_routNum';
			} else {
				cba.account_holder_name = JSON.parse(localStorage.getItem('user')).firstName + ' ' + 
										  JSON.parse(localStorage.getItem('user')).lastName;
				cba.account_holder_type = 'company';
				cba.account_number = '';
				cba.routing_number = '';
			}

			if(stripe_le.business_tax_id_provided == true) {
				cd.legal_entity_business_tax_id = '_cHRegNo';
			} else {
				cd.legal_entity_business_tax_id = '';
			}
		},

		isSetAndNotEmpty(param) {
			if(param === undefined) return false;
			if(param === null) return false;
			if(param.toString().replace(/\s+/g, '') == '') return false;
			return true;
		},

		paramSetAndHasChanged(formVal, stripeState) {
			if(!this.isSetAndNotEmpty(formVal)) return false;
			formVal = formVal.toString().trim();
			if(this.isSetAndNotEmpty(stripeState)) { stripeState = stripeState.toString().trim(); }
			if(formVal == stripeState) return false;
			return true;
		},

		/* Convert `{year: 1994, month: 7, day: 8}` to "1994-07-08" */
		generateDateString(dob) {
			if(!dob.hasOwnProperty('year') || !dob.hasOwnProperty('month') || !dob.hasOwnProperty('day')) {
				return '';
			}

			if(!this.isSetAndNotEmpty(dob.year) || !this.isSetAndNotEmpty(dob.month) || !this.isSetAndNotEmpty(dob.day)) {
				return '';
			}

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
		}

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