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
		findCheckSquare() {
			const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
			if (this.game.in_check()) {
				var king = this.turn === 'w' ? 'K' : 'k';
				var ranks = this.game.fen().split(' ')[0].split('/');
				for (let i=0; i < ranks.length; i++) {
					const rank = ranks[i];
					const kingIndex = rank.indexOf(king);
					if (kingIndex > -1) {
					let kingFileIndex = 0;
					for (let j=0; j < kingIndex; j++)
						if (isNaN(rank[j])) kingFileIndex += 1;
						else kingFileIndex += parseInt(rank[j]);
						const kingRank = 8 - i;
						const kingFile = files[kingFileIndex];
						const kingCoordinate = `${kingFile}${kingRank}`
						return kingCoordinate;
					}
				}
			} else {
				return false;
			}
		}
	},
	sockets: {
		listener: {
			move: function (data) {
				this.game.move(data.move);
				this.board.set({
					fen: data.fen,
					turnColor: this.toColor(),
					check: this.findCheckSquare(),
					movable: {
						color: this.player,
						dests: this.possibleMoves(),
						events: { after: this.playerMove()},
					},
					lastMove: [data.move.from, data.move.to]
				});
				this.board.playPremove();
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