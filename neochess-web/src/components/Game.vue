<template>
<div id="neochess-game">
	<p class="neochess-title">game!</p>
	<p>share this link with a friend to start playing: {{ game_url }}</p>
	<Board :size="board_size"></Board>
</div>
</template>

<script>
import Board from "./Board.vue";
export default {
	name: "neochess-game",
	components: {
		Board
	},
	props: {
	},
	data() {
		return {
			game_id: this.$route.params.game_id,
			game_url: `${process.env.VUE_APP_URL}/#/game/${this.$route.params.game_id}`,
			board_size: this.$route.params.board_size,
		}
	},
	methods: {
		loading() {
		}
	},
	mounted() {
		this.loading();
	},
}
</script>

<style scoped>
</style>