/* environment variables */
require('dotenv').config()

/* modules */
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

/* configure express */
const app = express();
const server = require('http').Server(app);

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

/* start the server */
server.listen(port, () => {
	logger.log({
		level: 'info',
		message: `neochess server started at port ${port}`
	});
});