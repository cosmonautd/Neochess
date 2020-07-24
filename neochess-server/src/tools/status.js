const errors = require('../resources/errors');

class Exception extends Error {

	constructor(code, extra) {
		super(code);
		this.code = code;
		this.name = this.constructor.name;
		this.extra = extra;
		Error.captureStackTrace(this, this.constructor);
	}

	define(res) {

		const status = errors[this.code].status;

		switch (status) {

			case 'Unauthorized': return Unauthorized(res, err(this.code, this.extra));
			case 'NotFound': return NotFound(res, err(this.code, this.extra));
			case 'Conflict': return Conflict(res, err(this.code, this.extra));
			case 'BadRequest': return BadRequest(res, err(this.code, this.extra));
			
			default:
				return InternalServerError(res, this);
		}
	}
}

const err = (code, info) => {
	return {
		code,
		message: code == 'INPUT_ERROR' ? null : errors[code].message,
		info
	}
}

const respond = (res, status, output) => {
	res.status = status;
	let body = {};
	if (output.data) body = { ...body, ...output.data };
	if (output.error) {
		body.error = {
			code: output.error.code,
			message: output.error.message,
		}
		if(output.error.info) body.error.info = output.error.info;
	}
	if (res.status.toString()[0] == '2')
		body.success = true;
	else body.success = false;
	body.status = res.status;
	return res.json(body);
}

const OK = (res, data) => {
	return respond(res, 200, {data});
}

const Created = (res, data) => {
	return respond(res, 201, {data});
}

const BadRequest = (res, error) => {
	return respond(res, 400, {error});
}

const Unauthorized = (res, error) => {
	return respond(res, 401, {error});
}

const NotFound = (res, error) => {
	return respond(res, 404, {error});
}

const Conflict = (res, error) => {
	return respond(res, 409, {error});
}

const InternalServerError = (res, error_js) => {
	let dev = process.env.NODE_ENV == 'development';
	let error = err('INTERNAL_SERVER_ERROR', dev ? error_js.stack : null);
	return respond(res, 500, {error});
}

const Err = (res, error) => {
	if (error.name == 'Exception') return error.define(res);
	else return InternalServerError(res, error);
}

module.exports = {
	OK,
	Created,
	BadRequest,
	Unauthorized,
	NotFound,
	Conflict,
	InternalServerError,
	Error: Err,
	Exception: (code, extra) => new Exception(code, extra),
}