/* external dependencies */
const _ = require('lodash');
const check = require('express-validator');
const randomstring = require("randomstring");
const {MongoClient, ObjectId} = require('mongodb');

/* internal dependencies */
const log = require('../tools/log');
const utils = require('../tools/utils');
const status = require('../tools/status');

/* logger setup */
const logger = log.logger('game_controller');

/* validation methods */
const validate = (method) => {

	switch(method) {

		case 'new_game': {
			return []
		}

		case 'join_game': {
			return []
		}
	}
}

/* start a new game */
const new_game = async (req, res) => {

	/* mongodb instance */
	const mongo_client = new MongoClient(process.env.NEOCHESS_DB_URI, {
		useUnifiedTopology: true
	});

	try {

		/* validate inputs */
		const v_result = check.validationResult(req);
		if (utils.invalid(v_result))
			throw status.Exception('INPUT_ERROR', v_result.array());

		/* extract inputs */
		const {} = req.body;

		/* define a game */
		const random = Math.random();
		const orientation = random < 0.5 ? 'white' : 'black';
		const game = {
			white_username: orientation === 'white' ? utils.random_username() : null,
			black_username: orientation === 'black' ? utils.random_username() : null,
			fen: null
		}

		/* connect to mongo db */
		await mongo_client.connect();

		/* create a game */
		const game_collection = mongo_client.db('neochessdb').collection('games_test');
		const result = await game_collection.insertOne(game);

		/* generate game parameters */
		const params = {
			gameId: result.insertedId,
			orientation,
			username: orientation === 'black' ? game.black_username : game.white_username
		}

		/* log the event */
		const loginfo = {game};
		logger.log({
			level: 'info',
			message: `new game ${log.dict2log(loginfo)}`
		});

		/* return the game */
		return status.OK(res, {game: {params}});

	} catch (error) {

		console.log(error);
		return status.Error(res, error);

	} finally {

		await mongo_client.close();
	}
}

/* join a new game */
const join_game = async (req, res) => {

	/* mongodb instance */
	const mongo_client = new MongoClient(process.env.NEOCHESS_DB_URI, {
		useUnifiedTopology: true
	});

	try {

		/* validate inputs */
		const v_result = check.validationResult(req);
		if (utils.invalid(v_result))
			throw status.Exception('INPUT_ERROR', v_result.array());

		/* extract inputs */
		const {gameId} = req.body;

		/* connect to mongo db */
		await mongo_client.connect();

		/* search for the game using gameId */
		const game_collection = mongo_client.db('neochessdb').collection('games_test');
		let game = await game_collection.findOne({_id: new ObjectId(gameId)});

		if (game.white_username && game.black_username) {

			/* log the event */
			const loginfo = {game};
			logger.log({
				level: 'info',
				message: `join game attempt failed ${log.dict2log(loginfo)}`
			});

			/* return error */
			throw status.Exception('COULD_NOT_JOIN');
		}

		const username = utils.random_username();
		const orientation = game.white_username ? 'black' : 'white';

		let update;
		if (orientation === 'white') update = {white_username: username}
		else if (orientation === 'black') update = {black_username: username}

		const result = await game_collection.findOneAndUpdate(
			{_id: new ObjectId(gameId)},
			{$set: update},
			{returnOriginal: false}
		);

		game = result.value

		/* generate game parameters */
		const params = {
			gameId: game._id,
			orientation,
			username
		}

		/* log the event */
		const loginfo = {game};
		logger.log({
			level: 'info',
			message: `join game ${log.dict2log(loginfo)}`
		});

		/* return the game */
		return status.OK(res, {game: {params}});

	} catch (error) {

		return status.Error(res, error);

	} finally {

		await mongo_client.close();
	}
}

module.exports = {
	validate,
	new_game,
	join_game
};