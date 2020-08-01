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
					fen: this.game.fen(),
					check: this.findCheckSquare(this.player),
					movable: {
						color: this.player,
						dests: this.possibleMoves(),
						events: { after: this.playerMove()},
					},
					lastMove: [orig, dest]
				})
				this.calculatePromotions();
				const movedata = {
					username: this.$store.state.username,
					player: this.player,
					gameId: this.$store.state.game.params.gameId,
					move: {from: orig, to: dest, promotion: this.promoteTo},
					fen: this.game.fen()
				};
				this.$socket.emit('move', movedata);
			};
		},
		findCheckSquare(lastMovePlayer) {
			const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
			if (this.game.in_check()) {
				var king = lastMovePlayer === 'black' ? 'K' : 'k';
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
			moved: function (movedata) {
				if (movedata.username != this.$store.state.username) {
					this.game.move(movedata.move);
					this.board.set({
						fen: movedata.fen,
						turnColor: this.toColor(),
						check: this.findCheckSquare(movedata.player),
						movable: {
							color: this.player,
							dests: this.possibleMoves(),
							events: { after: this.playerMove()},
						},
						lastMove: [movedata.move.from, movedata.move.to]
					});
					this.calculatePromotions();
				}

				let capture = false;
				const history = this.game.history({verbose: true});
				if (history.length > 1) {
					console.log('history:', history);
					capture = history[history.length - 1].captured ? true : false;
				}
				else capture = false;

				if (!this.game.in_check()) {
					if (capture) this.$sounds.get('capture').play();
					else this.$sounds.get('move').play();
				}
				
				this.board.playPremove();
			},
			updateGame: function(data) {
				if (data.game) {
					this.$store.commit('update_game', data.game);
					if (this.game.in_check()) this.$sounds.get('check').play();
				}
			},
			gameOver: function() {
				this.board.set({
					viewOnly: true
				});
			}
		}
	},
	mounted() {
		if (this.$store.state.status.code === 'over') {
			this.board.set({
				viewOnly: true
			});
		}
		if (this.player == 'white') {
			if (!this.$store.state.game.params.fen) {
				this.board.set({
					movable: { events: { after: this.playerMove()} },
				});
			} else {
				this.game.load(this.$store.state.game.params.fen);
				this.board.set({
					fen: this.game.fen(),
					turnColor: this.toColor(),
					check: this.findCheckSquare(),
					movable: {
						color: this.player,
						dests: this.possibleMoves(),
						events: { after: this.playerMove()},
					},
					lastMove: this.$store.state.game.params.lastMove ? [
							this.$store.state.game.params.lastMove.from,
							this.$store.state.game.params.lastMove.to
					] : null
				});
			}
		}
		if (this.player == 'black') {
			if (this.$store.state.game.params.fen) {
				this.game.load(this.$store.state.game.params.fen);
				this.board.set({
					fen: this.game.fen(),
					turnColor: this.toColor(),
					check: this.findCheckSquare(),
					movable: {
						color: this.player,
						dests: this.possibleMoves(),
						events: { after: this.playerMove()},
					},
					lastMove: this.$store.state.game.params.lastMove ? [
							this.$store.state.game.params.lastMove.from,
							this.$store.state.game.params.lastMove.to
					] : null
				});
			}
		}
	}
}
</script>