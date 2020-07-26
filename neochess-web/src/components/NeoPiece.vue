<template>
<div id="neochess-piece" :style="{width: size + 'px', height: size + 'px'}">
	<img class="piece-content" :src="get_url(id)">
</div>
</template>
<script>
export default {
	name: "neochess-piece",
	components: {
	},
	props: {
		id: {
			type: String,
			required: true,
		},
		square: {
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
		get_url(id) {
			var images = require.context('../assets/', false, /\.svg$/)
			return images('./' + id + ".svg")
		}
	}
}
</script>

<style scoped>
.piece {
	position: relative;
}
.piece-content {
	top: 50%;
	left: 50%;
	width: 100%;
	height: 100%;
}
</style>