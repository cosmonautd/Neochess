const _ = require('lodash');
const strings = require('../resources/strings');

const invalid = (result) => {
	return !result.isEmpty()
}

const random_username = () => {
	return `${_.sample(strings.ADJECTIVES)} ${_.sample(strings.ANIMALS)}`;
}

module.exports = {
	invalid,
	random_username
}