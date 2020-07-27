import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		username: null,
		game: null
	},
	mutations: {
		update_username (state, username) {
			state.username = username;
		},
		update_game (state, game) {
			state.game = game;
		}
	},
	plugins: [
		createPersistedState({storage: window.sessionStorage})
	]
})

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
