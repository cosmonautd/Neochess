<template>
<div id="neochess-about">
	<div class="container-fluid">
		<div class="vertical-spacing-1"></div>
		<div class="vertical-spacing-top"/>
		<a href="." class="link" style="display: inline-block">
			<h1 class="neochess-title">neochess</h1>
		</a>
		<p>
			The minimalistic chess server.
			No accounts, no ratings, just the game.
		</p>
		<div class="vertical-spacing-4"/>
		<div class="content">
			<p>
				I challenged myself to code a chess server in one week and this is the result.
				To do this, I had to focus on what really matters, the game itself. There are
				no accounts, usernames are auto-generated. Only the players themselves can
				access the game link, but adding the possibility of watching games is
				something I'm planning to do. There may be bugs in the current implementation.
				If you find some, you can let me known by sending an email to david@raiz.dev.

			</p>
			<div class="vertical-spacing-1"/>
			<p>
				This website was built using Vue.js, along with other free software tools.
				The server runs on Node.js and game data is stored at MongoDB Cloud.
				Feel free to check the source code at
				<a href="https://github.com/cosmonautd/neochess" class="bold link">github</a>.
				The board component used in neochess is a fork from vue-chessboard, which is
				a wrapper for chessground and chess.js. You can see the fork and its modifications here.
				Icons are from Icons8. Sound effects are from ZapSplat.
			</p>
			<div class="vertical-spacing-1"/>
			https://vuejs.org/
			https://nodejs.org/en/
			https://www.mongodb.com/cloud
			https://github.com/vitogit/vue-chessboard
			https://github.com/ornicar/chessground
			https://github.com/jhlywa/chess.js
			https://github.com/cosmonautd/vue-chessboard
			https://icons8.com/
			https://www.zapsplat.com/
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: "neochess-landing"
}
</script>

<style scoped>
h1 {
	color: white
}
.link {
	text-decoration: none;
}
.content {
	text-align: left;
}
.bold {
	font-weight: bold;
}
</style>