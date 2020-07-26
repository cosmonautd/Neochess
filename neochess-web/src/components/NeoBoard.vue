<template>
<div id="neochess-board">
	<div class="board" :style="{width: size + 'px', height: size + 'px'}" :key="board_update">
		<div v-for="file in board" :key="file.id">
			<div v-for="rank in file.ranks" :key="rank.square" class="rank">
				<Drop v-if="rank.piece" :class="`drop ${rank.type}`" drop-effect="move"
					@drop="(data, e) => move({...data, ...{square: rank.square}})">
					<NeoPiece :id="rank.piece" :start_position="rank.square" :size="piece_size"/>
				</Drop>
				<Drop v-else  :class="`drop ${rank.type}`" drop-effect="move"
					@drop="(data, e) => move({...data, ...{square: rank.square}})">
					<div :style="{width: piece_size + 'px', height: piece_size + 'px'}"/>
				</Drop>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import NeoPiece from "./NeoPiece.vue";
import { Drop } from 'vue-drag-drop';
export default {
	name: "neochess-board",
	components: {
		NeoPiece,
		Drop
	},
	props: {
		size: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			game_id: this.$route.params.game_id,
			piece_size: this.size*0.125,
			board_update: true,
			board: [
				{
					id: 'h',
					ranks: [
						{ square: 'h8', type: 'light-square', piece: 'b_rook' },
						{ square: 'h7', type: 'dark-square', piece: 'b_knight' },
						{ square: 'h6', type: 'light-square', piece: 'b_bishop' },
						{ square: 'h5', type: 'dark-square', piece: 'b_queen' },
						{ square: 'h4', type: 'light-square', piece: 'b_king' },
						{ square: 'h3', type: 'dark-square', piece: 'b_bishop' },
						{ square: 'h2', type: 'light-square', piece: 'b_knight' },
						{ square: 'h1', type: 'dark-square', piece: 'b_rook' },
					]
				},
				{
					id: 'g',
					ranks: [
						{ square: 'g8', type: 'dark-square', piece: 'b_pawn' },
						{ square: 'g7', type: 'light-square', piece: 'b_pawn' },
						{ square: 'g6', type: 'dark-square', piece: 'b_pawn' },
						{ square: 'g5', type: 'light-square', piece: 'b_pawn' },
						{ square: 'g4', type: 'dark-square', piece: 'b_pawn' },
						{ square: 'g3', type: 'light-square', piece: 'b_pawn' },
						{ square: 'g2', type: 'dark-square', piece: 'b_pawn' },
						{ square: 'g1', type: 'light-square', piece: 'b_pawn' },
					]
				},
				{
					id: 'f',
					ranks: [
						{ square: 'f8', type: 'light-square', piece: null },
						{ square: 'f7', type: 'dark-square', piece: null },
						{ square: 'f6', type: 'light-square', piece: null },
						{ square: 'f5', type: 'dark-square', piece: null },
						{ square: 'f4', type: 'light-square', piece: null },
						{ square: 'f3', type: 'dark-square', piece: null },
						{ square: 'f2', type: 'light-square', piece: null },
						{ square: 'f1', type: 'dark-square', piece: null },
					]
				},
				{
					id: 'e',
					ranks: [
						{ square: 'e8', type: 'dark-square', piece: null },
						{ square: 'e7', type: 'light-square', piece: null },
						{ square: 'e6', type: 'dark-square', piece: null },
						{ square: 'e5', type: 'light-square', piece: null },
						{ square: 'e4', type: 'dark-square', piece: null },
						{ square: 'e3', type: 'light-square', piece: null },
						{ square: 'e2', type: 'dark-square', piece: null },
						{ square: 'e1', type: 'light-square', piece: null },
					]
				},
				{
					id: 'd',
					ranks: [
						{ square: 'd8', type: 'light-square', piece: null },
						{ square: 'd7', type: 'dark-square', piece: null },
						{ square: 'd6', type: 'light-square', piece: null },
						{ square: 'd5', type: 'dark-square', piece: null },
						{ square: 'd4', type: 'light-square', piece: null },
						{ square: 'd3', type: 'dark-square', piece: null },
						{ square: 'd2', type: 'light-square', piece: null },
						{ square: 'd1', type: 'dark-square', piece: null },
					]
				},
				{
					id: 'c',
					ranks: [
						{ square: 'c8', type: 'dark-square', piece: null },
						{ square: 'c7', type: 'light-square', piece: null },
						{ square: 'c6', type: 'dark-square', piece: null },
						{ square: 'c5', type: 'light-square', piece: null },
						{ square: 'c4', type: 'dark-square', piece: null },
						{ square: 'c3', type: 'light-square', piece: null },
						{ square: 'c2', type: 'dark-square', piece: null },
						{ square: 'c1', type: 'light-square', piece: null },
					]
				},
				{
					id: 'b',
					ranks: [
						{ square: 'b8', type: 'light-square', piece: 'w_pawn' },
						{ square: 'b7', type: 'dark-square', piece: 'w_pawn' },
						{ square: 'b6', type: 'light-square', piece: 'w_pawn' },
						{ square: 'b5', type: 'dark-square', piece: 'w_pawn' },
						{ square: 'b4', type: 'light-square', piece: 'w_pawn' },
						{ square: 'b3', type: 'dark-square', piece: 'w_pawn' },
						{ square: 'b2', type: 'light-square', piece: 'w_pawn' },
						{ square: 'b1', type: 'dark-square', piece: 'w_pawn' },
					]
				},
				{
					id: 'a',
					ranks: [
						{ square: 'a8', type: 'dark-square', piece: 'w_rook' },
						{ square: 'a7', type: 'light-square', piece: 'w_knight' },
						{ square: 'a6', type: 'dark-square', piece: 'w_bishop' },
						{ square: 'a5', type: 'light-square', piece: 'w_queen' },
						{ square: 'a4', type: 'dark-square', piece: 'w_king' },
						{ square: 'a3', type: 'light-square', piece: 'w_bishop' },
						{ square: 'a2', type: 'dark-square', piece: 'w_knight' },
						{ square: 'a1', type: 'light-square', piece: 'w_rook' },
					]
				},
			]
		}
	},
	methods: {
		move(data) {
			const piece = data.piece;
			const square = data.square;
			console.log(`You dropped: ${piece} on ${square}`);
		}
	},
	mounted () {
		this.board[7].ranks[7].piece = 'w_rook';
		this.board_update = !this.board_update;
	}
}
</script>

<style scoped>
.board {
	margin: auto;
}
.rank {
	width: 100%;
	height: 12.5%;
}
.light-square {
	background-color: white;
	width: 12.5%;
	height: 100%;
	float: left;
}
.dark-square {
	background-color: seagreen;
	width: 12.5%;
	height: 100%;
	float: left;
}
</style>