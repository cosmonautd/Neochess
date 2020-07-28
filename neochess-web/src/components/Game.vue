<template>
<div id="neochess-game" :key="neochess_game">
	<div v-if="status === 'success'">
		<p class="neochess-title">game!</p>
		<p>auto generated username: {{ username }}</p>
		<p>share this link with a friend to start playing: <a :href="game_url">LINK</a></p>
		<Board
			class='spacing-top'
			:size="board_size"
			:orientation="orientation"
			:player="orientation"
		/>
	</div>
	<div v-else-if="status === 'loading'">
		<p class="neochess-title">loading...</p>
	</div>
	<div v-else>
		<p class="neochess-title">{{status_message}}</p>
	</div>
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
			neochess_game: 0,
			base_url: process.env.VUE_APP_URL,
			defined_board_size: null,
			status: 'loading',
			status_message: 'loading...'
		}
	},
	computed: {
		board_size() {
			if (!this.defined_board_size) return this.compute_board_size();
			else return this.defined_board_size;
		},
		game_url() {
			return `${this.base_url}/#/game/${this.$store.state.game.params.game_id}`;
		},
		username() {
			return this.$store.state.username;
		},
		orientation() {
			return this.$store.state.game.params.orientation;
		},
		css_vars() {
			return {
				'width': this.board_size + 'px',
				'height': this.board_size + 'px'
			}
		},
	},
	methods: {
		load() {
			this.defined_board_size = this.compute_board_size();
			this.neochess_game += 1;
			if (this.$store.state.game) this.status = 'success';
			else this.status = 'failed';
		},
		compute_board_size() {
			const w = this.$vssWidth;
			const h = this.$vssHeight;
			const size = w < h ? 0.9*w : 0.8*h;
			return size.toString();
		},
		refresh(event) {
			event.preventDefault();
			event.returnValue = "";
		},
		join_game() {
			if (!this.$store.state.game) {
				const join_url = `${process.env.VUE_APP_SERVER_URL}/join-game`;
				this.axios.post(join_url, {game_id: this.$route.params.game_id})
				.then(response => {
					const data = response.data;
					this.$store.commit('update_game', data.game);
					this.$store.commit('update_username', data.game.params.username);
					this.load();
				})
				.catch(error => {
					const data = error.response.data;
					this.status = data.error.code;
					this.status_message = data.error.message;
				});
			} else {
				this.load();
			}
		}
	},
	created() {
		this.join_game();
	},
	mixins: [VueScreenSize.VueScreenSizeMixin],
}
</script>

<style scoped>
p {
	margin-bottom: 0%;
}
.spacing-top {
	margin-top: 1.5em;
}
</style>