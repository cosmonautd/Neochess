/* Environment variables */
require('dotenv').config()

/* External dependencies */
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const {MongoClient, ObjectId} = require('mongodb');
const _ = require('lodash');
const chessjs = require('chess.js');

/* Internal dependencies */
const log = require('./tools/log');
const utils = require('./tools/utils');

/* Configure logger */
const logger = log.logger('Server');

/* Configure express and socket.io */
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

/* Configure cors */
app.use(cors());

/* Get JSON body from requests */
app.use(express.json());

/* Configure routes */
const routes = require('./routes');
app.use(routes);

/* Get port from .env */
const port = process.env.NEOCHESS_SERVER_URL.split(':')[2];

/* MongoDB instance */
const mongo = new MongoClient(process.env.NEOCHESS_DB_URI, {
	useUnifiedTopology: true
});

/* Connect to MongoDB */
let gameCollection;
mongo.connect().then(() => {
	gameCollection = mongo.db('neochessdb').collection('games_test');
	logger.log({
		level: 'info',
		message: `Connected to MongoDB Cloud`
	});
});

/* Server memory
**
** users: maps a socket id to a username
** sockets: maps a username to a socket id
** timers: holds a timer for each pair (username, game id)
** timesync: holds a time sync schedule for each game
** currentGameId: maps a username to his current game
** joinableGames: holds an array of games still waiting for an opponent to join
*/

let users = {};
let sockets = {};
let timers = {};
let timesync = {};
let currentGameId = {};
let joinableGames = [];

/* Available time controls */
const seconds = {
	'1+0': 60,
	'3+0': 60*3,
	'5+0': 60*5,
	'10+0': 60*10,
	'15+0': 60*15,
	'30+0': 60*30,
}

/**
 * Emits the gameOver event to a game room and clears corresponding timers.
 * @param {String} gameId Id from the game that just finished.
 * @param {String} player1 Username of the first player.
 * @param {String} player2 Username of the second player.
 * @param {Object} resultData Object containing {result, winner}.
 */
const gameOver = (gameId, player1, player2, resultData) => {
	/* Emits gameOver event to the game room */
	io.to(gameId).emit('gameOver', resultData);
	/* Stops time counting for both players */
	if (timers[player1+gameId].loop) {
		clearInterval(timers[player1+gameId].loop);
		timers[player1+gameId].loop = null;
	}
	if (timers[player2+gameId].loop) {
		clearInterval(timers[player2+gameId].loop);
		timers[player2+gameId].loop = null;
	}
	/* Stops time sync for the game room */
	if (timesync[gameId])
		clearInterval(timesync[gameId]);
}

const createGame = async (game) => {
	const result = await gameCollection.insertOne(game);
	return {...game, ...{_id: result.insertedId}};
}

const getGame = async (gameId) => {
	return await gameCollection.findOne({_id: new ObjectId(gameId)});
}

const updateGame = async (gameId, update) => {
	const result = await gameCollection.findOneAndUpdate(
		{_id: new ObjectId(gameId)},
		{$set: update},
		{returnOriginal: false}
	);
	return result.value;
}

/**
 * Socket.io event handling
 * 
 */

io.on('connection', (socket) => {

	socket.on('username', function (data) {

		try {

			if (!data.username) {

				/* Generates username */
				const username = utils.random_username();
	
				/* New user joins a private room and the username is emitted back */
				socket.join(username+socket.id);
				socket.emit('username', {username});
	
				/* Saves user in memory */
				users[socket.id] = username;
				sockets[username] = socket.id;
	
				/* Event is logged */
				logger.log({
					level: 'info',
					message: `User connected: ${username}`
				});
	
			} else {
	
				/* Sets username */
				const username = data.username;
	
				/* User joins a private room again */
				socket.join(username+socket.id);
	
				/* Updates user in memory */
				users[socket.id] = username;
				sockets[username] = socket.id;

				/* Reconnects the user to the game */
				if (currentGameId[username]) {
					const gameId = currentGameId[username];
					socket.join(gameId);
				}
	
				/* Event is logged */
				logger.log({
					level: 'info',
					message: `User reconnected: ${username}`
				});
			}

		} catch (error) {

			console.log(error);
		}
	});

	socket.on('disconnect', function (reason) {

		try {

			/* Gets username based on socket id */
			const username = users[socket.id];

			/* Removes user from memory */
			delete users[socket.id];
			delete sockets[username];

			/* User leaves all rooms */
			socket.leaveAll();

			/* Event is logged */
			logger.log({
				level: 'info',
				message: `User disconnected: ${username}`
			});

		} catch (error) {

			console.log(error);
		}
	});

	socket.on('getGames', async () => {

		try {

			const username = users[socket.id];
			socket.emit('gamesList', {
				games: joinableGames.filter(g => g.host !== username)
			});

		} catch (error) {

			console.log(error);
		}

	});

	socket.on('newGame', async (data) => {

		try {

			/* Defines a game */
			const random = Math.random();
			const orientation = random < 0.5 ? 'white' : 'black';
			const username = users[socket.id];

			// let game = {
			// 	whiteUsername: orientation === 'white' ? username : null,
			// 	blackUsername: orientation === 'black' ? username : null,
			// 	timeControl: data.timeControl,
			// 	fen: null,
			// 	lastMove: null,
			// 	pgn: new chessjs.Chess().pgn(),
			// 	started: false
			// }

			let game = {
				host: username,
				guest: null,
				players: {
					white: {
						username: orientation === 'white' ? username : null
					},
					black: {
						username: orientation === 'black' ? username : null
					}
				},
				timeControl: {
					minutes: parseInt(data.timeControl.split('+')[0]),
					increment: parseInt(data.timeControl.split('+')[1]),
					string: data.timeControl
				},
				state: {
					fen: new chessjs.Chess().fen(),
					joinable: true,
					started: false,
					lastMove: null
				},
				history: {
					pgn: new chessjs.Chess().pgn()
				}
			}

			/* Creates a game */
			game = await createGame(game);
			const gameId = game._id;

			timesync[gameId] = null;

			/* Generates game parameters */
			const params = {
				gameId,
				orientation,
				username,
				opponent: null,
				timeControl: game.timeControl.string,
				fen: game.state.fen,
				lastMove: game.state.lastMove
			};

			/* User leaves previous game */
			socket.leave(currentGameId[username]);
			if (timers[username+gameId]) {
				if (timers[username+gameId].loop){
					clearInterval(timers[username+gameId].loop);
					timers[username+gameId].loop = null;
				}
			}

			/* User joins the new game room */
			socket.join(gameId);
			currentGameId[username] = gameId;

			/* Game parameters are emitted to the user */
			io.to(gameId).emit('gameCreated', {game: {params}});

			/* A timer is assigned to the user for this game */
			timers[username+gameId] = {
				loop: null,
				time: seconds[params.timeControl]
			};

			/* Set game as joinable */
			joinableGames.push({
				host: username,
				timeControl: params.timeControl,
				gameId: gameId},
			);

			/**
			 * Broadcasts the updated list of joinable games.
			 * TODO: It's better to emit user-specific joinable games, to avoid frontend
			 * filtering. After all, a user should not join a game against himself.
			 */
			io.emit('gamesList', {games: joinableGames});

			/* Event is logged */
			const loginfo = {
				gameId,
				host: game.host, 
				timeControl: game.timeControl.string
			};
			logger.log({
				level: 'info',
				message: `Game created ${log.dict2log(loginfo)}`
			});

			/* Just to be safe, returns */
			return;

		} catch (error) {

			/* Logs the error, emits the error */
			console.log(error);
			socket.emit('gameCreated', {
				error: {
					code: 'INTERNAL_SERVER_ERROR',
					message: 'internal server error'
				}
			});

			return;

		}
	});

	socket.on('joinGame', async (data) => {

		try {

			/* Gets id from the game to be joined */
			const { gameId } = data;

			/* Gets username */
			const username = users[socket.id];

			/* Searches for the game using gameId */
			let game = await getGame(gameId);

			if (!game.state.joinable || game.host === username) {

				/* Returns COULD_NOT_JOIN error */
				io.to(socket.id).emit('gameJoined', {
					error: {
						code: 'COULD_NOT_JOIN',
						message: 'could not join'
					}
				});

				/* Event is logged */
				const loginfo = {
					username, gameId,
					white: game.players.white.username,
					black: game.players.black.username
				};
				logger.log({
					level: 'info',
					message: `Failed join attempt: ${log.dict2log(loginfo)}`
				});

				return;
			}

			/* Defines new player orientation and opponent */
			const orientation = game.players.white.username ? 'black' : 'white';
			const opponentOrientation = orientation === 'black' ? 'white' : 'black';

			/**
			 * Generates info to update the game in the database
			 * Also defines opponent
			 */
			let update;
			let opponent;
			if (orientation === 'white') {
				update = {'players.white.username': username};
				opponent = game.players.black.username;
			} 
			else if (orientation === 'black') {
				update = {'players.black.username': username};
				opponent = game.players.white.username;
			}
			update.guest = username;

			/* Updates the game in the database */
			game = await updateGame(gameId, update);

			/* Generate game parameters */
			const params = {
				gameId: game._id,
				orientation,
				username,
				opponent,
				timeControl: game.timeControl.string,
				fen: game.state.fen,
				lastMove: game.state.lastMove
			};

			/* User joins the game room */
			socket.join(gameId);
			currentGameId[username] = gameId;

			/* Game parameters are emitted to the user */
			io.to(socket.id).emit('gameJoined', {game: {params}});

			/* Emits update game event to opponent */
			io.to(opponent+sockets[opponent]).emit('updateGame', {
				game: {
					params: {
						gameId: game._id,
						orientation: opponentOrientation,
						username: opponent,
						opponent: username,
						fen: game.state.fen,
						lastMove: game.state.lastMove
					}
				}
			});

			/* A timer is assigned to the joining user for this game */
			timers[username+gameId] = {
				loop: null,
				time: seconds[params.timeControl]
			};

			/* Starts emittings timesync events */
			timesync[gameId] = setInterval(() => {
				let sync = {};
				const whiteUsername = game.players.white.username;
				const blackUsername = game.players.black.username;
				sync.gameId = gameId;
				sync[whiteUsername] = timers[whiteUsername+gameId].time;
				sync[blackUsername] = timers[blackUsername+gameId].time;
				io.to(gameId).emit('timesync', sync);
			}, 500);

			/* If game is joined, removes it from array of joinable games */
			joinableGames = joinableGames.filter(g => g.gameId.toString() != gameId);

			/**
			 * Broadcasts the updated list of joinable games.
			 * TODO: It's better to emit user-specific joinable games, to avoid frontend
			 * filtering. After all, a user should not join a game against himself.
			 */
			io.emit('gamesList', {games: joinableGames});

			/* Event is logged */
			const loginfo = {
				gameId,
				host: game.host, guest: game.guest,
				timeControl: game.timeControl.string
			};
			logger.log({
				level: 'info',
				message: `Game joined ${log.dict2log(loginfo)}`
			});

			return;

		} catch (error) {

			/* Logs the error, emits the error */
			console.log(error);
			socket.emit('gameJoined', {
				error: {
					code: 'INTERNAL_SERVER_ERROR',
					message: 'internal server error'
				}
			});

			return;

		}
	});

	socket.on('move', async (movedata) => {

		try {

			/* Gets gameId, fen and move from movedata*/
			const { username, gameId, fen, move } = movedata;

			let game = await getGame(gameId);

			/* Generates a game representation */
			let gameRepresentation = new chessjs.Chess();
			gameRepresentation.load_pgn(game.history.pgn);
			gameRepresentation.move(move);

			/* Updates the game */
			const update = {
				'state.fen': gameRepresentation.fen(),
				'state.lastMove': move,
				'history.pgn': gameRepresentation.pgn()
			};
			game = await updateGame(gameId, update);

			/* Logs the event */
			const logdata = { username, gameId, move };
			logger.log({
				level: 'info',
				message: `New move ${log.dict2log(logdata)}`
			});

			/* TODO: The following could be improved. I believe only one event needs to
			** be emitted. Keeping this way for now to avoid breaking other functions */

			const blackUsername = game.players.black.username;
			const whiteUsername = game.players.white.username;
			const opponent = username === whiteUsername ? blackUsername : whiteUsername;
			const orientation = username === whiteUsername ? 'white' : 'black';

			/* Emits move to the game room */
			io.to(gameId).emit('moved', movedata);

			/* Stops the player's timer */
			if (timers[username+gameId].loop) {
				clearInterval(timers[username+gameId].loop);
				timers[username+gameId].loop = null;
			}

			/* Starts timers only after black plays its first move */
			if (orientation === 'black' || game.started) {
				/* Starts opponent's timer */
				timers[opponent+gameId] = {
					loop: setInterval(async () => {
						const t = timers[opponent+gameId].time;
						timers[opponent+gameId].time = Math.max(-1, t - 1);
						if(timers[opponent+gameId].time <= -1) {
							/* TODO: draw if player has insufficient material
							** For now, if the time is over, the other player wins...
							*/
							const resultData = {
								result: 'ontime',
								winner: username
							};
							gameOver(gameId, username, opponent, resultData);
						};
					}, 1000),
					time: timers[opponent+gameId].time
				};
				/* Game is set as started only after black plays */
				game = await updateGame(gameId, {started: true});
			}

			/* Emits updateGame event to black */
			io.to(blackUsername+sockets[blackUsername]).emit('updateGame', {
				game: {
					params: {
						gameId: gameId,
						orientation: 'black',
						username: blackUsername,
						opponent: whiteUsername,
						fen: game.state.fen,
						lastMove: game.state.lastMove
					}
				}
			});

			/* Emits updateGame event to white */
			io.to(whiteUsername+sockets[whiteUsername]).emit('updateGame', {
				game: {
					params: {
						gameId: gameId,
						orientation: 'white',
						username: whiteUsername,
						opponent: blackUsername,
						fen: game.state.fen,
						lastMove: game.state.lastMove
					}
				}
			});

			/* Logs the game is ascii */
			console.log(gameRepresentation.ascii());

			/* Detects if the game is over and determines the result */
			if (gameRepresentation.game_over()) {

				let result;
				let winner = null;

				if (gameRepresentation.in_checkmate()) {

					result = 'checkmate';
					winner = username

				} else {

					if (gameRepresentation.in_draw()) {
						if (gameRepresentation.in_stalemate())
							result = 'draw.stalemate';
						else if (gameRepresentation.in_threefold_repetition())
							result = 'draw.threefold_repetition';
						else if (gameRepresentation.insufficient_material())
							result = 'draw.insufficient_material';
					}
				}

				const resultData = {result, winner};
				gameOver(gameId, username, opponent, resultData);
			}

			return;

		} catch (error) {

			/* Logs the error */
			console.log(error);

		}
	});
});

/* Starts the server */
server.listen(port, () => {
	logger.log({
		level: 'info',
		message: `Online at port ${port}`
	});
});