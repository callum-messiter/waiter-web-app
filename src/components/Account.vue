<template>
    <div class="container">

        <div class="loading" v-if="loading.main.still">
            <clip-loader :color="loading.main.spinnerColor" :size="loading.main.spinnerSize">
            </clip-loader>
            <p class="loadingMsg">{{loading.main.msg}}</p>
        </div>

        <div class="container" v-else>
            <div class="row">

                <div class="col-xs-6 text-left">
                    <h3 style="color: white; padding-top: 1 0px">
                        <img src="../assets/shield.png" class="header-img"> 
                        Account Details
                        <!-- Show if account is verified already
                        <img src="../assets/shield.png" class="header-img"> 
                        Account Details
                        -->
                    </h3>
                    <!-- Only show the TOS prompt if the user has not already accepted the TOS -->
                    <div class="tos" v-if="isNaN(restaurantStripeAccount.tos_acceptance.date)">
                        <p>Please fill in the details below so we can verify your restaurant and allow you to accept payments from your customers.</p>
                        <p>By saving your account details, you agree to the
                            <a href="https://stripe.com/gb/connect-account/legal" id="tosLink">
                                Stripe Connected Account Agreement.
                            </a>
                        </p>
                    </div>
                </div>

                <div class="col-xs-2 col-xs-offset-4 text-right">
                    <!-- TODO: check if account is verified -->
                    <figure v-if="restaurantStripeAccount.charges_enabled && restaurantStripeAccount.payouts_enabled">
                        <img class="switchImg" src="../assets/switch-on.png">
                        <figcaption style="color: #46ba4e">
                            {{forms.companyDetails.legal_entity_business_name}} is verified! You are ready to start accepting payments.
                        </figcaption>
                    </figure>
                    <figure v-else>
                        <img class="switchImg" src="../assets/switch-off.png">
                        <figcaption style="color: red">
                            {{forms.companyDetails.legal_entity_business_name}} is not verified and cannot accept payments.
                        </figcaption>
                    </figure>
                </div>
            </div>

            <!-- Show TOS, v-if="restaurantStripeAccount.id !== undefined" -->

            <div class="row forms">

                <div class="col-sm-4">

                    <div class="loadingStripe" v-if="loading.stripe['companyDetails']">
                        <clip-loader :color="loading.stripe.color" :size="loading.stripe.size"></clip-loader>
                        <p class="detailsLoadingMsg">{{loading.stripe.msg}}</p>
                    </div>

                    <form id="companyDetails" v-on:keyup.enter="submit('companyDetails')" data-vv-scope="companyDetails">
                        <h4 class="formTitle">Company Details <icon class="header-icon " name="info"></icon></h4>
                        <div class="input-group" v-on:dblclick="activateEditMode('companyDetails')" :class="{ faded: !editMode['companyDetails'] }">
                            <fieldset :disabled="!editMode['companyDetails']">
                                <div class="input-row">
                                    <icon name="building"></icon>
                                    <input name="legal_entity_business_name" v-model="forms.companyDetails.legal_entity_business_name" placeholder="Company Name" v-validate="{ max: 200, required: true }" data-vv-as="Company Name" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                                <div class="input-row">
                                    <icon name="map-marker-alt"></icon>
                                    <input name="legal_entity_address_line1" v-model="forms['companyDetails'].legal_entity_address_line1" placeholder="Address Line 1" v-validate="{ required: true }" data-vv-as="Address Line 1" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                                <div class="input-row">
                                    <icon name="map-marker-alt"></icon>
                                    <input name="legal_entity_address_city" v-model="forms['companyDetails'].legal_entity_address_city" placeholder="City" v-validate="{ required: true }" data-vv-as="City" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                                <div class="input-row">
                                    <icon name="map-marker-alt"></icon>
                                    <!-- Dropdown list with country codes -->
                                    <input name="legal_entity_address_postal_code" v-model="forms['companyDetails'].legal_entity_address_postal_code" placeholder="Postcode" v-validate="{ required: true }" data-vv-as="Postcode" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                                <div class="input-row">
                                    <icon name="money-bill-alt"></icon>
                                    <input name="legal_entity_business_tax_id" type="password" v-model="forms['companyDetails'].legal_entity_business_tax_id" placeholder="Companies House Reg Number" v-validate="{ max: 200, required: true }" data-vv-as="Companies House Reg Number" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                            </fieldset>
                        </div>

                        <button type="button" v-on:click="activateEditMode('companyDetails')" v-if="!editMode['companyDetails']">
                            Edit
                        </button>
                        <div class="row editModeBtns" v-else>
                            <div class="col-xs-6 btnColLeft">
                                <button class="editModeBtn saveBtn" type="button" v-on:click="submit('companyDetails')">
                                    Save
                                </button>
                            </div>
                            <div class="col-xs-6 btnColRight">
                                <button class="editModeBtn cancelBtn" type="button" v-on:click="discardEdits('companyDetails')">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="col-sm-4">

                    <div class="loadingStripe" v-if="loading.stripe['companyRep']">
                        <clip-loader :color="loading.stripe.color" :size="loading.stripe.size"></clip-loader>
                        <p class="detailsLoadingMsg">{{loading.stripe.msg}}</p>
                    </div>

                    <form id="companyRep" v-on:keyup.enter="submit('companyRep')" data-vv-scope="companyRep">
                        <h4 class="formTitle">Company Representative <icon class="header-icon" name="user"></icon></h4>
                        <div class="input-group" v-on:dblclick="activateEditMode('companyRep')" :class="{ faded: !editMode['companyRep'] }">
                            <fieldset :disabled="!editMode['companyRep']">
                                <div class="input-row">
                                    <icon name="user"></icon>
                                    <input name="legal_entity_first_name" v-model="forms.companyRep.legal_entity_first_name" placeholder="First Name" v-validate="{ max: 100, required: true }" data-vv-as="First Name" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                                <div class="input-row">
                                    <icon name="user"></icon>
                                    <input name="legal_entity_last_name" v-model="forms.companyRep.legal_entity_last_name" placeholder="Last Name" v-validate="{ max: 100, required: true }" data-vv-as="Last Name" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                                <!-- v-model="forms['companyRep'].legal_entity_dob_month" -->
                                <div class="input-row">
                                    <icon name="calendar"></icon>
                                    <input type="text" name="dob" placeholder="Date of Birth" onfocus="(this.type='date')" onblur="(this.type='text')" v-model="dateString" v-validate="{ required: true, date_format: 'YYYY-MM-DD', before: today }" data-vv-as="Date of Birth" />
                                </div>
                                <!-- <span class="requiredMarker">*</span> -->
                                <div class="input-row">
                                    <icon name="address-book"></icon>
                                    <input name="legal_entity_personal_address_line1" v-model="forms['companyRep'].legal_entity_personal_address_line1" placeholder="Line 1" v-validate="{ required: true }" data-vv-as="Personal Address (Line 1)" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                                <div class="input-row">
                                    <icon name="address-book"></icon>
                                    <input name="legal_entity_personal_address_city" v-model="forms['companyRep'].legal_entity_personal_address_city" placeholder="City" v-validate="{ required: true }" data-vv-as="Personal Address (City)" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                                <div class="input-row">
                                    <icon name="address-book"></icon>
                                    <!-- Dropdown list with country codes -->
                                    <input name="legal_entity_personal_address_postal_code" v-model="forms['companyRep'].legal_entity_personal_address_postal_code" placeholder="Postcode" v-validate="{ required: true }" data-vv-as="Personal Address (Postcode)" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                            </fieldset>
                        </div>

                        <button type="button" v-on:click="activateEditMode('companyRep')" v-if="!editMode['companyRep']">
                            Edit
                        </button>
                        <div class="row editModeBtns" v-else>
                            <div class="col-xs-6 btnColLeft">
                                <button class="editModeBtn saveBtn" type="button" v-on:click="submit('companyRep')">
                                    Save
                                </button>
                            </div>
                            <div class="col-xs-6 btnColRight">
                                <button class="editModeBtn cancelBtn" type="button" v-on:click="discardEdits('companyRep')">
                                    Cancel
                                </button>
                            </div>
                        </div>

                    </form>
                </div>

                <div class="col-sm-4">

                    <div class="loadingStripe" v-if="loading.stripe['companyBankAccount']">
                        <clip-loader :color="loading.stripe.color" :size="loading.stripe.size"></clip-loader>
                        <p class="detailsLoadingMsg">{{loading.stripe.msg}}</p>
                    </div>

                    <form id="companyBankAccount" v-on:keyup.enter="submit('companyBankAccount')" data-vv-scope="companyBankAccount">
                        <h4 class="formTitle">Company Bank Account <icon class="header-icon" name="credit-card"></icon></h4>
                        <div class="input-group" v-on:dblclick="activateEditMode('companyBankAccount')" :class="{ faded: !editMode['companyBankAccount'] }">
                            <fieldset :disabled="!editMode['companyBankAccount']">
                                <div class="input-row">
                                    <icon name="user"></icon>
                                    <input name="account_holder_name" v-model="forms.companyBankAccount.account_holder_name" placeholder="Account Holder Name" v-validate="{ max: 205, required: true }" data-vv-as="Account Holder Name" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                                <div class="input-row">
                                    <icon name="credit-card"></icon>
                                    <input name="account_number" type="password" v-model="forms['companyBankAccount'].account_number" placeholder="Account Number" v-validate="{ numeric: true, required: true }" data-vv-as="Account Number" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                                <div class="input-row">
                                    <icon name="credit-card"></icon>
                                    <input name="routing_number" type="password" v-model="forms['companyBankAccount'].routing_number" placeholder="Sort Code" v-validate="{ numeric: true, required: true }" data-vv-as="Sort Code" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                                <div class="input-row">
                                    <icon name="globe"></icon>
                                    <!-- Dropdown list with country codes -->
                                    <input readonly name="country" v-model="forms['companyBankAccount'].country" placeholder="Country" v-validate="{ required: true }" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                                <div class="input-row">
                                    <icon name="pound-sign"></icon>
                                    <!-- Dropdown list with country codes -->
                                    <input readonly name="currency" v-model="forms['companyBankAccount'].currency" placeholder="Currency" v-validate="{ required: true }" />
                                    <!-- <span class="requiredMarker">*</span> -->
                                </div>
                            </fieldset>
                        </div>

                        <button type="button" v-on:click="activateEditMode('companyBankAccount')" v-if="!editMode['companyBankAccount']">
                            Edit
                        </button>
                        <div class="row editModeBtns" v-else>
                            <div class="col-xs-6 btnColLeft">
                                <button class="editModeBtn saveBtn" type="button" v-on:click="submit('companyBankAccount')">
                                    Save
                                </button>
                            </div>
                            <div class="col-xs-6 btnColRight">
                                <button class="editModeBtn cancelBtn" type="button" v-on:click="discardEdits('companyBankAccount')">
                                    Cancel
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
                <button type="button" v-on:click="submit('')" v-if="restaurantStripeAccount.id === undefined">
                    Save All
                </button>
            </div>
        </div>
    </div>
</template>

<script>

import RestaurantMenu from './RestaurantMenu';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import functions from '../mixins/functions';
import underscore from 'underscore';
import moment from 'moment';
import settings from '../../config/settings';
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
                    this.$store.commit('setRestaurantStripeAccount', res.body);
                    this.autoFillFormsWithRestaurantDetails(this.restaurantStripeAccount);
                    this.loading.main.still = false;
                }
            }).catch((err) => {
                this.handleApiError(err);
            });
        },

        createStripeAccount() {
            /* Submit all three forms simultaneously (one submit button) */
            this.validateAllFields()
            .then(() => {
                return this.tokeniseBankAccount('companyBankAccount', this.forms.companyBankAccount);
            }).then(() => {
                if(!res.created) {
                    throw 'There was an error saving your bank account details. Please check your details and try again.'
                }
                const account = this.buildAccountObject(res.token);
                if(_.isEmpty(account)) throw 'There was an error saving your details. Please try again.';
                /* For now, we don't allow the user to set these details */
                account.legal_entity.le.additional_owners = '';
                account.country = 'GB';
                account.currency = 'gbp';
                account.email = JSON.parse(localStorage.user).email;
                account.restaurantId = JSON.parse(localStorage.restaurant).restaurantId;
                
                return this.$http.post('payment/stripeAccount' , account, {
                    headers: {Authorization: JSON.parse(localStorage.user).token}
                });
            }).then((res) => {
                if(!res.hasOwnProperty('status')) return true;
                if(res.status == 200 || res.status == 201) {
                    this.$store.commit('setRestaurantStripeAccount', res.body);
                    this.displayFlashMsg('Your details were successfully updated!', 'success');
                }
            }).catch((err) => {
                if(err !== undefined && err.hasOwnProperty('fieldsInvalid')) {
                    return this.displayFlashMsg(err.error, 'error');
                }
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
                if(_.isEmpty(account)) return this.editMode[scope] = false; /* Check if there is anything to sent to the API */
                this.editMode[scope] = false;
                account.restaurantId = JSON.parse(localStorage.restaurant).restaurantId;
                this.loading.stripe[scope] = true;
                return this.$http.patch('payment/stripeAccount', account, {
                    headers: {Authorization: JSON.parse(localStorage.user).token}
                });

            }).then((res) => {
                if(!res.hasOwnProperty('status')) return true;
                if(res.status == 200 || res.status == 201) {
                    this.$store.commit('setRestaurantStripeAccount', res.body);
                    this.loading.stripe[scope] = false;
                    this.displayFlashMsg('Your details were successfully updated!', 'success');
                }
            }).catch((err) => {
                if(err !== undefined && err.hasOwnProperty('fieldsInvalid')) {
                    return this.displayFlashMsg(err.error, 'error');
                }
                this.loading.stripe[scope] = false;
                this.handleApiError(err);
            });
        },

        submit(scope='') {
            if(this.restaurantStripeAccount.id === undefined) {
                return this.createStripeAccount();
            } else {
                return this.updateStripeAccount(scope);
            }
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
            /*
                We autofill the forms with the details in the Stripe accout object returned by Stripe.
                But for the sensitive fields below, Stripe does not return them - only (implicitly or explicitly) 
                whether or not they are set.

                So in order to indicate to the user that they have already set these details, we need to set
                default values and mask them (so it looks like their, e.g., bank account number is written in the form).

                This means that when the user starts editing a form with a sensitive field, we need to set the value to an 
                empty string. Otherwise, if they click edit, and then click save without changing anything, Stripe will
                throw an error, because the value is our (invalid) placeholder one and not a real bank account number.
            */
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
            
            /* `tos` */
            if(isNaN(stripe.tos_acceptance.date)) {
                acc.tos_acceptance = { 
                    date: Math.floor(Date.now() / 1000), 
                    ip: '' /* Set by the server */
                };
            }

            /* TODO: think about how to edit the sensitive fields */
            if(this.isSetAndNotEmpty(accToken)) {
                acc.external_account = accToken;
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
            const stripeDateString = this.generateDateString(stripe_le.dob);
            if(this.dateString != stripeDateString) {
                le.dob = this.setDob(this.dateString); /* Split datestring into day, month, year */
                acc.legal_entity = le;
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
            if(!isNaN(dob.year) && !isNaN(dob.month) && !isNaN(dob.day)) {
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

.switchImg {
  height: 100px;
  width: auto;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
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
  background-color: white !important;
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
  background-color: white !important;
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

.loadingStripe {
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%);
}

.loadingMsg {
    font-size: 16px;
    color: #469ada;
}

.detailsLoadingMsg {
    font-size: 14px;
    color: white;
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
    color: #8bd9ed;
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

.tos {
    color: white;
    padding-bottom: 25px;
}

#tosLink {
    color: #8bd9ed;
}

.forms {
    margin-top: 30px;
}

.faded {
    opacity: 0.2;
}

.row.editModeBtns {
    width: 100%;
    margin: 0 !important;
}

.editModeBtn {
    width: 100%;
}

.col-xs-6.btnCol {
    padding:  !important;
}

.col-xs-6.btnColLeft {
    padding-left: 0;
    padding-right: 5px;
}

.col-xs-6.btnColRight {
    padding-right: 0;
    padding-left: 5px;
}

.cancelBtn {
    background-color: red;
    border: 1px solid red;
}

.btn:focus,.btn:active:focus,.btn.active:focus,
.btn.focus,.btn:active.focus,.btn.active.focus {
    outline: none;
}

</style>
