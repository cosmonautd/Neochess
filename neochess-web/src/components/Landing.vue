<template>
<div id="neochess-landing">
	<div class="container-fluid">
		<div class="vertical-spacing-1"></div>
		<div class="vertical-spacing-top"/>
		<a href="." class="link" style="display: inline-block">
			<h1 class="neochess-title">neochess</h1>
		</a>
		<p>
			<span>You are connected as </span>
			<span class="neochess-title">{{ this.$store.state.username }}</span>
		</p>
		<div class="vertical-spacing-3"/>
		<p class="neochess-title"> Start a game </p>
		<div class="vertical-spacing-1"/>
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

		<p v-if="games.length > 0 || watchableGames.length > 0"
			class="neochess-title"> Join a game </p>
		<div class="vertical-spacing-1"/>

		<div v-if="games.length > 0">
			<GameList
				:games="games"
				action="Join"
			/>
		</div>

		<div v-if="watchableGames.length > 0">
			<GameList
				:games="watchableGames"
				action="Watch"
			/>
		</div>

		<div class="vertical-spacing-4"></div>
		<div class="vertical-spacing-2"></div>
		<div class="footer round-corners" @click="howto">
			how neochess works
		</div>
		<div class="footer round-corners" @click="about">
			about
		</div>
		<div class="vertical-spacing-1"></div>
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
			games: [],
			watchableGames: []
		}
	},
	methods: {
		newGame(timeControl) {
			this.$socket.emit('newGame', {timeControl});
		},
		goToNewGame(game) {
			this.$store.commit('update_game', game);
			this.$router.push({ name: 'game', params: {
				gameId: this.$store.state.game._id
			}});
		},
		about() {
			this.$router.push({ name: 'about'});
		},
		howto() {
			this.$router.push({ name: 'howto'});
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
				this.watchableGames = data.watchableGames;
			},
			gameCreated: function (data) {
				this.goToNewGame(data.game);
				this.$store.commit('update_time', {
					t1: seconds[data.game.timeControl.string],
					t2: seconds[data.game.timeControl.string]
				});
			}
		}
	},
	created() {
		this.$store.commit('update_game', null);
		this.$store.commit('update_status', {
			code: 'loading',
			message: 'loading...'
		});
		this.$store.commit('update_time', {white: null, black: null});
	},
	mounted() {
		this.$socket.emit('getGames');
	}
}
</script>

<style scoped>
.time-control-button {
	margin: 1em;
	width: 5em;
	height: 5em;
}
@media screen and (max-width: 575px) {
    .time-control-button {
		margin: 0.5em;
		width: 5em;
		height: 5em;
	}
}
.link {
	text-decoration: none;
}
.footer {
	background-color: #222;
	margin: 0.25em 0.5em 0.25em 0.5em;
	display: inline-block;
	padding: 1.25em 2em 1.25em 2em;
	cursor: pointer;
	display: inline-block;
}
</style>