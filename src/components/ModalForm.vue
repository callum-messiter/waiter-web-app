<template>
  <transition name="modalForm" v-if="modal.isVisible">
   <div class="modal" style="display: block">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <div class="row">
            <span 
              class="glyphicon glyphicon-remove pull-right"
              v-on:click="cancel(modal.name)"
            ></span>
          </div>
          <!-- E.g. "Add a new item to {categoryName}" -->
          <div class="row">
            <h4 class="modal-title">{{modal.title}}</h4>
          </div>
        </div>

        <div class="modal-body">
          <!-- 
            Add-Item form 
          -->
          <form id="addItem" v-if="modal.name == 'item_add'">
            <!-- Item name -->
            <div class="row">
            <input 
              :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('itemName') }"
              name="itemName"
              type="text" 
              placeholder="Item name" 
              v-model="form.item.name"
              v-validate="{required: true, max: 30}"
              data-vv-as="item name"
            />
            <span
              class="help is-danger" 
              v-show="errors.has('itemName')">
              {{ errors.first('itemName') }}
            </span>
            <!-- Item price -->
            <input 
              :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('itemPrice') }"
              name="itemPrice"
              type="number"
              min="0.00" 
              max="10000.00" 
              step="0.50"
              placeholder="Item price" 
              v-model="form.item.price"
              v-validate="{required: true, max: 4}"
              data-vv-as="item price"
            />
            <span
              class="help is-danger" 
              v-show="errors.has('itemPrice')">
              {{ errors.first('itemPrice') }}
            </span>
            <!-- Item Description -->
            <input 
              :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('itemDescription') }"
              name="itemDescription"
              type="text" 
              placeholder="Item description" 
              v-model="form.item.description"
              v-validate="{required: true, max: 40}"
              data-vv-as="item description"
            />
            <span
              class="help is-danger" 
              v-show="errors.has('itemDescription')">
              {{ errors.first('itemDescription') }}
            </span>
            </div>
            <!-- Save Item Button -->
            <div class="row">
            <button 
              type="button"
              class="btn btn-primary"
              v-on:click="emitUserConfirmation('userConfirmation_addNewItem', modal.name, 'item', form.item, modal.trigger)">
              {{modal.buttons.primary}}
            </button>
            </div>
          </form>

          <!-- 
            Add-Category form 
          -->
          <form id="addCategory" v-if="modal.name == 'category_add'">
          <!-- Category name -->
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
            <!-- Save Category Button -->
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="emitUserConfirmation('userConfirmation_addNewCategory', modal.name, 'category', form.category, trigger={})">
              {{modal.buttons.primary}}
            </button>
          </form>

          <!-- 
            Edit-Item form 
          -->
          <form id="editItem" v-if="modal.name == 'item_edit'">
            <!-- Item name -->
            <input 
              :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('itemName') }"
              name="itemName"
              type="text" 
              placeholder="Chicken caesar salad" 
              v-model="form.item.name"
              v-validate="{required: true, max: 30}"
              data-vv-as="item name"
            />
            <span
              class="help is-danger" 
              v-show="errors.has('itemName')">
              {{ errors.first('itemName') }}
            </span>
            <!-- Item price -->
            <input 
              :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('itemPrice') }"
              name="itemPrice"
              type="text" 
              placeholder="7.00" 
              v-model="form.item.price"
              v-validate="{required: true, max: 4}"
              data-vv-as="item price"
            />
            <span
              class="help is-danger" 
              v-show="errors.has('itemPrice')">
              {{ errors.first('itemPrice') }}
            </span>
            <!-- Item Description -->
            <input 
              :class="{'input': true, 'pass' : true, 'is-danger-input': errors.has('itemDescription') }"
              name="itemDescription"
              type="text" 
              placeholder="Tasty chicken breast chunks with caesar salad" 
              v-model="form.item.description"
              v-validate="{required: true, max: 40}"
              data-vv-as="item description"
            />
            <span
              class="help is-danger" 
              v-show="errors.has('itemDescription')">
              {{ errors.first('itemDescription') }}
            </span>
            <!-- Save Item Button -->
            <button 
              type="button"
              class="btn btn-primary"
              v-on:click="emitUserConfirmation('userConfirmation_saveItemChanges', modal.name, 'item', form.item, modal.trigger)">
              {{modal.buttons.primary}}
            </button>
          </form>

        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>

import { bus } from '../main';

export default {
  name: 'ModalForm',

  data () {
    return {
      modal: {
        name: null,
        isVisible: false,
        title: null,
        trigger: {},
        buttons: {}
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
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '£',
        suffix: '',
        precision: 2,
        masked: false
      }
    }
  },

  created () {
    bus.$on('showModalForm', (modal) => {
      Object.assign(this.modal, modal);
    });
  },

  methods: {
    /**
      We use the event bus to communicate between other components and this modal component. This means that we don't need to repeat the modal HTML/CSS markup in every component which triggers the modal to be displayed.

      First, the trigger component emits and event to this modal component, which renders the modal with the data passed to it, making it visible to the user.

      Then, when one of the actional modal buttons is clicked (e.g. Add new category), this modal, via the below method, emits and event back to the target component. The target component will be listening to the relevant event, and upon receiving it, will execute the necessary logic (e.g. by calling the addCategory method.)
    **/
    emitUserConfirmation(eventName, modalName, form, data, trigger) {
      // Check if any of the fields are empty
      var fields = this.form[form];
      var allFieldsFilled = true;
      Object.keys(fields).forEach((key) => {
        if(fields[key].trim() === "") { allFieldsFilled = false; }
      });

      // Only send the event if there are no form errors, and no empty fields
      if(!this.errors.any() && allFieldsFilled === true) {
        bus.$emit(eventName, data, trigger);
        this.modal.isVisible = false;
        this.resetFormData(modalName);
      }
    },

    cancel(modalName) {
      this.modal.isVisible = false;
      this.resetFormData(modalName);
    },

    resetFormData(modalName) {
      // First check which form has been filled in
      var form = '';
      switch(modalName) {
        case 'item_add':
        case 'item_edit':
          form = 'item';
          break;
        case 'category_add':
          form = 'category';
          break;
        default:
          console.log('Error [ModalForm component]: modal name ' + modalName + ' not handled!');
          return false;
      }
      // Then set all properties of the form object to an empty string
      var obj = this.form[form];
      Object.keys(obj).forEach((key) => {
        obj[key] = ''; 
      });
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .modal-dialog {
    padding-top: 10%;
  }

  .modal-header {
    padding-top: 0;
  }

  span {
    padding-top: 5px;
    padding-right: 5px;
    cursor: pointer;
  }
</style>
