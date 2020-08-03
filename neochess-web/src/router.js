import Vue from 'vue'
import Router from 'vue-router'

import Landing from './components/Landing.vue'
import About from './components/About.vue'
import HowTo from './components/HowTo.vue'
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
			path: '/about',
			name: 'about',
			component: About
		},
		{
			path: '/howto',
			name: 'howto',
			component: HowTo
		},
		{
			path: '/game/:gameId',
			name: 'game',
			component: Game
		}
	]
});
