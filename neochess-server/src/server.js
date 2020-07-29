/* environment variables */
require('dotenv').config()

/* modules */
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const {MongoClient, ObjectId} = require('mongodb');

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
const port = process.env.NEOCHESS_SERVER_URL.split(':')[2]

/* */
const players = {};
io.on('connection', (socket) => {

	logger.log({
		level: 'info',
		message: `new user`
	});

	socket.join(socket.id);

	socket.on('disconnect', function (reason) {

		logger.log({
			level: 'info',
			message: `disconnected user`
		});

		socket.leave(socket.id);

	});

	socket.on('newGame', async (data) => {
		
		/* mongodb instance */
		const mongo_client = new MongoClient(process.env.NEOCHESS_DB_URI, {
			useUnifiedTopology: true
		});

		try {

			/* define a game */
			const random = Math.random();
			const orientation = random < 0.5 ? 'white' : 'black';
			const game = {
				white_username: orientation === 'white' ? utils.random_username() : null,
				black_username: orientation === 'black' ? utils.random_username() : null,
				fen: null,
				lastMove: null
			}

			/* connect to mongo db */
			await mongo_client.connect();

			/* create a game */
			const game_collection = mongo_client.db('neochessdb').collection('games_test');
			const result = await game_collection.insertOne(game);

			/* generate game parameters */
			const params = {
				game_id: result.insertedId,
				orientation,
				username: orientation === 'black' ? game.black_username : game.white_username,
				fen: null,
				lastMove: null
			}

			/* log the event */
			const loginfo = {game};
			logger.log({
				level: 'info',
				message: `new game ${log.dict2log(loginfo)}`
			});

			socket.join(params.game_id);

			/* return the game */
			io.to(socket.id).emit('newGame', {game: {params}});

			return;

		} catch (error) {

			console.log(error);
			socket.emit('newGame', {});

			return;

		} finally {

			await mongo_client.close();
		}
	});

	socket.on('joinGame', async (data) => {

		/* mongodb instance */
		const mongo_client = new MongoClient(process.env.NEOCHESS_DB_URI, {
			useUnifiedTopology: true
		});

		try {

			const {game_id} = data;

			/* connect to mongo db */
			await mongo_client.connect();

			/* search for the game using game_id */
			const game_collection = mongo_client.db('neochessdb').collection('games_test');
			let game = await game_collection.findOne({_id: new ObjectId(game_id)});

			if (game.white_username && game.black_username) {

				/* log the event */
				const loginfo = {game};
				logger.log({
					level: 'info',
					message: `join game attempt failed ${log.dict2log(loginfo)}`
				});

				/* return error */
				io.to(socket.id).emit('joinGame', {
					error: {
						code: 'COULD_NOT_JOIN',
						message: 'could not join'
					}
				});

				return;
			}

			const username = utils.random_username();
			const orientation = game.white_username ? 'black' : 'white';

			let update;
			if (orientation === 'white') update = {white_username: username}
			else if (orientation === 'black') update = {black_username: username}

			const result = await game_collection.findOneAndUpdate(
				{_id: new ObjectId(game_id)},
				{$set: update},
				{returnOriginal: false}
			);

			game = result.value

			/* generate game parameters */
			const params = {
				game_id: game._id,
				orientation,
				username,
				fen: game.fen,
				lastMove: game.lastMove
			}

			/* log the event */
			const loginfo = {game};
			logger.log({
				level: 'info',
				message: `join game ${log.dict2log(loginfo)}`
			});

			socket.join(params.game_id);

			/* return the game */
			io.to(socket.id).emit('joinGame', {game: {params}});

			return;

		} catch (error) {

			console.log(error);
			socket.emit('newGame', {
				error: {
					code: 'INTERNAL_SERVER_ERROR',
					message: 'internal server error'
				}
			});

			return;

		} finally {

			await mongo_client.close();
		}
	});

	socket.on('move', async (data) => {

		/* mongodb instance */
		const mongo_client = new MongoClient(process.env.NEOCHESS_DB_URI, {
			useUnifiedTopology: true
		});

		try {

			const { game_id, fen, move } = data;

			/* connect to mongo db */
			await mongo_client.connect();

			/* search for the game using game_id */
			const game_collection = mongo_client.db('neochessdb').collection('games_test');

			const update = { fen, lastMove: move };

			/* Update the game */
			const result = await game_collection.findOneAndUpdate(
				{_id: new ObjectId(game_id)},
				{$set: update},
				{returnOriginal: false}
			);

			const game = result.value;

			const logdata = {
				username: data.username, game_id: data.game_id,
				move: data.move
			}
			logger.log({
				level: 'info',
				message: `new move ${log.dict2log(logdata)}`
			});

			io.to(game_id).emit('move', data);

		} catch (error) {

			console.log(error);
			socket.emit('newGame', {
				error: {
					code: 'INTERNAL_SERVER_ERROR',
					message: 'internal server error'
				}
			});

		} finally {

			await mongo_client.close();
		}
	});
});

/* start the server */
server.listen(port, () => {
	logger.log({
		level: 'info',
		message: `neochess server started at port ${port}`
	});
});