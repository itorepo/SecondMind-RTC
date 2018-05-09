'use strict';

const config = require('config');
const logger = require('../loggers/combined')('ConnectionPool');


class ConnectionPool {
	// maximum number of parallel Streams
	// handled by gateway at the same time
	maxPoolSize = config.get('rtvsp.Gateway.connectionLimit');

	constructor() {
		this.pool = [];
	}

	accept (connection) {
		if (this.pool.length < this.maxPoolSize ) {
			this.pool.push(connection);
		} else {
			let message = "Max pool size reached!";
			logger.debug(message);
			//throw new Error();
			return false;
		}
	}
}