import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import VueSocketIO from 'vue-socket.io'
import axios from 'axios'
import VueAxios from 'vue-axios'

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
});

Vue.use(new VueSocketIO({
	debug: true,
	connection: 'http://localhost:8085',
	vuex: {
		store,
		actionPrefix: 'SOCKET_',
		mutationPrefix: 'SOCKET_'
	},
	options: {
		// path: "/my-app/"
		// autoConnect: false
	}
}));

Vue.use(VueAxios, axios)

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
