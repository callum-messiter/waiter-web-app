<template>
  <transition name="modalForm" v-if="modal.isVisible">
   <div class="modal" style="display: block" v-on:keydown.esc="closeModal(modal.name)">
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <div class="row">
            <span
              class="glyphicon glyphicon-remove pull-right"
              v-on:click="closeModal(modal.name)"
            ></span>
          </div>
          <!-- E.g. "Add a new item to {categoryName}" -->
          <div class="row">
            <h4 class="modal-title">{{modal.title}}</h4>
          </div>
        </div>

        <!--
            **The contents of the modal body vary depending on the particular action being performed by the user.**
        -->

        <div class="modal-body">
          <!--
            Add-Item form
          -->
          <form id="addItem" v-if="modal.name == 'item_add'">
            <div class="row">
              <div class="col-xs-6">
                <!-- Item name -->
                <input
                  :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('itemName') }"
                  name="itemName"
                  type="text"
                  placeholder="Item name"
                  v-model="form.item.name"
                  v-validate="{required: true, max: 100}"
                  data-vv-as="item name"
                />
                <span
                  class="help is-danger"
                  v-show="errors.has('itemName')">
                  <br>
                  {{ errors.first('itemName') }}
                </span>
              </div>
              <div class="col-xs-6">
                <!-- Item price -->
                <money
                  :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('itemPrice') }"
                  name="itemPrice"
                  v-model ="form.item.price"
                  v-bind="money"
                  v-validate="{required: true}"
                  data-vv-as="item price">
                </money>
                <span
                  class="help is-danger"
                  v-show="errors.has('itemPrice')">
                  {{ errors.first('itemPrice') }}
                </span>
              </div>
              <div class="col-xs-12">
                <!-- Item Description -->
                <input
                  :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('itemDescription') }"
                  name="itemDescription"
                  type="text"
                  placeholder="Item description"
                  v-model="form.item.description"
                  v-validate="{required: true, max: 200}"
                  data-vv-as="item description"
                />
                <br>
                <span
                  class="help is-danger"
                  v-show="errors.has('itemDescription')">
                  {{ errors.first('itemDescription') }}
                </span>
              </div>
            </div>
            <div class="row">
              <!-- Save Item Button -->
              <button
                type="button"
                class="btn btn-primary"
                v-on:click="sendAddNewEvent()">
                {{modal.buttons.primary}}
              </button>
            </div>
          </form>

          <!--
            Edit-Item form
          -->
          <form id="editItem" v-if="modal.name == 'item_edit'">
            <div class="row">
              <div class="col-xs-6">
                <!-- Item name -->
                <input
                  :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('itemName') }"
                  name="itemName"
                  type="text"
                  placeholder="Item name"
                  v-model="form.item.name"
                  v-validate="{required: true, max: 100}"
                  data-vv-as="item name"
                />
                <span
                  class="help is-danger"
                  v-show="errors.has('itemName')">
                  {{ errors.first('itemName') }}
                </span>
              </div>
              <div class="col-xs-6">
                <!-- Item price -->
                <money
                  :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('itemPrice') }"
                  name="itemPrice"
                  placeholder="Item price"
                  v-model="form.item.price"
                  v-bind="money"
                  v-validate="{required: true, max: 4}"
                  data-vv-as="item price">
                </money>
                <span
                  class="help is-danger"
                  v-show="errors.has('itemPrice')">
                  {{ errors.first('itemPrice') }}
                </span>
              </div>
              <div class="col-xs-12">
                <!-- Item Description -->
                <input
                  :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('itemDescription') }"
                  name="itemDescription"
                  type="text"
                  placeholder="Item description"
                  v-model="form.item.description"
                  v-validate="{required: true, max: 500}"
                  data-vv-as="item description"
                />
                <span
                  class="help is-danger"
                  v-show="errors.has('itemDescription')">
                  {{ errors.first('itemDescription') }}
                </span>
              </div>
            </div>
            <!-- Save Item Button -->
            <div class="row">
              <button
                type="button"
                class="btn btn-primary"
                v-on:click="sendUpdateEvent()">
                {{modal.buttons.primary}}
              </button>
              <button
                type="button"
                class="btn btn-primary delete-button"
                v-on:click="sendDeleteEvent()">
                {{modal.buttons.warning}}
              </button>
            </div>
          </form>

          <!--
            Add-Category form
          -->
          <form 
            id="addCategory" 
            v-if="modal.name == 'category_add'" 
            v-on:keyup.enter="sendAddNewEvent()"
          >
          <!-- Category name -->
            <div class="row">
              <div class="col-xs-9">
                <input
                  :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('categoryName') }"
                  name="categoryName"
                  type="text"
                  placeholder="Category name"
                  v-model="form.category.name"
                  v-validate="{required: true, max: 30}"
                  data-vv-as="category name"
                />
              </div>
              <div class="col-xs-3">
                <!-- Save Category Button -->
                <button
                  type="button"
                  class="btn btn-primary"
                  v-on:click="sendAddNewEvent()">
                  {{modal.buttons.primary}}
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-9">
                <span
                  class="help is-danger"
                  v-show="errors.has('categoryName')">
                  {{ errors.first('categoryName') }}
                </span>
              </div>
            </div>
          </form>

          <!--
            Edit-Category form
          -->
          <form id="editCategory" v-if="modal.name == 'category_edit'">
          <!-- Category name -->
            <div class="row">
              <div class="col-xs-8 col-xs-offset-2">
                <input
                  :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('categoryName') }"
                  name="categoryName"
                  type="text"
                  placeholder="Category name"
                  v-model="form.category.name"
                  v-validate="{required: true, max: 30}"
                  data-vv-as="category name"
                />
                <span
                  class="help is-danger"
                  v-show="errors.has('categoryName')">
                  {{ errors.first('categoryName') }}
                </span>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-10 col-xs-offset-1">
                <!-- Save Category Button -->
                <button
                  type="button"
                  class="btn btn-primary"
                  v-on:click="sendUpdateEvent()">
                  {{modal.buttons.primary}}
                </button>
                <button
                  type="button"
                  class="btn btn-primary delete-button"
                  v-on:click="sendDeleteEvent()">
                  {{modal.buttons.warning}}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>

import {Money} from 'v-money';
import lodash from 'lodash';

import { bus } from '../main';

import config from '../../config/config';

export default {
  name: 'ModalForm',
  components: {Money},

  data () {
    return {
      modal: {
        name: null,
        isVisible: false,
        title: null,
        trigger: {},
        buttons: {},
        data: {}
      },
      form: {
        item: {
          name: '',
          price: '',
          description: ''
        },
        category: {
          name: ''
        }
      },
      event: {
        add: 'userConfirmation_addNew',
        update: 'userConfirmation_update',
        delete: 'userConfirmation_delete'
      }
    }
  },

  /**
    We use the event bus to communicate between other components and this modal component. This means that we don't need to repeat the modal HTML/CSS markup in every component which triggers the modal to be displayed.

    First, the trigger component emits and event to this modal component, which renders the modal with the data passed to it, making it visible to the user.

    Then, when one of the actional modal buttons is clicked (e.g. Add new category), this modal, via the below method, emits and event back to the target component. The target component will be listening to the relevant event, and upon receiving it, will execute the necessary logic (e.g. by calling the addCategory method.)
  **/
  created () {
    bus.$on('showModalForm', (modal) => {
      // The modal data (title, msg, etc.) is sent by the trigger component in the event. Here we set it and render it to the DOM
      Object.assign(this.modal, modal);

      // For editing data, we should prefill the form with the current data (which is also sent in the event)
      const modalName = this.modal.name;
      if(modalName.indexOf('edit') !== -1) {
        const formName = modalName.substr(0, modalName.indexOf('_')); // e.g. 'item_edit' -> 'item'
        // Check that the modalName contains a valid form name (e.g. 'item', 'category')
        if(!this.form.hasOwnProperty(formName)) {
          console.log('Invalid modal name: ' + modalName);
        } else {
          Object.assign(this.form[formName], modal.data);
        }
      }
    });
  },

  computed: {
    money() {
      return config.money;
    }
  },

  methods: {
    /**
      Add some new data object to the database (e.g. an item or category). This method will send an event,
      containing the new data, to the original component, which will execute the API call
    **/
    sendAddNewEvent() {
      // Determine which form is active
      const formName = this.modal.name.substr(0, this.modal.name.indexOf('_')); // e.g. 'item_edit' => 'item'
      var fields = this.form[formName];
      var allFieldsFilled = true;
      Object.keys(fields).forEach((key) => {
        if(fields[key].toString().trim() === "") { allFieldsFilled = false; }
      });

      // Only send the event if there are no form errors, and no empty fields
      if(!this.errors.any() && allFieldsFilled === true) {
        const eventName = this.event.add + this.capitalise(formName);
        const data = this.form[formName];
        console.log('EventName: ' + eventName);
        bus.$emit(eventName, data, this.modal.trigger);
        this.modal.isVisible = false;
        this.resetFormData(this.modal.name);
      }
    },

    /**
      Update some data in the database (e.g. an item or category). This method will send an event,
      containing the new data, to the original component, which will execute the API call
    **/
    sendUpdateEvent() {
      const formName = this.modal.name.substr(0, this.modal.name.indexOf('_')); // e.g. 'item_edit' => 'item'
      // Only emit the event (which will trigger the API call) if the user has made changes
      if(!_.isEqual(this.form[formName], this.modal.data)) {
        // TODO: this is complicated, can't we organise the data in the trigger component?
        if(formName == 'item') {
          this.form.item.itemId = this.modal.trigger.itemId;
        }
        const eventName = this.event.update + this.capitalise(formName);
        bus.$emit(eventName, this.form[formName], this.modal.trigger);
      }
      // In any case, hide the modal and reset the form
      this.closeModal(this.modal.name);
    },

    /**
      Delete some data from the database (e.g. an item or category). This method will send an event,
      containing the data reference point (e.g. an item or category ID), to the original component, 
      which will execute the API call
    **/
    sendDeleteEvent() {
      const formName = this.modal.name.substr(0, this.modal.name.indexOf('_')); // e.g. 'item_edit' => 'item'
      const eventName = this.event.delete + this.capitalise(formName);
      bus.$emit(eventName, this.modal.trigger);
      this.modal.isVisible = false;
      this.resetFormData(this.modal.name); // The delete button is accessed by the respective edit form (so clear it!)
    },

    /**
      This code is implicit in the above action functions, but this method is required since it is called directly
      when the user clicks the "x" icon
    **/
    closeModal(modalName) {
      this.modal.isVisible = false;
      this.resetFormData(modalName);
    },

    /**
      Whenever the user selects to close the modal, we should reset whichever form was active
    **/
    resetFormData(modalName) {
      // Determine which form is active
      const formName = modalName.substr(0, modalName.indexOf('_')); // e.g. 'item_edit' => 'item'
      // Then set all properties of the form object to an empty string
      var obj = this.form[formName];
      Object.keys(obj).forEach((key) => {
        obj[key] = '';
      });
    },

    capitalise(string) {
      return string[0].toUpperCase() + string.slice(1);
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @font-face {
    font-family: 'grotesque';
    src: url("../fonts/grotesque.otf");
  }

  .modal-dialog {
    padding-top: 10%;
    font-family: 'grotesque';
  }

  .modal-body {
    padding-top: 5px;
  }

  .modal-content {
    border: 3px solid #469ada;
    border-radius: 3px;
    background-color: #151515;
    color: #fff;
    padding: 10px;
  }

  .modal-title {
    font-size: 1.6em;
    margin-top: 15px;
  }

  .modal-header {
    padding-top: 0;
    border-bottom: none;
  }

  .glyphicon {
    color: #9e9e9e;
  }

  input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 3px solid #fff;
    height: 40px;
    margin-top: 8px;
    color: #656565;
  }

  input:focus {
    outline: none;
    border-bottom: 3px solid #469ada;
    color: #469ada;
  }

  ::-webkit-input-placeholder {
    color: #656565;
    text-align: left;
  }
  ::-moz-placeholder {
    color: #656565;
  }
  :-ms-input-placeholder {
    color: #656565;
  }
  :-moz-placeholder {
    color: #656565;
  }

  .v-money.input.pass {
    color: #656565;
  }

  .v-money.input.pass:focus {
    color: #469ada;
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

  span {
    padding-top: 5px;
    padding-right: 5px;
    cursor: pointer;
  }

  button {
    margin-top: 20px;
    color: #fff;
    background-color: #469ada;
    border: 2px solid #469ada;
    border-radius: 3px;
  }

  .delete-button {
    background-color: #0a0a0a;
    border: 2px solid #469ada;
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

  .help {
    color: #dd0d0d !important;
    font-size: 10px;
  }

  @media (min-width: 768px) {
    .modal-dialog {
      width: 400px !important;
    }
  }
</style>
