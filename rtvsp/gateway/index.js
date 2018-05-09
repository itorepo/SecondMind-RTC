'use strict';

const config = require('config');
const logger = require('../../loggers/combined')('Gateway');
const StreamServer = require('./server');

/**
 * @public Instantiates ever changing core module of RTP Gateway object,
 *      containing all the private implementation of the Gateway itself.
 *      Also adds it the native Events emitting / handling functionality
 *      for easy subscribing to all major events occurred within the
 *      Gateway's environment
 * @type {{created, age, uptime, getInstance}}
 */
const GatewayCoreLoader = (() => {
	// some local vars locked into the
	// GatewayCore's closure
	let instance, options = null,
		instants = 0;

	// a `Template Method` pattern
	// for quickly building timing
	// methods for a new classes
	function makeUpTime(from) {
		return () => {
			return Date.now() - from;
		}
	}
	// GatewayCore instance initialization
	// code goes here
	function init(config) {
		const begun = Date.now();
		const EventEmitter = require('events');
		logger.info('Gateway core init() is starting up....');
		instance = new EventEmitter();
		instance.created = Date.now();
		instance.age = makeUpTime(instance.created);
		instance.uptime = makeUpTime(begun);
		instance.options = config.get('rtvsp.gateway');
		instance.emit('created', instance.created);
		// @event Gateway.core.on('created', () => {}};
		//.............................
		// TODO: {GatewayBaseStrategies}
		// load properties according to
		// Gateways's config
		//.............................
		// @event Gateway.core.on('initialized', (took) => {});
		instance.emit('initialized', instance.uptime);
		logger.info('core initialization done');
		return instance;
	}

	/**
	 * @public Interface implementation for GatewayCoreLoader
	 * @method `Singleton.getInstance()`
	 * @returns {EventEmitter} instance of `GatewayCoreLoader`
	 */
	return {
		created: Date.now(),
		age: makeUpTime(this.created),
		uptime: () => (instance) ? instance.uptime : 0,

		getInstance: () => {
			if (!instance) { instance = init(config); }
			// keep `getInstance() calls stats`
			return instance && (++instants && instance.emit('instance', instants));
		}
	};
})();

/**
 * The top-level CLass of RTVSP domain, mostly
 * serves as a common container holding it's server
 * connection workers references pool, also providing
 * basic interface for their accessors and lookup.
 */
class StreamGateway extends GatewayCoreLoader {

	assign (dispatcher) {
		// register for all Gateway's Server events of interest!
		// let server = StreamGateway.getInstance().getListener();
		// dispatcher
		//      .register(server.on('ready'))
		//      .register(server.on('listening'))
		//      .register(server.on('connect'))
		//      .register(server.on('error'))

	};

	attach (serverProcess) {

		if (serverProcess instanceof StreamServer) {
			this.coreProcess = serverProcess;

			// using async / await
			//const feed = this.coreProcess.startASRFeed();
			//const stats = feed.getAsrStats();
			//
			//logger.debug(stats);
		}


	};

	setUp () {
		return new Promise((resolve, reject) => {
			//tmp testing:
			logger.debug('StreamGateway.setUp was executed');
			return setTimeout(
				resolve (StreamGateway)
					.then((Gateway) => {
							logger.debug("StreamGateway.setUp async was just Resolved");
					}),
				5000
			);
		});
	}

}

module.exports = new StreamGateway();