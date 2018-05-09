'use strict';

/** @requires: */
const config = require('config');
const debug = require('debug');
const {format, createLogger, transports} = require('winston');

/** @static */
const Combined = (() => {

	/** @private */
	const {combine, timestamp, label, printf} = format;
	const defaults = {
		format: printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`),
		label: config.get('app.title'),
		transport: ['Console']
	};

	/** @constructor */
	return function (logsLabel, transport, format) {

		logsLabel = logsLabel || defaults.label;
		transport = transport || defaults.transport;
		format = format || defaults.format;

		const combined = createLogger({
			format: combine(label({
				label: logsLabel
			}), timestamp(), format),
			transports: new transports[transport]()
		});

		/**
		 * An extra method to attach the advanced debugging
		 * module by overriding winston's shipped `debug()`
		 * log level with Node's "debug" module
		 *
		 * @param {String} debugLabel - to distinguish debug
		 *      records among the rest of output.
		 * @returns {Function} - a standalone function to be
		 *      used for more detailed information output when
		 *      eliminating the program errors.
		 */
		combined.initDebug = (debugLabel) => {
			let debugLogger = debug(
				config.get('app.title') + ':' + debugLabel
			);
			/** @override */
			combined.debug = debugLogger;
			return debugLogger;
		};

		// use same debug label as for logs by default.
		// Uer can override it by executing `initDebug()`
		// method again, later at his code
		combined.initDebug(logsLabel);
		return combined;
	}

})();

/**
 * @exports {Combined}
 * @example
 * Usage:
 <code>
	 const logger = require('./loggers/Combined')('myApp', 'Console');
     logger.initDebug('myModule');
	 ...
	 logger.log('my app log');
     logger.debug('pass a secret for developers');
 </code>
 */
module.exports = Combined;