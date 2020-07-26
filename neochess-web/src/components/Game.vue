<template>
<div id="neochess-game">
	<p class="neochess-title">game!</p>
	<p>share this link with a friend to start playing: {{ game_url }}</p>
	<Board :size="board_size"></Board>
</div>
</template>

<script>
import Board from "./Board.vue";
import VueScreenSize from 'vue-screen-size'
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
			defined_board_size: null,
		}
	},
	computed: {
		board_size() {
			if (!this.defined_board_size) {
				return this.compute_board_size();
			} else {
				return this.defined_board_size;
			}
		}
	},
	methods: {
		loading() {
			this.defined_board_size = this.compute_board_size();
		},
		compute_board_size() {
			const w = this.$vssWidth;
			const h = this.$vssHeight;
			const size = w < h ? 0.9*w : 0.8*h;
			return size.toString();
		}
	},
	mounted() {
		this.loading();
	},
	mixins: [VueScreenSize.VueScreenSizeMixin],
}
</script>

<style scoped>
</style>