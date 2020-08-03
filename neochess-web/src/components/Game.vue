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
	<modal name="game-over-modal" width="80%" :maxWidth="300" :adaptive="true">
		<div class="neochess-modal">
			<b-container fluid class="bv-example-row">
				<b-row align-h="center" class="neochess-row">
					<b-col align-self="center">
						<p v-if="status.result === 'checkmate'">
							Checkmate!
						</p>
						<p v-if="status.result === 'ontime'">
							Time is up!
						</p>
						<p v-if="status.result === 'draw.stalemate'">
							Stalemate.
						</p>
						<p v-if="status.result === 'draw.threefold_repetition'">
							Threefold repetition.
						</p>
						<p v-if="status.result === 'draw.insufficient_material'">
							Insufficient material.
						</p>
						<p v-if="status.win && status.result === 'resignation'">
							Your opponent resigned!
						</p>
						<p v-if="status.lose && status.result === 'resignation'">
							You resigned.
						</p>
						<p v-if="status.win">You won.</p>
						<p v-if="status.draw">Draw.</p>
						<p v-if="status.lose && status.result !== 'resignation'">
							You lost.
						</p>
						<div class="vertical-spacing-2"></div>
						<img v-if="status.win" src="../assets/icons8-crown-64.png"/>
						<img v-if="status.draw" src="../assets/icons8-handshake-64.png"/>
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
			if (this.$store.state.game.players.white.username === this.username)
				return 'white';
			else return 'black';
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
			if (this.orientation === 'white' &&
				this.$store.state.game.players.black.username === null) return 'visible';
			if (this.orientation === 'black' &&
				this.$store.state.game.players.white.username === null) return 'visible';
			else return 'hidden';
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
			const size = w < h ? 0.85*w : 0.85*h;
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
    .responsive-font {
		font-size: small;
	}
	.responsive-padding-left {
		margin-left: -15px;
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