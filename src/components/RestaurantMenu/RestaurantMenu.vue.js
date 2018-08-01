// Components
import Category from '../Category/Category';

// Mixins
import functions from '../../mixins/functions';

// Events bus
import { bus } from '../../main';

export default {
	name: 'RestaurantMenu',
	components: {
		'category': Category
	},
	mixins: [functions],

	data() {
		return {
		}
	},

	created() {
		bus.$on('userConfirmation_addNewCategory', (data, trigger) => {
			this.addCategory(data.name);
		});

		bus.$on('userConfirmation_updateCategory', (data, trigger) => {
			this.updateCategoryName(data, trigger);
		});

		bus.$on('userConfirmation_deleteCategory', (trigger) => {
			this.deleteCategory(trigger);
		});
	},

	computed: {
		/**
			The API login endpoint returns the user object, the restaurant object, and the menu object/
			We store each in local storage, so that these fundamental details are globally accessible to the application
		**/
		restaurant() {
			return JSON.parse(localStorage.restaurant);
		},

		categories () {
			return this.$store.getters.getCategoriesAndItems;
		}
	},

	methods: {

		showAddCategoryModal() {
			var menuName = 'your menu';
			/* The menu name should always be set in local storage */
			if(localStorage.getItem('menu') !== null) {
				const m = JSON.parse(localStorage.menu);
				if(m.hasOwnProperty('name')) {
					menuName = m.name;
				}
			}

			this.showModalForm(
				'category_add',
				'Add a new category to your ' + menuName,
				'Save'
			);
		},

		/*
			Here we send a request to the API to add the new category to the menu. If the data is successfully persisted to the database, 
			we also update the state, which is then reflected in the view (the category panel  appears at the top of its accordion). 
			It is important to keep the backend data and the front-end state syncronised
		*/
		addCategory(categoryName) {
			/* This category will be added to the store; the object must take on the correct form, as below */
			var newCategory = {
				categoryId: '',
				name: categoryName,
				items: []
			}

			this.$http.post('category/create', {
				name: categoryName,
				menuId: JSON.parse(localStorage.menu).menuId
			}, {
				headers: {Authorization: JSON.parse(localStorage.user).token}
			}).then((res) => {
				if(res.status == 200 || res.status == 201) {
					newCategory.categoryId = res.body.createdCategoryId;
					this.$store.commit('addCategory', newCategory);
					this.displayFlashMsg('New category "' + categoryName + '" was successfully added to your menu!', 'success');
				}

			}).catch((res) => {
				this.handleApiError(res);
			});
		},

		/**
			Here we send the updated category name to the API, and if the data is successfully persisted to the database,
			we also update the state, which is then reflected in the view. It is important to keep the backend data and the
			front-end state syncronised
		**/
		updateCategoryName(data, trigger) {
			const catName = data.name;

			this.$http.put('category/update/'+trigger.catId, {
				name: data.name,
				menuId: JSON.parse(localStorage.menu).menuId
			}, {
				headers: {Authorization: JSON.parse(localStorage.user).token}
			}).then((res) => {
				if(res.status == 200) {
					// If the updates were successfully persisted to the database, update the state to reflect the changes
					this.$store.commit('updateCategoryName', {
						name: catName,
						index: trigger.catIndex
					});
					this.displayFlashMsg('Your category was successfully updated!', 'success');
				}
			}).catch((res) => {
				this.handleApiError(res);
			});
		},

		/**
			Here we send a request to the API to deactivate the category (by setting categories.active = 0). If the data is successfully persisted to the database, we also update the state, which is then reflected in the view (the category panel disappears). It is important to keep the backend data and the front-end state syncronised
		**/
		deleteCategory(trigger) {
			this.$http.put('category/deactivate/'+trigger.catId, {}, {
				headers: {Authorization: JSON.parse(localStorage.user).token}

			}).then((res) => {
				if(res.status == 200) {
					// If the updates were successfully persisted to the database, update the state to reflect the changes
					this.$store.commit('deleteCategory', trigger.catIndex);
					this.displayFlashMsg('Your category was successfully deleted!', 'success');
				}

			}).catch((res) => {
				this.handleApiError(res);
			});
		}
	}
}