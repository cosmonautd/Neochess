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
		}
	},
	methods: {
		load() {
			this.defined_board_size = this.compute_board_size();
			this.neochess_game += 1;
			if (this.$store.state.username) this.status = 'success';
			else this.status = 'failed';
		},
		compute_board_size() {
			const w = this.$vssWidth;
			const h = this.$vssHeight;
			const size = w < h ? 0.9*w : 0.8*h;
			return size.toString();
		},
		refresh: function refresh(event) {
			event.preventDefault();
			event.returnValue = "";
		}
	},
	async beforeCreate() {
		if (!this.$store.state.game) {
			try {
				const join_game = `${process.env.VUE_APP_SERVER_URL}/join-game`;
				const response = await fetch(join_game, {
					method: 'POST',
					body: JSON.stringify({game_id: this.$route.params.game_id}),
					headers: { 'Content-type': 'application/json; charset=UTF-8' },
				})
				const data = await response.json();
				this.$store.commit('update_username', data.game.params.username);
				this.$store.commit('update_game', data.game);
				if (!this.$store.state.username) {
					this.status = 'failed';
					this.status_message = 'could not join'
				}
				this.load();
			} catch (error) {
				console.error(error);
			}
		}
	},
	mounted() {
		this.load();
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