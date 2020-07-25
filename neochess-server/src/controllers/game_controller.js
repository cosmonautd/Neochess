/* external dependencies */
const _ = require('lodash');
const check = require('express-validator');

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

	try {

		/* validate inputs */
		const result = check.validationResult(req);
		if (utils.invalid(result)) throw status.Exception('INPUT_ERROR', result.array());

		/* extract inputs */
		const { username } = req.body;

		/* log the event */
		const loginfo = {username};
		logger.log({
			level: 'info',
			message: `new game ${log.dict2log(loginfo)}`
		});

		const game_id = 'test_game';

		/* return the status */
		return status.OK(res, {game_id});

	} catch (error) {

		return status.Error(res, error);
	}
}

module.exports = {
	validate,
	new_game
};