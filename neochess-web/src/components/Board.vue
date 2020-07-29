<script>
import {chessboard} from './vue-chessboard'
export default {
	name: "neochess-board",
	extends: chessboard,
	methods: {
		playerMove() {
			return (orig, dest) => {
				if (this.isPromotion(orig, dest)) {
					this.promoteTo = this.onPromotion()
				}
				this.game.move({from: orig, to: dest, promotion: this.promoteTo})
				this.board.set({
					fen: this.game.fen()
				})
				this.calculatePromotions()
				const data = {
					username: this.$store.state.username,
					game_id: this.$store.state.game.params.game_id,
					move: {from: orig, to: dest, promotion: this.promoteTo},
					fen: this.game.fen()
				};
				this.$socket.emit('move', data);
			};
		},
	},
	sockets: {
		listener: {
			move: function (data) {
				this.game.move(data.move);
				this.board.set({
					fen: data.fen,
					turnColor: this.toColor(),
					movable: {
						color: this.player,
						dests: this.possibleMoves(),
						events: { after: this.playerMove()},
					},
					lastMove: [data.move.from, data.move.to]
				});
			}
		}
	},
	mounted() {
		if (this.player == 'white') {
			this.board.set({
				movable: { events: { after: this.playerMove()} },
			})
		}
	}
}
</script>