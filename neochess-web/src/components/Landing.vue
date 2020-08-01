<template>
<div id="neochess-landing">
	<div class="container-fluid">
		<div class="vertical-spacing-1"/>
		<h1 class="neochess-title">neochess</h1>
		<p>
			<span>You are connected as </span>
			<span class="neochess-title">{{ this.$store.state.username }}</span>
		</p>
		<div class="vertical-spacing-3"/>
		<p class="neochess-title"> Start a game </p>
		<div>
			<button @click="newGame('1+0')" class="round-corners time-control-button">
				1+0
			</button>
			<button @click="newGame('3+0')" class="round-corners time-control-button">
				3+0
			</button>
			<button @click="newGame('5+0')" class="round-corners time-control-button">
				5+0
			</button>
		</div>
		<div>
			<button @click="newGame('10+0')" class="round-corners time-control-button">
				10+0
			</button>
			<button @click="newGame('15+0')" class="round-corners time-control-button">
				15+0
			</button>
			<button @click="newGame('30+0')" class="round-corners time-control-button">
				30+0
			</button>
		</div>
		<div class="vertical-spacing-3"></div>
		<p class="neochess-title"> Choose a game </p>
		<GameList
			:games="games"
		/>
	</div>
</div>
</template>

<script>
const seconds = {
	'1+0': 60,
	'3+0': 60*3,
	'5+0': 60*5,
	'10+0': 60*10,
	'15+0': 60*15,
	'30+0': 60*30,
}
import GameList from "./GameList.vue";
export default {
	name: "neochess-landing",
	components: {
		GameList
	},
	data() {
		return {
			games: []
		}
	},
	methods: {
		newGame(timeControl) {
			this.$socket.emit('newGame', {timeControl});
		},
		go_to_new_game(game) {
			this.$store.commit('update_game', game);
			this.$router.push({ name: 'game', params: {
				gameId: this.$store.state.game.params.gameId
			}});
		}
	},
	sockets: {
		listener: {
			connect: function () {
				if (!this.$store.state.username)
					this.$socket.emit('username', {});
				else this.$socket.emit('username', {username: this.$store.state.username});
			},
			username: function(data) {
				this.$store.commit('update_username', data.username);
			},
			gamesList: function(data) {
				this.games = data.games;
			},
			gameCreated: function (data) {
				this.go_to_new_game(data.game);
				this.$store.commit('update_time', {
					t1: seconds[data.game.params.timeControl],
					t2: seconds[data.game.params.timeControl]
				});
			}
		}
	},
	created() {
		this.$store.commit('update_game', null);
		this.$store.commit('update_status_code', 'loading');
		this.$store.commit('update_status_message', 'loading...');
		this.$store.commit('update_status_win', false);
		this.$store.commit('update_status_draw', false);
		this.$store.commit('update_status_lose', false);
		this.$store.commit('update_status_result', null);
		this.$store.commit('update_time', {t1: null, t2: null});
	},
	mounted() {
		this.$socket.emit('getGames');
	}
}
</script>

<style scoped>
.vertical-spacing-1 {
	height: 1em;
}
.vertical-spacing-2 {
	height: 2em;
}
.vertical-spacing-3 {
	height: 3em;
}
.vertical-spacing-4 {
	height: 4em;
}
.vertical-spacing-8 {
	height: 8em;
}
h1 {
	color: white
}
.time-control-button {
	margin: 1em;
	width: 5em;
	height: 5em;
}
</style>