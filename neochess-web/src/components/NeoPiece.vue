<template>
<Drag 
	class="drag piece"
	:style="{
		width: size + 'px', height: size + 'px', opacity
	}"
	:transfer-data="{ piece: id }"
	effect-allowed="move"
	:image-x-offset="size/2"
	:image-y-offset="size/2"
	@dragstart="move_started(id, position)"
	@dragend="move_finished()" >
	<img v-if="id === 'w_pawn'" class="piece-content" src="../assets/w_pawn.svg">
	<img v-if="id === 'w_knight'" class="piece-content" src="../assets/w_knight.svg">
	<img v-if="id === 'w_bishop'" class="piece-content" src="../assets/w_bishop.svg">
	<img v-if="id === 'w_rook'" class="piece-content" src="../assets/w_rook.svg">
	<img v-if="id === 'w_queen'" class="piece-content" src="../assets/w_queen.svg">
	<img v-if="id === 'w_king'" class="piece-content" src="../assets/w_king.svg">
	<img v-if="id === 'b_pawn'" class="piece-content" src="../assets/b_pawn.svg">
	<img v-if="id === 'b_knight'" class="piece-content" src="../assets/b_knight.svg">
	<img v-if="id === 'b_bishop'" class="piece-content" src="../assets/b_bishop.svg">
	<img v-if="id === 'b_rook'" class="piece-content" src="../assets/b_rook.svg">
	<img v-if="id === 'b_queen'" class="piece-content" src="../assets/b_queen.svg">
	<img v-if="id === 'b_king'" class="piece-content" src="../assets/b_king.svg">
	<template slot="image">
	<div class="drag" :style="{width: size + 'px', height: size + 'px'}">
	<img v-if="id === 'w_pawn'" class="piece-content" src="../assets/w_pawn.svg">
	<img v-if="id === 'w_knight'" class="piece-content" src="../assets/w_knight.svg">
	<img v-if="id === 'w_bishop'" class="piece-content" src="../assets/w_bishop.svg">
	<img v-if="id === 'w_rook'" class="piece-content" src="../assets/w_rook.svg">
	<img v-if="id === 'w_queen'" class="piece-content" src="../assets/w_queen.svg">
	<img v-if="id === 'w_king'" class="piece-content" src="../assets/w_king.svg">
	<img v-if="id === 'b_pawn'" class="piece-content" src="../assets/b_pawn.svg">
	<img v-if="id === 'b_knight'" class="piece-content" src="../assets/b_knight.svg">
	<img v-if="id === 'b_bishop'" class="piece-content" src="../assets/b_bishop.svg">
	<img v-if="id === 'b_rook'" class="piece-content" src="../assets/b_rook.svg">
	<img v-if="id === 'b_queen'" class="piece-content" src="../assets/b_queen.svg">
	<img v-if="id === 'b_king'" class="piece-content" src="../assets/b_king.svg">
	</div>
    </template>
</Drag>
</template>

<script>
import { Drag } from 'vue-drag-drop';
export default {
	name: "neochess-piece",
	components: {
		Drag
	},
	props: {
		id: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			required: true,
		},
		start_position: {
			type: String,
			required: true,
		}
	},
	data() {
		return {
			position: this.start_position,
			opacity: 1
		}
	},
	methods: {
		update_size(new_size) {
			this.size = new_size;
		},
		move_started(id, position) {
			console.log(`You are moving: ${id} from ${position}`);
			this.opacity = 0.1
		},
		move_finished() {
			this.opacity = 1
		}
	}
}
</script>

<style scoped>
.piece {
	position: relative;
}
.piece-content {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
	height: 100%;
}
</style>