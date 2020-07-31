<template>
<div id="game-list">
	<p v-if="games.length < 1" class="empty-table">
		No games
	</p>
	<table v-else border="0px">
		<!-- <thead>
			<tr>
				<th>Opponent</th>
				<th>Time Control</th>
				<th></th>
			</tr>
		</thead> -->
		<tbody>
			<tr v-for="game in games" :key="game.gameId">
				<td>{{ game.username }}</td>
				<td>{{ game.timeControl }}</td>
				<td>
					<button @click="joinGame(game.gameId)">
						Join
					</button>
				</td>
			</tr>
			<br>
		</tbody>
	</table>
</div>
</template>

<script>
export default {
	name: "game-list",
	props: {
		games: Array
	},
	data() {
		return {
		}
	},
	methods: {
		joinGame(id) {
			this.$router.push({ name: 'game', params: {gameId: id}});
		}
	}
}
</script>

<style scoped>
button {
	margin: 0 0.5em 0 0;
}
th {
	text-align: center;
	border-bottom: 0px;
	background-color: #0366ee;
}
td {
	text-align: center;
	border-bottom: 0px;
	background-color: #333;
	opacity: 0.7;
}
table {
	border-collapse: separate; 
	border-spacing: 0 1em;
}
</style>