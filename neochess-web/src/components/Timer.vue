<template>
<div id="neochess-timer">
	<div v-if="this.$vssWidth >= 992">
		<div>
			<div class="neochess-time round-corners">{{opponentTime}}</div>
			<div class="neochess-username">{{opponent}}</div>
		</div>
		<div class="vertical-spacing-2"></div>
		<div>
			<div class="neochess-username">{{username}}</div>
			<div class="neochess-time round-corners">{{userTime}}</div>
		</div>
		<div class="vertical-spacing-2"></div>
		<div @click="resign" class="round-corners neochess-option">Resign</div>
		<!-- <div class="round-corners neochess-option">Offer draw</div> -->
	</div>
	<div v-else>
		<b-container fluid class="bv-example-row">
			<b-row align-h="center">
				<b-col>
					<div class="neochess-time round-corners">{{opponentTime}}</div>
					<div class="neochess-username">{{opponent}}</div>
				</b-col>
				<b-col>
					<div class="neochess-time round-corners">{{userTime}}</div>
					<div class="neochess-username">{{username}}</div>
				</b-col>
				<b-col>
					<div @click="resign" class="round-corners neochess-option">Resign</div>
					<!-- <div class="round-corners neochess-option">
						Offer draw
					</div> -->
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
			lastMoveUser: null
		}
	},
	computed: {
		username() {
			return this.$store.state.username;
		},
		opponent() {
			const white = this.$store.state.game.players.white.username;
			const black = this.$store.state.game.players.black.username;
			if (this.orientation === 'white' && black !== null) return black;
			if (this.orientation === 'black' && white !== null) return white;
			else return 'waiting for opponent...';
		},
		orientation() {
			if (this.$store.state.game.players.white.username === this.username)
				return 'white';
			else return 'black';
		},
		userTime() {
			return this.secondsToMinutes(this.$store.state.time.t1);
		},
		opponentTime() {
			return this.secondsToMinutes(this.$store.state.time.t2);
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
			timesync: function (sync) {
				if (sync.gameId === this.$store.state.game._id) {
					const username = this.username;
					const opponent = this.opponent;
					this.$store.commit('update_time', {
						t1: sync[username],
						t2: sync[opponent] !== undefined ? sync[opponent] : sync[username]
					});
					const ack = {gameId: sync.gameId, username};
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
@media screen and (max-width: 991px) {
    .vertical-spacing {
		height: 1em;
	}
	.neochess-time {
		font-size: large;
	}
	.neochess-username {
		font-size: medium;
	}
	.neochess-option {
		display: inherit;
		padding: 0.4em 0.9em 0.4em 0.9em;
		margin: 0em 0em 0em 0em;
		font-size: small;
	}
}
</style>