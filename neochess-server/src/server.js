/* environment variables */
require('dotenv').config()

/* modules */
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const {MongoClient, ObjectId} = require('mongodb');
const _ = require('lodash');
const chessjs = require('chess.js');

/* configure express and socket.io */
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const utils = require('./tools/utils');

/* configure logger */
const log = require('./tools/log');
const logger = log.logger('server');

/* configure cors */
app.use(cors());

/* get JSON body */
app.use(express.json());

/* configure routes */
const routes = require('./routes');
app.use(routes);

/* get port from .env */
const port = process.env.NEOCHESS_SERVER_URL.split(':')[2];

/* MongoDB instance */
const mongo = new MongoClient(process.env.NEOCHESS_DB_URI, {
	useUnifiedTopology: true
});

/* Connect to MongoDB */
mongo.connect().then(() => {
	logger.log({
		level: 'info',
		message: `Neochess server is connected to MongoDB Cloud`
	});
});

/* */
let users = {};
let sockets = {};
let games = {};
let gameIds = {};
let timers = {};
let timerStarted = {};
let activeGames = [];

const TIME_CONTROL = 180;

const gameOver = (gameId, username, opponent, resultData) => {
	/* Emit game over signal to the game room */
	io.to(gameId).emit('gameOver', resultData);
	/* Stop time counting for both players */
	if (timers[username+gameId].loop) {
		clearInterval(timers[username+gameId].loop);
		timers[username+gameId].loop = null;
	}
	if (timers[opponent+gameId].loop) {
		clearInterval(timers[opponent+gameId].loop);
		timers[opponent+gameId].loop = null;
	}
	/* Stop time sync for the game room */
	if (games[gameId].timesync)
		clearInterval(games[gameId].timesync);
}

io.on('connection', (socket) => {

	socket.on('username', function (data) {

		try {

			if (!data.username) {

				/* Generate username */
				const username = utils.random_username();
	
				/* New user joins a private room and the username is emitted back */
				socket.join(username+socket.id);
				socket.emit('username', {username});
	
				/* Save user in memory */
				users[socket.id] = username;
				sockets[username] = socket.id;
	
				/* Event is logged */
				logger.log({
					level: 'info',
					message: `User connected: ${username}`
				});
	
			} else {
	
				/* Set username */
				const username = data.username;
	
				/* User joins a private room again */
				socket.join(username+socket.id);
	
				/* Update user in memory */
				users[socket.id] = username;
				sockets[username] = socket.id;

				/* Reconnects the user to the game */
				if (gameIds[username]) {
					const gameId = gameIds[username];
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

			/* Remove user from memory */
			const username = users[socket.id];
			delete users[socket.id];
			delete sockets[username];

			/* User leaves all rooms */
			socket.leaveAll();

			/* Log the event */
			logger.log({
				level: 'info',
				message: `User disconnected: ${username}`
			});

		} catch (error) {

			console.log(error);
		}
	});

	socket.on('getGames', async (data) => {

		socket.emit('gamesList', {games: activeGames});

	});

	socket.on('newGame', async (data) => {

		try {

			/* Define a game */
			const random = Math.random();
			const orientation = random < 0.5 ? 'white' : 'black';
			const username = users[socket.id];
			const game = {
				whiteUsername: orientation === 'white' ? username : null,
				blackUsername: orientation === 'black' ? username : null,
				fen: null,
				lastMove: null
			}

			/* Create a game */
			const gameCollection = mongo.db('neochessdb').collection('games_test');
			const result = await gameCollection.insertOne(game);
			const gameId = result.insertedId

			games[gameId] = {
				game: new chessjs.Chess(),
				timesync: null
			}

			/* Generate game parameters */
			const params = {
				gameId,
				orientation,
				username,
				opponent: null,
				fen: null,
				lastMove: null
			};

			/* User leaves previous game */
			socket.leave(gameIds[username]);
			if (timers[username+params.gameId]) {
				if (timers[username+params.gameId].loop){
					clearInterval(timers[username+gameId].loop);
					timers[username+params.gameId].loop = null;
				}
			}

			/* User joins the new game room */
			socket.join(params.gameId);
			gameIds[username] = params.gameId;

			/* Game parameters are emitted to the user */
			io.to(params.gameId).emit('gameCreated', {game: {params}});

			timers[username+params.gameId] = {
				loop: null,
				time: TIME_CONTROL
			};

			/* Save game to active games in memory */
			activeGames.push(
				{username, timeControl: '3+0', gameId: params.gameId},
			);

			io.emit('gamesList', {games: activeGames});

			/* Log the event */
			const loginfo = {game};
			logger.log({
				level: 'info',
				message: `New game ${log.dict2log(loginfo)}`
			});

			/* Just to be safe, return */
			return;

		} catch (error) {

			/* Log the error, emit error */
			console.log(error);
			socket.emit('gameCreated', {
				error: {
					code: 'INTERNAL_SERVER_ERROR',
					message: 'internal server error'
				}
			});

			return;

		} finally {

			// /* Close MongoDB instance */
			// await mongo.close();
		}
	});

	socket.on('joinGame', async (data) => {

		try {

			/* Get id from the game to be joined */
			const { gameId } = data;

			/* Get username */
			const username = users[socket.id];

			/* Search for the game using gameId */
			const gameCollection = mongo.db('neochessdb').collection('games_test');
			let game = await gameCollection.findOne({_id: new ObjectId(gameId)});

			if (game.whiteUsername && game.blackUsername) {

				/* Return COULD_NOT_JOIN error */
				io.to(socket.id).emit('gameJoined', {
					error: {
						code: 'COULD_NOT_JOIN',
						message: 'could not join'
					}
				});

				/* Log the event */
				const loginfo = {
					username, gameId,
					white: game.whiteUsername, black: game.blackUsername
				};
				logger.log({
					level: 'info',
					message: `Failed join attempt: ${log.dict2log(loginfo)}`
				});

				return;
			}

			/* Define new player orientation and opponent */
			const orientation = game.whiteUsername ? 'black' : 'white';
			const opponentOrientation = game.whiteUsername ? 'white' : 'black';

			/* Generate info to update the game in the database
			** Also define opponent */
			let update;
			let opponent;
			if (orientation === 'white') {
				update = {whiteUsername: username};
				opponent = game.blackUsername;
			} 
			else if (orientation === 'black') {
				update = {blackUsername: username};
				opponent = game.whiteUsername;
			}

			/* Update the game in the database */
			const result = await gameCollection.findOneAndUpdate(
				{_id: new ObjectId(gameId)},
				{$set: update},
				{returnOriginal: false}
			);

			/* Get updated game */
			game = result.value;

			/* Generate game parameters */
			const params = {
				gameId: game._id,
				orientation,
				username,
				opponent,
				fen: game.fen,
				lastMove: game.lastMove
			};

			/* User joins the game room */
			socket.join(params.gameId);
			gameIds[username] = params.gameId;

			/* Game parameters are emitted to the user */
			io.to(socket.id).emit('gameJoined', {game: {params}});

			/* Emit update game signal to opponent */
			io.to(opponent+sockets[opponent]).emit('updateGame', {
				game: {
					params: {
						gameId: game._id,
						orientation: opponentOrientation,
						username: opponent,
						opponent: username,
						fen: game.fen,
						lastMove: game.lastMove
					}
				}
			});

			timers[username+gameId] = {
				loop: null,
				time: TIME_CONTROL
			};

			games[gameId].timesync = setInterval(() => {
				/* Emit time sync signals */
				let sync = {};
				const whiteUsername = game.whiteUsername;
				const blackUsername = game.blackUsername;
				sync.gameId = gameId;
				sync[whiteUsername] = timers[whiteUsername+gameId].time;
				sync[blackUsername] = timers[blackUsername+gameId].time;
				io.to(params.gameId).emit('timesync', sync);
			}, 500);

			/* If join game, game is not active to join anymore */
			activeGames = activeGames.filter(g => g.gameId.toString() != gameId);
			io.emit('gamesList', {games: activeGames});

			/* Log the event */
			const loginfo = {game};
			logger.log({
				level: 'info',
				message: `Join game ${log.dict2log(loginfo)}`
			});

			return;

		} catch (error) {

			/* Log the error, emit error */
			console.log(error);
			socket.emit('gameJoined', {
				error: {
					code: 'INTERNAL_SERVER_ERROR',
					message: 'internal server error'
				}
			});

			return;

		} finally {

			// /* Close MongoDB instance */
			// await mongo.close();
		}
	});

	socket.on('move', async (movedata) => {

		try {

			/* Get gameId, fen and move */
			const { username, gameId, fen, move } = movedata;

			/* Update game representation in memory */
			games[gameId].game.move(move);

			/* Search for the game using gameId */
			const gameCollection = mongo.db('neochessdb').collection('games_test');

			/* Update the game */
			const update = { fen, lastMove: move, pgn: games[gameId].game.pgn() };
			const result = await gameCollection.findOneAndUpdate(
				{_id: new ObjectId(gameId)},
				{$set: update},
				{returnOriginal: false}
			);

			/* Get updated game */
			const game = result.value;

			/* Log the event */
			const logdata = { username, gameId, move };
			logger.log({
				level: 'info',
				message: `New move ${log.dict2log(logdata)}`
			});

			/* TODO: This could be improved. I believe only one socket signal needs to
			** emitted. Keeping this way for now to avoid breaking other functions */

			const blackUsername = game.blackUsername;
			const whiteUsername = game.whiteUsername;
			const opponent = username === whiteUsername ? blackUsername : whiteUsername;
			const orientation = username === whiteUsername ? 'white' : 'black';

			/* Emit move to the game room */
			io.to(gameId).emit('moved', movedata);

			/* Stop decreasing player's time */
			if (timers[username+gameId].loop) {
				clearInterval(timers[username+gameId].loop);
				timers[username+gameId].loop = null;
			}

			/* Start timers after black plays first move */
			if (orientation === 'black' || timerStarted[gameId]) {
				/* Start decreasing opponent's time */
				timers[opponent+gameId] = {
					loop: setInterval(() => {
						const t = timers[opponent+gameId].time;
						timers[opponent+gameId].time = Math.max(-1, t - 1);
						if(timers[opponent+gameId].time <= -1) {
							/* TODO: draw if player has insufficient material
							** For now, if the time is over, the other player wins...
							*/
							const result = 'ontime';
							let winner = username;

							gameOver(gameId, username, opponent, {
								result,
								winner
							});
						};
						
					}, 1000),
					time: timers[opponent+gameId].time
				};
				timerStarted[gameId] = true;
			}

			/* Emit update game signal to black */
			io.to(blackUsername+sockets[blackUsername]).emit('updateGame', {
				game: {
					params: {
						gameId: game._id,
						orientation: 'black',
						username: blackUsername,
						opponent: whiteUsername,
						fen: game.fen,
						lastMove: game.lastMove
					}
				}
			});

			/* Emit update game signal to white */
			io.to(whiteUsername+sockets[whiteUsername]).emit('updateGame', {
				game: {
					params: {
						gameId: game._id,
						orientation: 'white',
						username: whiteUsername,
						opponent: blackUsername,
						fen: game.fen,
						lastMove: game.lastMove
					}
				}
			});

			/* Log the game is ascii */
			console.log(games[gameId].game.ascii());

			/* Detect if game is over and determine the result */
			if (games[gameId].game.game_over()) {

				let result;
				let winner = null;

				if (games[gameId].game.in_checkmate()) {

					result = 'checkmate';
					winner = username

				} else {

					if (games[gameId].game.in_draw()) {
						if (games[gameId].game.in_stalemate())
							result = 'draw.stalemate';
						else if (games[gameId].game.in_threefold_repetition())
							result = 'draw.threefold_repetition';
						else if (games[gameId].game.insufficient_material())
							result = 'draw.insufficient_material';
					}
				}

				gameOver(gameId, username, opponent, {
					result,
					winner
				});
			}

			return;

		} catch (error) {

			/* Log the error, emit error */
			console.log(error);
			socket.emit('newGame', {
				error: {
					code: 'INTERNAL_SERVER_ERROR',
					message: 'internal server error'
				}
			});

		} finally {

			// /* Close MongoDB instance */
			// await mongo.close();
		}
	});
});

/* start the server */
server.listen(port, () => {
	logger.log({
		level: 'info',
		message: `Neochess server is online at port ${port}`
	});
});