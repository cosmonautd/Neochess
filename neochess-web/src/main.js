import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import VueSocketIO from 'vue-socket.io'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// import axios from 'axios'
// import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		username: null,
		game: null,
		status: {
			code: 'loading',
			message: 'loading...',
		},
		time: {
			t1: null,
			t2: null
		},
		watcher: false
	},
	mutations: {
		update_username (state, username) {
			state.username = username;
		},
		update_game (state, game) {
			state.game = game;
		},
		update_status (state, status) {
			state.status = status;
		},
		update_time (state, time) {
			state.time = time;
		},
		update_watcher (state, watcher) {
			state.watcher = watcher;
		}
	},
	plugins: [
		createPersistedState({storage: window.sessionStorage})
	]
});

Vue.use(new VueSocketIO({
	// debug: process.env.NODE_ENV === 'development' ? true : false,
	debug: false,
	connection: process.env.VUE_APP_SERVER_URL,
	vuex: {
		store,
		actionPrefix: 'SOCKET_',
		mutationPrefix: 'SOCKET_'
	},
	options: {
		path: process.env.VUE_APP_SOCKETIO_PATH,
		autoConnect: true
	}
}));

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

import VModal from 'vue-js-modal'
Vue.use(VModal)

import sounds from "vue-sounds";
Vue.use(sounds, store, {
	sounds:[
		{name:"move", url:"https://davidborges.xyz/assets/zapsplat_impacts_wood_thin_small_panel_knock_hit_lite_muted_002_39794.mp3"},
		{name:"capture", url:"https://davidborges.xyz/assets/impact_wood_planks_x2_drop_on_floor_together_003.mp3"},
		{name:"check", url:"https://davidborges.xyz/assets/multimedia_game_sound_synth_tone_bold_error_52992.mp3"},
	]
});

// Vue.use(VueAxios, axios)

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
