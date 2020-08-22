<template>
<div id="game-list">
	<p v-if="games.length < 1" class="empty-table">
		No games
	</p>
	<table v-else class="neochess-table">
		<tbody>
			<tr v-for="game in games" :key="game.gameId">
				<td style="width:60%" class="left-round-corners">{{ game.host }}</td>
				<td>{{ game.timeControl }}</td>
				<td class="right-round-corners">
					<button @click="joinGame(game.gameId)" class="round-corners">
						{{action}}
					</button>
				</td>
			</tr>
		</tbody>
	</table>
</div>
</template>

<script>
export default {
	name: "game-list",
	props: {
		games: Array,
		action: String
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
	width: 6em;
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
.left-round-corners {
	border-radius: 15px 0px 0px 15px;
}
.right-round-corners {
	border-radius: 0px 15px 15px 0px;
}
.neochess-table {
	margin-bottom: -1em;
}
</style>