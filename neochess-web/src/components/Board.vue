<template>
<div id="neochess-board">
	<chessboard :style="chessboard_style" id="board"/>
</div>
</template>

<script>
import {chessboard} from 'vue-chessboard'
export default {
	name: "neochess-board",
	components: {
		chessboard
	},
	props: {},
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

<style>
.cg-board-wrap {
	width: 600px;
	height: 600px;
	margin: auto;
}
</style>