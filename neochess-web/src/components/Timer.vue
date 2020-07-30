<template>
<div id="neochess-timer">
	<div>
		<div class="neochess-time">{{opponentTime}}</div>
		<div class="neochess-username">{{opponent}}</div>
	</div>
	<div class="vertical-spacing"></div>
	<div>
		<div class="neochess-username">{{username}}</div>
		<div class="neochess-time">{{userTime}}</div>
	</div>
</div>
</template>

<script>
const TIME_CONTROL = 180;
export default {
	name: "neochess-timer",
	props: {

	},
	data() {
		return {
			t1: TIME_CONTROL,
			t2: TIME_CONTROL,
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
			return this.secondsToMinutes(this.t1);
		},
		opponentTime() {
			return this.secondsToMinutes(this.t2);
		}
	},
	methods: {
		secondsToMinutes(seconds) {
			const m = Math.floor(seconds/60);
			const s = (seconds % 60).toString().padStart(2, '0');
			return `${m}:${s}`;
		},
		// startTimer() {
		// 	let component = this;
		// 	this.timer = setInterval(function() {
		// 		if (component.lastMoveUser == component.username)
		// 			component.t2 = Math.max(0, component.t2 - 1);
		// 		else if (component.lastMoveUser == component.opponent)
		// 			component.t1 = Math.max(0, component.t1 - 1);
		// 	}, 1000);
		// }
	},
	sockets: {
		listener: {
			// moved: function (movedata) {
			// 	this.lastMoveUser = movedata.username;
			// 	if (!this.timer) {
			// 		if (movedata.player === 'black') {
			// 			this.startTimer();
			// 		}
			// 	}
			// },
			timesync: function (sync) {
				this.t1 = sync[this.username];
				this.t2 = sync[this.opponent];
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
	background-color: darkgreen;
}
.neochess-username {
	font-size: x-large;
}
</style>