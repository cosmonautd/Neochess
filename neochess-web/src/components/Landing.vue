<template>
<div id="neochess-landing">
	<p id="neochess-title">neochess</p>
	<button @click="new_game(username)">start a game</button>
	<p v-if="game_id !== null">game id: {{ game_id }}</p>
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
			username: null,
			game_id: null
		}
	},
	methods: {
		async new_game(username) {
			try {
				const new_game = `${process.env.VUE_APP_NEOCHESS_SERVER_URL}/new-game`;
				const response = await fetch(new_game, {
					method: 'POST',
					body: JSON.stringify({username}),
					headers: { 'Content-type': 'application/json; charset=UTF-8' },
				})
				const data = await response.json()
				this.game_id = data.game_id;
			} catch (error) {
				console.error(error)
			}
		}
	}
}
</script>

<style scoped>
#neochess-title {
	font-weight: bold;
}
</style>