<template>
<div id="neochess-landing">
	<p class="neochess-title">neochess</p>
	<button @click="new_game_socket_io()">start a game</button>
</div>
</template>

<script>

export default {
	name: "neochess-landing",
	props: {
		url: String
	},
	data() {
		return {
		}
	},
	methods: {
		// new_game() {
		// 	const newgame_url = `${process.env.VUE_APP_SERVER_URL}/new-game`;
		// 	this.axios.post(newgame_url, {})
		// 	.then(response => {
		// 		const data = response.data;
		// 		this.go_to_new_game(data.game);
		// 	})
		// 	.catch(error => {
		// 		console.log(error);
		// 	});
		// },
		new_game_socket_io() {
			this.$socket.emit('newGame', {});
		},
		go_to_new_game(game) {
			this.$store.commit('update_username', game.params.username);
			this.$store.commit('update_game', game);
			this.$router.push({ name: 'game', params: {game_id: game.params.game_id}});
		}
	},
	sockets: {
		listener: {
			connect: function () {
				console.log('socket connected')
			},
			newGame: function (data) {
				this.go_to_new_game(data.game);
			}
		}
	}
}
</script>

<style scoped>
</style>