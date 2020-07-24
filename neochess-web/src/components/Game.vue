<template>
<div id="neochess-game">
	<p id="neochess-title">game!</p>
	<p>game id: {{ game_id }}</p>
</div>
</template>

<script>
export default {
	name: "neochess-game",
	props: {
		url: String
	},
	data() {
		return {
			game_id: this.$route.params.game_id,
		}
	},
	methods: {
		loading() {
		}
	}
}
</script>

<style scoped>
#neochess-title {
	font-weight: bold;
}
</style>