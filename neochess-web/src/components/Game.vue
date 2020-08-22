<template>
<!-- <div id="neochess-game" :key="neochess_game" tabindex="0"
	v-on:keyup.right="historyForwards"
	v-on:keyup.left="historyBackwards"
	v-on:keyup.up="historyCurrent"
	v-on:keyup.down="historyBeginning" > -->
<div id="neochess-game" :key="neochess_game">
	<div v-if="status.code === 'success' || status.code === 'over'" class="spacing-top-double">
		<b-container fluid class="bv-example-row">
			<b-row align-h="center">
				<b-col align-self="center">
					<b-row align-h="center" align-v="start">
						<div @click="landingPage" class="link">
							<h1 class="neochess-title" style="color: #444">neochess</h1>
						</div>
					</b-row>
					<div v-if="this.$vssWidth < 992" class="responsive-font">
						<span>You are connected as </span>
						<span class="neochess-title">{{ this.$store.state.username }}</span>
					</div>
					<b-row align-h="center">
						<div>
							<p :style="{visibility:show_share_message}" class="responsive-font"
								v-if="this.$vssWidth >= 992">
								Share the link of this page with a friend to start playing
								or wait for someone to join this game
							</p>
						</div>
						<div class='timer spacing-top'>
							<Timer/>
						</div>
					</b-row>
				</b-col>
				<b-col sm="12" md="12" lg="9" xl="9" class="responsive-padding-left">
					<p v-if="this.$vssWidth >= 992" class="responsive-font">
						<span>You are connected as </span>
						<span class="neochess-title">{{ this.$store.state.username }}</span>
					</p>
					<Board
						class='spacing-top'
						:size="board_size"
						:orientation="orientation"
						:player="orientation"
						boardClass="neochess-blue merida"
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
	<modal name="game-over-modal" width="80%" :maxWidth="300" :adaptive="true" v-if="game">
		<div class="neochess-modal">
			<b-container fluid class="bv-example-row">
				<b-row align-h="center" class="neochess-row">
					<b-col align-self="center">
						<div v-if="result.description === 'checkmate'">
							Checkmate!
						</div>
						<div v-if="result.description === 'ontime'">
							Time is up!
						</div>
						<div v-if="result.description === 'draw.stalemate'">
							Stalemate!
						</div>
						<div v-if="result.description === 'draw.threefold_repetition'">
							Threefold repetition!
						</div>
						<div v-if="result.description === 'draw.insufficient_material'">
							Insufficient material!
						</div>
						<div v-if="result.description === 'checkmate' || result.description === 'ontime'">
							{{result.winner}} wins
						</div>
						<div v-if="result.description === 'resignation'
							&& result.winner === game.players.white.username">
							<p>{{game.players.black.username}} resigned</p>
							<p>{{game.players.white.username}} wins</p>
						</div>
						<div v-if="result.description === 'resignation'
							&& result.winner === game.players.black.username">
							<p>{{game.players.white.username}} resigned</p>
							<p>{{game.players.black.username}} wins</p>
						</div>
						<div v-if="result.description === 'abandonment'
							&& result.winner === game.players.white.username">
							{{game.players.black.username}} abandoned the game
						</div>
						<div v-if="result.description === 'abandonment'
							&& result.winner === game.players.black.username">
							{{game.players.white.username}} abandoned the game
						</div>
						<div v-if="draw">It's a draw</div>
						<div class="vertical-spacing-1"></div>
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
			if (this.game.players.black.username === this.username)
				return 'black';
			else return 'white';
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
		game() {
			return this.$store.state.game;
		},
		result() {
			return this.$store.state.game.result;
		},
		draw() {
			return this.result.description ?
				this.result.description.startsWith('draw') : false;
		},
		show_share_message() {
			if (this.orientation === 'white' &&
				this.game.players.black.username === null) return 'visible';
			if (this.orientation === 'black' &&
				this.game.players.white.username === null) return 'visible';
			else return 'hidden';
		}
	},
	methods: {
		load() {
			this.defined_board_size = this.compute_board_size();
			this.neochess_game += 1;
			if (this.game) {
				if (this.$store.state.status.code !== 'over')
					this.$store.commit('update_status', {
						code: 'success',
						message: 'success'
					});
			}
			else this.$store.commit('update_status', {
				code: 'failed',
				message: 'failed'
			});
		},
		compute_board_size() {
			const w = this.$vssWidth;
			const h = this.$vssHeight;
			const size = w < h ? 0.99*w : 0.85*h;
			return size.toString();
		},
		refresh(event) {
			event.preventDefault();
			event.returnValue = "";
		},
		join_game() {
			if (!this.game) {
				this.$socket.emit('joinGame', {gameId: this.$route.params.gameId});
			} else {
				this.load();
			}
		},
		screenResize() {
			this.defined_board_size = this.compute_board_size();
			this.neochess_game = this.defined_board_size;
		},
		landingPage() {
			this.$router.push({name: 'landing'});
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
						t1: seconds[data.game.timeControl.string],
						t2: seconds[data.game.timeControl.string]
					});
					this.$store.commit('update_watcher', data.watcher);
					this.load();
				} else {
					this.$store.commit('update_status', {
						code: data.error.code,
						message: data.error.message
					});
				}
			},
			gameOver: function () {
				this.$store.commit('update_status', {
					code: 'over',
					message: 'game over'
				});
				this.$modal.show('game-over-modal');
			}
		}
	},
	created() {
		this.join_game();
		window.addEventListener("resize", this.screenResize);
	},
	destroyed() {
		window.removeEventListener("resize", this.screenResize);
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
	.spacing-top-double {
		margin-top: 0.1em;
	}
    .responsive-font {
		font-size: small;
	}
	.responsive-padding-left {
		margin-left: -7.2%;
	}
}
.link {
	text-decoration: none;
	cursor: pointer;
}
.gray {
	color: #555;
}
</style>