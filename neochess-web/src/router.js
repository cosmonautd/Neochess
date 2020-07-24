import Vue from 'vue'
import Router from 'vue-router'

import Landing from './components/Landing.vue'
import Game from './components/Game.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'landing',
			component: Landing
		},
		{
			path: '/game/:game_id',
			name: 'game',
			component: Game
		}
	]
});
