/* environment variables */
require('dotenv').config()

/* modules */
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

/* configure express and socket.io */
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

/* configure logger */
const Log = require('./tools/log');
const logger = Log.logger('server');

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
	console.log('a user connected');
	socket.on('disconnect', function (reason) {
		console.log('a user disconnected');
	});
});

/* start the server */
server.listen(port, () => {
	logger.log({
		level: 'info',
		message: `neochess server started at port ${port}`
	});
});