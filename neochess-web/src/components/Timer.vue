<template>
<div id="neochess-timer">
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
</template>

<script>
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
			if (this.$store.state.game.params.opponent)
				return this.$store.state.game.params.opponent;
			else return 'waiting for opponent...'
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
				if (sync.gameId === this.$store.state.game.params.gameId)
				this.$store.commit('update_time', {
					t1: sync[this.username],
					t2: sync[this.opponent]
				});
			},
		}
	},
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
</style>