/* external dependencies */
const _ = require('lodash');
const check = require('express-validator');
const randomstring = require("randomstring");
const {MongoClient} = require('mongodb');

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
	}
}

/* start a new game */
const new_game = async (req, res) => {

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

module.exports = {
	validate,
	new_game
};