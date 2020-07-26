<template>
<div id="neochess-board">
	<div class="board" :style="{width: size + 'px', height: size + 'px'}" :key="board_update">
		<div v-for="rank in board" :key="rank.id">
			<div v-for="file in rank.files" :key="file.square" class="file">
				<div v-if="file.piece" :class="`${file.type}`"
					:style="{width: piece_size + 'px', height: piece_size + 'px'}"
					@click="select(file.square, file.piece)" >
					<NeoPiece :id="file.piece" :square="file.square" :size="piece_size"/>
				</div>
				<div v-else :class="`${file.type}`"
					:style="{width: piece_size + 'px', height: piece_size + 'px'}"
					@click="move(file.square)" >
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import NeoPiece from "./NeoPiece.vue";
export default {
	name: "neochess-board",
	components: {
		NeoPiece,
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
			selection: {
				piece: null,
				square: null
			},
			board: [
				{
					id: '8',
					files: [
						{ square: 'a8', type: 'light-square', piece: 'b_rook' },
						{ square: 'b8', type: 'dark-square', piece: 'b_knight' },
						{ square: 'c8', type: 'light-square', piece: 'b_bishop' },
						{ square: 'd8', type: 'dark-square', piece: 'b_queen' },
						{ square: 'e8', type: 'light-square', piece: 'b_king' },
						{ square: 'f8', type: 'dark-square', piece: 'b_bishop' },
						{ square: 'g8', type: 'light-square', piece: 'b_knight' },
						{ square: 'h8', type: 'dark-square', piece: 'b_rook' },
					]
				},
				{
					id: '7',
					files: [
						{ square: 'a7', type: 'dark-square', piece: 'b_pawn' },
						{ square: 'b7', type: 'light-square', piece: 'b_pawn' },
						{ square: 'c7', type: 'dark-square', piece: 'b_pawn' },
						{ square: 'd7', type: 'light-square', piece: 'b_pawn' },
						{ square: 'e7', type: 'dark-square', piece: 'b_pawn' },
						{ square: 'f7', type: 'light-square', piece: 'b_pawn' },
						{ square: 'g7', type: 'dark-square', piece: 'b_pawn' },
						{ square: 'h7', type: 'light-square', piece: 'b_pawn' },
					]
				},
				{
					id: '6',
					files: [
						{ square: 'a6', type: 'light-square', piece: null },
						{ square: 'b6', type: 'dark-square', piece: null },
						{ square: 'c6', type: 'light-square', piece: null },
						{ square: 'd6', type: 'dark-square', piece: null },
						{ square: 'e6', type: 'light-square', piece: null },
						{ square: 'f6', type: 'dark-square', piece: null },
						{ square: 'g6', type: 'light-square', piece: null },
						{ square: 'h6', type: 'dark-square', piece: null },
					]
				},
				{
					id: '5',
					files: [
						{ square: 'a5', type: 'dark-square', piece: null },
						{ square: 'b5', type: 'light-square', piece: null },
						{ square: 'c5', type: 'dark-square', piece: null },
						{ square: 'd5', type: 'light-square', piece: null },
						{ square: 'e5', type: 'dark-square', piece: null },
						{ square: 'f5', type: 'light-square', piece: null },
						{ square: 'g5', type: 'dark-square', piece: null },
						{ square: 'h5', type: 'light-square', piece: null },
					]
				},
				{
					id: '4',
					files: [
						{ square: 'a4', type: 'light-square', piece: null },
						{ square: 'b4', type: 'dark-square', piece: null },
						{ square: 'c4', type: 'light-square', piece: null },
						{ square: 'd4', type: 'dark-square', piece: null },
						{ square: 'e4', type: 'light-square', piece: null },
						{ square: 'f4', type: 'dark-square', piece: null },
						{ square: 'g4', type: 'light-square', piece: null },
						{ square: 'h4', type: 'dark-square', piece: null },
					]
				},
				{
					id: '3',
					files: [
						{ square: 'a3', type: 'dark-square', piece: null },
						{ square: 'b3', type: 'light-square', piece: null },
						{ square: 'c3', type: 'dark-square', piece: null },
						{ square: 'd3', type: 'light-square', piece: null },
						{ square: 'e3', type: 'dark-square', piece: null },
						{ square: 'f3', type: 'light-square', piece: null },
						{ square: 'g3', type: 'dark-square', piece: null },
						{ square: 'h3', type: 'light-square', piece: null },
					]
				},
				{
					id: '2',
					files: [
						{ square: 'a2', type: 'light-square', piece: 'w_pawn' },
						{ square: 'b2', type: 'dark-square', piece: 'w_pawn' },
						{ square: 'c2', type: 'light-square', piece: 'w_pawn' },
						{ square: 'd2', type: 'dark-square', piece: 'w_pawn' },
						{ square: 'e2', type: 'light-square', piece: 'w_pawn' },
						{ square: 'f2', type: 'dark-square', piece: 'w_pawn' },
						{ square: 'g2', type: 'light-square', piece: 'w_pawn' },
						{ square: 'h2', type: 'dark-square', piece: 'w_pawn' },
					]
				},
				{
					id: '1',
					files: [
						{ square: 'a1', type: 'dark-square', piece: 'w_rook' },
						{ square: 'b1', type: 'light-square', piece: 'w_knight' },
						{ square: 'c1', type: 'dark-square', piece: 'w_bishop' },
						{ square: 'd1', type: 'light-square', piece: 'w_queen' },
						{ square: 'e1', type: 'dark-square', piece: 'w_king' },
						{ square: 'f1', type: 'light-square', piece: 'w_bishop' },
						{ square: 'g1', type: 'dark-square', piece: 'w_knight' },
						{ square: 'h1', type: 'light-square', piece: 'w_rook' },
					]
				},
			]
		}
	},
	methods: {
		select(square, piece) {
			this.selection.piece = piece;
			this.selection.square = square;
			console.log(`You selected ${piece} from ${square}`);
		},
		move(square) {
			if (this.selection.piece && this.selection.square) {
				const targetFile = square[0].charCodeAt(0) - 97;
				const targetRank = 7 - (parseInt(square[1]) - 1);
				const sourceFile = this.selection.square[0].charCodeAt(0) - 97;
				const sourceRank = 7 - (parseInt(this.selection.square[1]) - 1);
				this.board[targetRank].files[targetFile].piece = this.selection.piece;
				this.board[sourceRank].files[sourceFile].piece = null;
				this.board_update = !this.board_update;
				this.selection.piece = null;
				this.selection.square = null;
			}
		}
	},
	mounted () {
	}
}
</script>

<style scoped>
.board {
	margin: auto;
}
.file {
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