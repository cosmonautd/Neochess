import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import VueSocketIO from 'vue-socket.io'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

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
			win: false,
			draw: false,
			lose: false,
			result: null
		},
		time: {
			t1: null,
			t2: null
		}
	},
	mutations: {
		update_username (state, username) {
			state.username = username;
		},
		update_game (state, game) {
			state.game = game;
		},
		update_status_code (state, status_code) {
			state.status.code = status_code;
		},
		update_status_message (state, status_message) {
			state.status.message = status_message;
		},
		update_status_win (state, status_win) {
			state.status.win = status_win;
		},
		update_status_draw (state, status_draw) {
			state.status.draw = status_draw;
		},
		update_status_lose (state, status_lose) {
			state.status.lose = status_lose;
		},
		update_status_result (state, status_result) {
			state.status.result = status_result;
		},
		update_time (state, time) {
			state.time = time;
		}
	},
	plugins: [
		createPersistedState({storage: window.sessionStorage})
	]
});

Vue.use(new VueSocketIO({
	debug: process.env.NODE_ENV === 'development' ? true : false,
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

// Vue.use(VueAxios, axios)

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

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
