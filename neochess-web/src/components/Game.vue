<template>
<div id="neochess-game" :key="neochess_game">
	<div v-if="status === 'success'">
		<p class="neochess-title">game!</p>
		<p>auto generated username: {{ username }}</p>
		<p>share this link with a friend to start playing: <a :href="game_url">LINK</a></p>
		<b-container fluid class="bv-example-row">
			<b-row align-h="center">
				<b-col align-self="center">
					<div class='timer spacing-top'>
						<Timer/>
					</div>
				</b-col>
				<b-col sm="12" md="12" lg="9" xl="9">
					<Board
						class='spacing-top'
						:size="board_size"
						:orientation="orientation"
						:player="orientation"
					/>
				</b-col>
			</b-row>
		</b-container>
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
import Timer from "./Timer.vue";
import VueScreenSize from 'vue-screen-size'
export default {
	name: "neochess-game",
	components: {
		Board,
		Timer
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
			return `${this.base_url}/#/game/${this.$store.state.game.params.gameId}`;
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
				this.$socket.emit('joinGame', {gameId: this.$route.params.gameId});
			} else {
				this.load();
			}
		}
	},
	sockets: {
		listener: {
			connect: function () {
				if (!this.$store.state.username)
					this.$socket.emit('username', {});
				else this.$socket.emit('username', {username: this.$store.state.username});
			},
			username: function(data) {
				this.$store.commit('update_username', data.username);
			},
			gameJoined: function (data) {
				if (data.game) {
					this.$store.commit('update_game', data.game);
					this.load();
				} else {
					this.status = data.error.code;
					this.status_message = data.error.message;
				}
			},
			gameOver: function (data) {
				console.log('Game Over')
				console.log('Result:', data.result);
				console.log('Winner:', data.winner);
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
.timer {
	width: 100%;
	height: auto;
}
/* @media screen and (max-width: 991px) {
    .timer {
        width: 85%;
    }
} */
</style>