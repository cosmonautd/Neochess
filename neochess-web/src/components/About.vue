<template>
<div id="neochess-about" class="small-container">
	<div class="container-fluid">
		<div class="vertical-spacing-1"></div>
		<div @click="landingPage" class="link">
			<h1 class="neochess-title">neochess</h1>
		</div>
		<p>
			The minimalistic chess server.
			No accounts, no ratings, just the game.
		</p>
		<div class="vertical-spacing-4"/>
		<div class="content">
			<p>
				I challenged myself to code a chess server in one week and this is the
				result. For this, I focused on what really matters, the game itself.
				There are no accounts and usernames are auto-generated. Only players can
				access the game, but adding the possibility of watching games is
				something I'm planning to do in the future. There may be bugs in the 
				current implementation. If you find some, you can let me know by sending
				an email to 
				<a href="mailto:david@raiz.dev" class="bold link">david@raiz.dev</a>.
			</p>
			<div class="vertical-spacing-1"/>
			<p>
				This website was built using Vue.js, along with other free software tools.
				The server runs on Node.js and game data is stored at MongoDB Cloud.
				Real time synchronization between players is done with Socket.IO.
				Feel free to check
				<a href="https://github.com/cosmonautd/neochess" class="bold link">
					neochess at github</a>.
				The board is a fork from vue-chessboard, which is a wrapper for
				Chessground and chess.js. You can see the fork and its modifications
				<a href="https://github.com/cosmonautd/vue-chessboard" class="bold link">
					here</a>.
			</p>
			<div class="vertical-spacing-1"/>
			<p>
				Icons are from Icons8. Sound effects are from ZapSplat. Check out below 
				a list of the main resources used in neochess.</p>
			<div class="vertical-spacing-1"/>
			<a href="https://vuejs.org" class="card round-corners link">
				<div class="white"> Vue.js </div>
			</a>
			<a href="https://nodejs.org/en" class="card round-corners link">
				<div class="white"> Node.js </div>
			</a>
			<a href="https://www.mongodb.com/cloud" class="card round-corners link">
				<div class="white"> MongoDB Cloud </div>
			</a>
			<a href="https://socket.io" class="card round-corners link">
				<div class="white"> Socket.IO </div>
			</a>
			<a href="https://github.com/ornicar/chessground" class="card round-corners link">
				<div class="white"> Chessground </div>
			</a>
			<a href="https://github.com/jhlywa/chess.js" class="card round-corners link">
				<div class="white"> chess.js </div>
			</a>
			<a href="https://github.com/vitogit/vue-chessboard" class="card round-corners link">
				<div class="white"> vue-chessboard </div>
			</a>
			<a href="https://icons8.com" class="card round-corners link">
				<div class="white"> Icons8 </div>
			</a>
			<a href="https://www.zapsplat.com" class="card round-corners link">
				<div class="white"> ZapSplat </div>
			</a>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: "neochess-landing",
	methods: {
		landingPage() {
			this.$router.push({name: 'landing'});
		}
	}
}
</script>

<style scoped>
.link {
	text-decoration: none;
	cursor: pointer;
}
.content {
	text-align: justify;
}
.bold {
	font-weight: bold;
}
.card {
	background-color: #222;
	margin: 0.25em 0.25em 0.25em 0.25em;
	display: inline-block;
	padding: 1em 1.5em 1em 1.5em;
	cursor: pointer;
	display: inline-block;
}
.white {
	color: #FFF
}
</style>