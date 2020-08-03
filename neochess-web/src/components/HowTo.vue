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
				When you enter neochess, you receive a random username. For example,
				currently you are connected as
				<span class="bold">{{this.$store.state.username}}</span>.
				You have the option to start a 
				game or join an already existing one. When you start a game and enter 
				the game room, you have two choices:
			</p>
			<div class="vertical-spacing-1"/>
			<ol>
				<li>
					You can share the game url with a friend.
				</li>
				<li>You can wait for someone else to join your game.</li>
			</ol>
			<p>
				Since neochess is not well known yet, it may take forever for someone to
				see and join your game. So, for now, it is recommended that you share the
				url with a friend or invite him to neochess.
				Created games will be available to join in the front page.
				A warning: after someone joins your game, no one else will be able to use 
				the url again, not even you or your opponent. If you close a game, that 
				game will not be accessible anymore. Keep that in mind.
			</p>
			<div class="vertical-spacing-1"/>
			<p>
				The timers start after black plays its first move. From there, only the
				gods of chess know what will happen. You can move by clicking on the 
				origin and destination squares or by just dragging and dropping pieces.
				You can see past moves by pressing the arrow keys in you keyboard: left
				shifts back, right shifts forward, down resets to the beginning and up 
				returns to the last position.
			</p>
			<div class="vertical-spacing-1"/>
			<p>
				That's it. Let's play some chess!
			</p>
			<div class="vertical-spacing-2"/>
			<div style="text-align: right">
				<p> David Borges </p>
				<p>
					<a href="mailto:david@raiz.dev" class="bold link">david@raiz.dev</a>
				</p>
			</div>
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
</style>