<script>
import {chessboard} from './vue-chessboard'
export default {
	name: "neochess-board",
	extends: chessboard,
	methods: {
		userPlay() {
			return (orig, dest) => {
				if (this.isPromotion(orig, dest)) {
					this.promoteTo = this.onPromotion()
				}
				this.game.move({from: orig, to: dest, promotion: this.promoteTo})
				this.board.set({
					fen: this.game.fen()
				})
				this.calculatePromotions()
				this.aiNextMove()
			};
		},
		aiNextMove() {
			let moves = this.game.moves({verbose: true})
			let randomMove = moves[Math.floor(Math.random() * moves.length)]
			this.game.move(randomMove)

			this.board.set({
				fen: this.game.fen(),
				turnColor: this.toColor(),
				movable: {
					color: this.toColor(),
					dests: this.possibleMoves(),
					events: { after: this.userPlay()},
				}
			});
		},
	},
	mounted() {
		if (this.player == 'white') {
			this.board.set({
				movable: { events: { after: this.userPlay()} },
			})
		} else {
			this.aiNextMove()
		}
	}
}
</script>