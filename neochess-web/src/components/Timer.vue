<template>
<div id="neochess-timer">
	<div v-if="this.$vssWidth >= 992">
		<div>
			<div class="neochess-time round-corners">{{player2Time}}</div>
			<div class="neochess-username">{{player2}}</div>
		</div>
		<div class="vertical-spacing-2"></div>
		<div>
			<div class="neochess-username">{{player1}}</div>
			<div class="neochess-time round-corners">{{player1Time}}</div>
		</div>
		<div class="vertical-spacing-2"></div>
		<div @click="resign" class="round-corners neochess-option">Resign</div>
		<!-- <div class="round-corners neochess-option">Offer draw</div> -->
		<div class="vertical-spacing-2"></div>
		<div :style="{visibility:disconnected_status,color:'red'}">
			<p class="responsive-font">
			Trying to reconnect...
			</p>
		<img src="../assets/connecting.gif" width="20%">
		</div>
	</div>
	<div v-else>
		<b-container fluid class="bv-example-row">
			<b-row align-h="center">
				<b-col>
					<div class="neochess-time round-corners">{{player2Time}}</div>
					<div class="neochess-username">{{player2}}</div>
				</b-col>
				<b-col>
					<div class="neochess-time round-corners">{{player1Time}}</div>
					<div class="neochess-username">{{player1}}</div>
				</b-col>
				<b-col>
					<div @click="resign" class="round-corners neochess-option">Resign</div>
					<!-- <div class="round-corners neochess-option">
						Offer draw
					</div> -->
					<p :style="{visibility:disconnected_status, color:'red'}"
					class="responsive-font">
						Trying to reconnect...
						<img src="../assets/connecting.gif" width="50%">
					</p>
				</b-col>
			</b-row>
		</b-container>
	</div>
</div>
</template>

<script>
import VueScreenSize from 'vue-screen-size'
export default {
	name: "neochess-timer",
	props: {

	},
	data() {
		return {
			timer: null,
			lastMoveUser: null,
			connected: true
		}
	},
	computed: {
		player1() {
			const username = this.$store.state.username;
			const white = this.$store.state.game.players.white.username;
			const black = this.$store.state.game.players.black.username;
			if (username === white) return white;
			else if (username === black) return black;
			else return white;
		},
		player2() {
			const white = this.$store.state.game.players.white.username;
			const black = this.$store.state.game.players.black.username;
			if (this.orientation === 'white' && black !== null) return black;
			if (this.orientation === 'black' && white !== null) return white;
			else return 'waiting for opponent...';
		},
		orientation() {
			const username = this.$store.state.username;
			const black = this.$store.state.game.players.black.username;
			if (username === black)
				return 'black';
			else return 'white';
		},
		player1Time() {
			return this.secondsToMinutes(this.$store.state.time.t1);
		},
		player2Time() {
			return this.secondsToMinutes(this.$store.state.time.t2);
		},
		disconnected_status() {
			return this.connected ? 'hidden' : 'visible';
		}
	},
	methods: {
		secondsToMinutes(seconds) {
			const m = Math.floor(seconds/60);
			const s = (seconds % 60).toString().padStart(2, '0');
			return `${m}:${s}`;
		},
		resign() {
			this.$socket.emit('resign');
		}
	},
	sockets: {
		listener: {
			connect: function () {
				this.connected = true;
			},
			disconnect: function () {
				this.connected = false;
			},
			timesync: function (sync) {
				if (sync.gameId === this.$store.state.game._id) {
					const player1 = this.player1;
					const player2 = this.player2;
					this.$store.commit('update_time', {
						t1: sync[player1],
						t2: sync[player2] !== undefined ? sync[player2] : sync[player1]
					});
					const ack = {
						gameId: sync.gameId,
						username: this.$store.state.username
					};
					this.$socket.emit('syncAck', ack);
				}
			},
		}
	},
	mixins: [VueScreenSize.VueScreenSizeMixin],
}
</script>

<style scoped>
.neochess-time {
	font-size: xxx-large;
	background-color: #333;
}
.neochess-username {
	font-size: x-large;
}
.neochess-option {
	display: inline-block;
	padding: 0.6em 0.75em 0.6em 0.75em;
	margin: 0.25em 0.25em 0.25em 0.25em;
	font-size: medium;
	background-color: #333;
	cursor: pointer;
}
.responsive-font {
	font-size: inherit;
}
@media screen and (max-width: 991px) {
    .vertical-spacing {
		height: 1em;
	}
	.neochess-time {
		font-size: large;
	}
	.neochess-username {
		font-size: large;
	}
	.neochess-option {
		display: inherit;
		padding: 0.4em 0.9em 0.4em 0.9em;
		margin: 0em 0em 0.5em 0em;
		font-size: small;
	}
}
@media screen and (max-width: 575px) {
    .responsive-font {
		font-size: x-small;
	}
	.neochess-time {
		font-size: medium;
	}
	.neochess-username {
		font-size: small;
	}
}
</style>