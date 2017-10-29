import Vue from 'vue';
import Vuex from 'vuex';

import cloneDeep from 'clone-deep';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		auth: {
			isUserAuthenticated: (localStorage.isAuth == true || localStorage.isAuth == 'true')
		},
		categories: [
			{
				categoryId: 1,
				name: 'Main Menu',
				items: [
					{
						itemId: 1,
						name: 'Lamb',
						price: '15.00',
						description: 'Roast lamb with vegetables',
					},
					{
						itemId: 2,
						name: 'Sausages',
						price: '5.00',
						description: '100% British beef sausages',
					},
					{
						itemId: 3,
						name: 'Potatoes',
						price: '7.00',
						description: 'Irish potatoes with a golden shine',
					}
				]
			},
			{
				categoryId: 2,
				name: 'Starters',
				items: [
					{
						itemId: 4,
						name: 'Ribs',
						price: '10.00',
						description: 'At vero eos et accusamus et iusto odio dignissimos ',
					},
					{
						itemId: 5,
						name: 'Nachos',
						price: '7.00',
						description: 'Nam libero tempore, cum soluta nobis est eligendi optio',
					},
					{
						itemId: 6,
						name: 'Soup',
						price: '4.00',
						description: 'Itaque earum rerum hic tenetur a sapiente',
					}
				]
			},
			{
				categoryId: 3,
				name: 'Desserts',
				items: [
					{
						itemId: 7,
						name: 'Apple Crumble',
						price: '6.00',
						description: 'Excepteur sint occaecat cupidatat non proident',
					},
					{
						itemId: 8,
						name: 'Cheesecake',
						price: '5.00',
						description: 'Quis autem vel eum iure reprehenderit qui in',
					},
					{
						itemId: 9,
						name: 'Sundae',
						price: '5.00',
						description: 'Ut enim ad minima veniam, quis nostrum',
					}
				]
			},
			{
				categoryId: 4,
				name: 'Drinks',
				items: [
					{
						itemId: 10,
						name: 'Heineken',
						price: '3.80',
						description: 'Sed ut perspiciatis unde omnis iste natus error sit ',
					},
					{
						itemId: 11,
						name: 'Milkshake',
						price: '5.00',
						description: 'Nemo enim ipsam voluptatem quia voluptas sit ',
					},
					{
						itemId: 12,
						name: 'Coca Cola',
						price: '3.00',
						description: 'Neque porro quisquam est, qui dolorem',
					}
				]
			}
		]
		
	},
	mutations: {
		/**
			Items
		**/
		addItem(state, data) {
			state.categories[data.catIndex].items.unshift(data.item);
			console.log(state.categories[data.catIndex]);
		},
		updateItem(state, trigger) {
			const itemState = state.categories[trigger.catIndex].items[trigger.itemIndex];
			Object.assign(itemState, trigger.item);
		},
		deleteItem(state, trigger) {
			state.categories[trigger.catIndex].items.splice(trigger.itemIndex, 1);
		},

		/**
			Categories
		**/
		addCategory(state, category) {
			console.log(category);
			state.categories.unshift(category);
		},
		deleteCategory(state, catIndex) {
			state.categories.splice(catIndex, 1);
		},

		/**
			Auth
		**/
		authenticateUser(state) {
			state.auth.isUserAuthenticated = true;
		},
		deauthenticateUser(state) {
			state.auth.isUserAuthenticated = false;
		}
	},
	actions: {},
	getters: {
		/** 
			Categories and Items 
		**/
		getCategoriesAndItems(state) {
			return state.categories;
		},
		getCategoriesAndItemsView(state) {
			return cloneDeep(state.categories);
		},

		/**
			Auth
		**/
		isUserAuthenticated(state) {
			return state.auth.isUserAuthenticated;
		}
	}
});