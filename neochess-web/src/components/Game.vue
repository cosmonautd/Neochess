<template>
<div id="neochess-game">
	<p class="neochess-title">game!</p>
	<p>share this link with a friend to start playing: {{ game_url }}</p>
	<NeoBoard size="600"/>
</div>
</template>

<script>
import NeoBoard from "./NeoBoard.vue";
export default {
	name: "neochess-game",
	components: {
		NeoBoard
	},
	props: {
		url: String
	},
	data() {
		return {
			game_id: this.$route.params.game_id,
			game_url: `${process.env.VUE_APP_URL}/#/game/${this.$route.params.game_id}`,
		}
	},
	methods: {
		loading() {
		}
	}
}
</script>

<style scoped>
</style>