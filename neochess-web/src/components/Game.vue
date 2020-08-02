<template>
<div id="neochess-game" :key="neochess_game">
	<div v-if="status.code === 'success' || status.code === 'over'" class="spacing-top-double">
		<b-container fluid class="bv-example-row">
			<b-row align-h="center">
				<b-col align-self="center">
					<b-row align-h="center" align-v="start">
						<a href="." class="link">
							<h1 class="neochess-title">neochess</h1>
						</a>
					</b-row>
					<b-row align-h="center">
						<p v-if="this.$vssWidth < 576" class="responsive-font">
							<span>You are connected as </span>
							<span class="neochess-title">{{ this.$store.state.username }}</span>
						</p>
						<p :style="{visibility:show_share_message}" class="responsive-font">
							Share the link of this page with a friend to start playing
							or wait for someone to join this game
						</p>
						<div class='timer spacing-top'>
							<Timer/>
						</div>
					</b-row>
				</b-col>
				<b-col sm="12" md="12" lg="9" xl="9">
					<p v-if="this.$vssWidth >= 576" class="responsive-font">
						<span>You are connected as </span>
						<span class="neochess-title">{{ this.$store.state.username }}</span>
					</p>
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
	<div v-else-if="status.code === 'loading'">
		<p class="neochess-title">loading...</p>
	</div>
	<div v-else>
		<p class="neochess-title">{{status.message}}</p>
	</div>
	<modal name="game-over-modal" width="80%" :maxWidth="300" :adaptive="true">
		<div class="neochess-modal">
			<b-container fluid class="bv-example-row">
				<b-row align-h="center" class="neochess-row">
					<b-col align-self="center">
						<p v-if="status.win">Congratulations!</p>
						<p v-if="status.draw">Well, let's call it a draw.</p>
						<p v-if="status.lose">That's unfortunate.</p>
						<p v-if="status.win && status.result === 'checkmate'">
							You won by checkmate!
						</p>
						<p v-if="status.win && status.result === 'ontime'">
							You won on time!
						</p>
						<p v-if="status.result === 'draw.stalemate'">
							That was a stalemate.
						</p>
						<p v-if="status.result === 'draw.threefold_repetition'">
							No one wins by repeating moves.
						</p>
						<p v-if="status.result === 'draw.insufficient_material'">
							You both have insufficient material to deliver a checkmate.
						</p>
						<p v-if="status.lose && status.result === 'checkmate'">
							You lost by checkmate!
						</p>
						<p v-if="status.lose && status.result === 'ontime'">
							You lost on time!
						</p>
						<img v-if="status.win" src="../assets/icons8-crown-64.png"/>
						<img v-if="status.draw" src="../assets/icons8-explosive-64.png"/>
						<img v-if="status.lose" src="../assets/icons8-explosive-64.png"/>
					</b-col>
				</b-row>
			</b-container>
		</div>
	</modal>
</div>
</template>

<script>
import Board from "./Board.vue";
import Timer from "./Timer.vue";
import VueScreenSize from 'vue-screen-size'
const seconds = {
	'1+0': 60,
	'3+0': 60*3,
	'5+0': 60*5,
	'10+0': 60*10,
	'15+0': 60*15,
	'30+0': 60*30,
}
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
			defined_board_size: null,
		}
	},
	computed: {
		board_size() {
			if (!this.defined_board_size) return this.compute_board_size();
			else return this.defined_board_size;
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
		status() {
			return this.$store.state.status;
		},
		show_share_message() {
			return this.$store.state.game.params.opponent === null ? 'visible' : 'hidden';
		}
	},
	methods: {
		load() {
			this.defined_board_size = this.compute_board_size();
			this.neochess_game += 1;
			if (this.$store.state.game) {
				if (this.$store.state.status.code !== 'over')
					this.$store.commit('update_status_code', 'success');
			}
			else this.$store.commit('update_status_code', 'failed');
		},
		compute_board_size() {
			const w = this.$vssWidth;
			const h = this.$vssHeight;
			const size = w < h ? 0.85*w : 0.8*h;
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
					this.$store.commit('update_time', {
						t1: seconds[data.game.params.timeControl],
						t2: seconds[data.game.params.timeControl]
					});
					this.load();
				} else {
					this.$store.commit('update_status_code', data.error.code);
					this.$store.commit('update_status_message', data.error.message);
				}
			},
			gameOver: function (data) {
				this.$store.commit('update_status_code', 'over');
				this.$store.commit('update_status_result', data.result);
				
				if (data.winner === this.username) {
					this.$store.commit('update_status_win', true);
				}
				else if (data.result.split('.')[0] === 'draw') {
					this.$store.commit('update_status_draw', true);
				} 
				else this.$store.commit('update_status_lose', true);
				this.$modal.show('game-over-modal');
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
.spacing-top-double {
	margin-top: 1.5em;
}
.timer {
	width: 100%;
	height: auto;
}
.neochess-row {
	height: 100%;
}
.responsive-font {
	font-size: inherit;
}
@media screen and (max-width: 575px) {
    .responsive-font {
		font-size: small;
	}
}
.link {
	text-decoration: none;
}
</style>