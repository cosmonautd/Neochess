<template>
<div class="piece">
	<div id="handle" :style="{left: handle.left, top: handle.top, position: handle.position, zIndex: 9999,
			opacity: 1, width: size + 'px', height: moving ? size + 'px' : '0px'}">
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
	<Drag
		id="base" class="drag"
		:style="{
			width: size + 'px', height: size + 'px', opacity, zIndex: -9999
		}"
		:transfer-data="{ piece: id }"
		effect-allowed="move"
		:image-x-offset="size/2"
		:image-y-offset="size/2"
		@dragstart="(data, event) => move_started(id, position, event)"
		@drag="(data, event) => move_ongoing()"
		@dragend="move_finished(id)" >
		<img :ref="id" v-if="id === 'w_pawn'" class="piece-content" src="../assets/w_pawn.svg">
		<img :ref="id" v-if="id === 'w_knight'" class="piece-content" src="../assets/w_knight.svg">
		<img :ref="id" v-if="id === 'w_bishop'" class="piece-content" src="../assets/w_bishop.svg">
		<img :ref="id" v-if="id === 'w_rook'" class="piece-content" src="../assets/w_rook.svg">
		<img :ref="id" v-if="id === 'w_queen'" class="piece-content" src="../assets/w_queen.svg">
		<img :ref="id" v-if="id === 'w_king'" class="piece-content" src="../assets/w_king.svg">
		<img :ref="id" v-if="id === 'b_pawn'" class="piece-content" src="../assets/b_pawn.svg">
		<img :ref="id" v-if="id === 'b_knight'" class="piece-content" src="../assets/b_knight.svg">
		<img :ref="id" v-if="id === 'b_bishop'" class="piece-content" src="../assets/b_bishop.svg">
		<img :ref="id" v-if="id === 'b_rook'" class="piece-content" src="../assets/b_rook.svg">
		<img :ref="id" v-if="id === 'b_queen'" class="piece-content" src="../assets/b_queen.svg">
		<img :ref="id" v-if="id === 'b_king'" class="piece-content" src="../assets/b_king.svg">
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
</div>
</template>

<script>
import $ from 'jquery';
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
			opacity: 1,
			moving: false,
			dragClickOffsetX: null,
			dragClickOffsetY: null,
			lastDragX: null,
			lastDragY: null,
			handle: {
				left: 0,
				top: 0,
				position: ''
			}
		}
	},
	methods: {
		update_size(new_size) {
			this.size = new_size;
		},
		move_started(id, position, event) {
			console.log(`You are moving: ${id} from ${position}`);
			this.opacity = 0.15
			this.dragClickOffsetX = this.size/2;
			this.dragClickOffsetY = this.size/2;
			const left = this.$refs[id].getBoundingClientRect().left
			const top = this.$refs[id].getBoundingClientRect().top
			this.handle.left = left + 'px'
			this.handle.top = top + 'px'
			this.lastDragX = left;
			this.lastDragY = top;
			var img = new Image()
			img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
			event.dataTransfer.setDragImage(img, 0, 0)
			this.handle.position = 'fixed'
			this.moving = true;
			this.coordinates.x = 0
			this.coordinates.y = 0
		},
		move_ongoing() {

			let useX = this.coordinates.x;
			let useY = this.coordinates.y;

			if (useX === 0 && useY === 0) {
				useX = this.lastDragX;
				useY = this.lastDragY;
			}

			if (useX === this.lastDragX && useY === this.lastDragY) {
				return;
			}

			const newLeft = useX - this.dragClickOffsetX
			const newTop = useY - this.dragClickOffsetY

			// console.log(useX, this.lastDragX, useY, this.lastDragY)

			this.handle.left = newLeft + 'px'
			this.handle.top = newTop + 'px'

			this.lastDragX = useX;
			this.lastDragY = useY;
		},
		move_finished(id) {
			this.opacity = 1
			this.moving = false;
			this.handle.position = ''
			const left = this.$refs[id].getBoundingClientRect().left
			const top = this.$refs[id].getBoundingClientRect().top
			this.handle.left = left + 'px'
			this.handle.top = top + 'px'
			this.lastDragX = left;
			this.lastDragY = top;
			this.coordinates.x = 0
			this.coordinates.y = 0
		}
	},
	mixins: [
		{
			data () {
				return {
					initOffset: {
						x: 0,
						y: 0,
					},
					coordinates: {
						x: 0,
						y: 0,
					},
				};
			},
			computed: {
				shiftCoordinates() {
					return {
						x: this.coordinates.x - this.initOffset.x,
						y: this.coordinates.y - this.initOffset.y,
					}
				},
			},
			mounted () {
				// Dirty hack for Firefox only...
				// @ref: https://stackoverflow.com/questions/887316/how-do-i-get-clientx-and-clienty-to-work-inside-my-drag-event-handler-on-firef?rq=1
				$(document)
					.on('dragstart', (e) => {
						e = e.originalEvent;
						this.initOffset.x = e.clientX || e.pageX;
						this.initOffset.y = e.clientY || e.pageY;
					});

				$(document)
					.on('dragover', (e) => {
						e = e.originalEvent;
						this.coordinates.x = e.clientX || e.pageX;
						this.coordinates.y = e.clientY || e.pageY;
					});
			},
		}
	]
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