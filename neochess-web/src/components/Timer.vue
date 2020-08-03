<template>
<div id="neochess-timer">
	<div v-if="this.$vssWidth >= 992">
		<div>
			<div class="neochess-time round-corners">{{opponentTime}}</div>
			<div class="neochess-username">{{opponent}}</div>
		</div>
		<div class="vertical-spacing"></div>
		<div>
			<div class="neochess-username">{{username}}</div>
			<div class="neochess-time round-corners">{{userTime}}</div>
		</div>
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
	},
	sockets: {
		listener: {
			timesync: function (sync) {
				if (sync.gameId === this.$store.state.game._id)
				this.$store.commit('update_time', {
					t1: sync[this.username],
					t2: sync[this.opponent]
				});
			},
		}
	},
	mixins: [VueScreenSize.VueScreenSizeMixin],
}
</script>

<style scoped>
.vertical-spacing {
	height: 2em;
}
.neochess-time {
	font-size: xxx-large;
	background-color: #333;
}
.neochess-username {
	font-size: x-large;
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
}
</style>