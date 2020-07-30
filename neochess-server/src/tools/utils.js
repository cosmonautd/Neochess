const _ = require('lodash');
const strings = require('../resources/strings');

const invalid = (result) => {
	return !result.isEmpty()
}

const random_username = () => {
	return `${_.sample(strings.ADJECTIVES)} ${_.sample(strings.ANIMALS)}`;
}

const secondsToMinutes = (seconds) => {
	const m = Math.floor(seconds/60);
	const s = (seconds % 60).toString().padStart(2, '0');
	return `${m}:${s}`;
};

module.exports = {
	invalid,
	random_username,
	secondsToMinutes
}