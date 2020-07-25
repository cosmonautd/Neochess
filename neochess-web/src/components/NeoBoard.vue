<template>
<div id="neochess-board">
	<div class="board" :style="{width: size + 'px', height: size + 'px'}">
		<div class="rank">
			<div class="light-square">
				<NeoPiece id="b_rook" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="b_knight" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="b_bishop" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="b_queen" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="b_king" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="b_bishop" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="b_knight" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="b_rook" :size="piece_size"/>
			</div>
		</div>
		<div class="rank">
			<div class="dark-square">
				<NeoPiece id="b_pawn" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="b_pawn" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="b_pawn" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="b_pawn" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="b_pawn" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="b_pawn" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="b_pawn" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="b_pawn" :size="piece_size"/>
			</div>
		</div>
		<div class="rank">
			<div class="light-square"></div>
			<div class="dark-square"></div>
			<div class="light-square"></div>
			<div class="dark-square"></div>
			<div class="light-square"></div>
			<div class="dark-square"></div>
			<div class="light-square"></div>
			<div class="dark-square"></div>
		</div>
		<div class="rank">
			<div class="dark-square"></div>
			<div class="light-square"></div>
			<div class="dark-square"></div>
			<div class="light-square"></div>
			<div class="dark-square"></div>
			<div class="light-square"></div>
			<div class="dark-square"></div>
			<div class="light-square"></div>
		</div>
		<div class="rank">
			<div class="light-square"></div>
			<div class="dark-square"></div>
			<div class="light-square"></div>
			<div class="dark-square"></div>
			<div class="light-square"></div>
			<div class="dark-square"></div>
			<div class="light-square"></div>
			<div class="dark-square"></div>
		</div>
		<div class="rank">
			<div class="dark-square"></div>
			<div class="light-square"></div>
			<div class="dark-square"></div>
			<div class="light-square"></div>
			<div class="dark-square"></div>
			<div class="light-square"></div>
			<div class="dark-square"></div>
			<div class="light-square"></div>
		</div>
		<div class="rank">
			<div class="light-square">
				<NeoPiece id="w_pawn" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="w_pawn" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="w_pawn" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="w_pawn" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="w_pawn" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="w_pawn" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="w_pawn" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="w_pawn" :size="piece_size"/>
			</div>
		</div>
		<div class="rank">
			<div class="dark-square">
				<NeoPiece id="w_rook" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="w_knight" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="w_bishop" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="w_queen" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="w_king" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="w_bishop" :size="piece_size"/>
			</div>
			<div class="dark-square">
				<NeoPiece id="w_knight" :size="piece_size"/>
			</div>
			<div class="light-square">
				<NeoPiece id="w_rook" :size="piece_size"/>
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
		NeoPiece
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
			piece_size: this.size*0.125
		}
	},
	methods: {
		loading() {
		}
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