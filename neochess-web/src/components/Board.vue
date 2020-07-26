<template>
<div id="neochess-board">
	<chessboard ref="chessboard" :style="css_vars" id="board"/>
</div>
</template>

<script>
import {chessboard} from 'vue-chessboard'
export default {
	name: "neochess-board",
	components: {
		chessboard
	},
	props: {
		size: {
			type: String,
			default: '700'
		}
	},
	computed: {
		css_vars() {
			return {
				'--size': this.size + 'px'
			}
		}
	},
	data() {
		return {
			game_id: this.$route.params.game_id
		}
	},
	methods: {
		loading() {
		}
	},
	mounted() {
		this.loading();
	}
}
</script>

<style>
.cg-board-wrap {
	width: var(--size);
	height: var(--size);
	margin: auto;
}
</style>