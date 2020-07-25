<template>
<div id="neochess-landing">
	<p class="neochess-title">neochess</p>
	<button @click="new_game(username)">start a game</button>
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
			username: null
		}
	},
	methods: {
		async new_game(username) {
			try {
				const new_game = `${process.env.VUE_APP_SERVER_URL}/new-game`;
				const response = await fetch(new_game, {
					method: 'POST',
					body: JSON.stringify({username}),
					headers: { 'Content-type': 'application/json; charset=UTF-8' },
				})
				const data = await response.json();
				this.go_to_new_game(data.game_id);
			} catch (error) {
				console.error(error);
			}
		},
		go_to_new_game(game_id) {
			this.$router.push({ name: 'game', params: { game_id }});
		}
	}
}
</script>

<style scoped>
</style>