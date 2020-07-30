<template>
<div id="neochess-landing">
	<p class="neochess-title">neochess</p>
	<button @click="new_game()">start a game</button>
</div>
</template>

<script>

export default {
	name: "neochess-landing",
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
			gameCreated: function (data) {
				this.go_to_new_game(data.game);
			}
		}
	},
	created() {
		// this.$socket.open();
	}
}
</script>

<style scoped>
</style>