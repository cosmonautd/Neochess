const winston = require('winston');

const logformat = winston.format.printf(({ level, message, label, timestamp }) => {
	return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = (label) => {
	return winston.createLogger({
		level: 'verbose',
		format: winston.format.combine(
			winston.format.label({label: label}),
			winston.format.timestamp(),
			logformat
		),
		transports: [
		  new winston.transports.Console(),
		  new winston.transports.File({filename: 'neochess.log'})
		]
	});
}

isArray = function(a) {
	return (!!a) && (a.constructor === Array);
};

isObject = function(a) {
	return (!!a) && (a.constructor === Object);
};

const dict2log = (dict) => {
	let string = '[';
	let dict_size = Object.keys(dict).length;
	let count = 0;
	for(key in dict) {
		let k = key
		let value = ``
		if(isArray(dict[key])) { value = JSON.stringify(dict[key]) }
		else if(isObject(dict[key])) { value = dict2log(dict[key]) }
		else { value = dict[key] }

		string += `${k}: ${value}`;
		count += 1;
		if(count != dict_size) string += `, `;
	}
	string += `]`
	return string
}

module.exports = {
	logger: logger,
	dict2log: dict2log
}