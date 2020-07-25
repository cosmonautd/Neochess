<template>
<VueDraggableResizable 
	class="piece"
	:w="size" :h="size" @dragging="on_drag" :parent="false">
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
</VueDraggableResizable>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'
export default {
	name: "neochess-piece",
	components: {
		VueDraggableResizable
	},
	props: {
		id: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			required: true,
		}
	},
	data() {
		return {
		}
	},
	methods: {
		update_size(new_size) {
			this.size = new_size;
		},
		on_drag(x, y) {
			this.x = x + 500;
			this.y = y + 500;
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