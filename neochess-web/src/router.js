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
			path: '/game/:gameId',
			name: 'game',
			component: Game
		}
	]
});
