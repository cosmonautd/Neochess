<template>
<div id="neochess-about" class="small-container">
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
				Do this.
			</p>
			<div class="vertical-spacing-1"/>
			<p>
				Do that.
			</p>
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
.link {
	text-decoration: none;
}
.content {
	text-align: justify;
}
.bold {
	font-weight: bold;
}
</style>