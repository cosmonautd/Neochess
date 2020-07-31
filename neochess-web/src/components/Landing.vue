<template>
<div id="neochess-landing">
	<div class="container-fluid">
		<div class="vertical-spacing-4"></div>
		<h1 class="neochess-title">neochess</h1>
		<div class="vertical-spacing-4"></div>
		<button @click="new_game()">start a game</button>
		<div class="vertical-spacing-8"></div>
		<GameList
			:games="games"
		/>
	</div>
</div>
</template>

<script>
const TIME_CONTROL = 180;
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
		new_game() {
			this.$socket.emit('newGame', {});
		},
		go_to_new_game(game) {
			this.$store.commit('update_game', game);
			this.$router.push({ name: 'game', params: {gameId: game.params.gameId}});
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
		this.$store.commit('update_time', {t1: TIME_CONTROL, t2: TIME_CONTROL});	
	},
	mounted() {
		this.$socket.emit('getGames');
	}
}
</script>

<style scoped>
.vertical-spacing-4 {
	height: 4em;
}
.vertical-spacing-8 {
	height: 8em;
}
h1 {
	color: white
}
</style>