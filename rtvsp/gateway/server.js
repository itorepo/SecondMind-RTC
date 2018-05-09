"use strict";

const net = require('net');
const config = require('config').get('rtvsp.Server');
const logger = require('../../loggers/combined')('Server');
//const StreamClient = require('./client');

const interfaces = require('./interfaces');
const {AbstractStreamListener, AbstractStreamSender, IListenerSymb, IStreamerSymb} = interfaces;
// let's try a wrapper approach
class StreamServer extends AbstractStreamListener {

	// serve become in listening state - means 'Ready'
	listening = () => logger.info(`server listening on ${this.formattedAddress}`);
	listen = () => logger.info(`server started at: ${this.formattedAddress}`);

	connection = (stream) => {
		let mssg = 'established the connection with sender';
		let sender = new AbstractStreamSender(stream, this.socket);
		this.emit('client', sender);
		logger.info(mssg);
	};

	error = (error) => {
		logger.warn('an error occurred: ', error.code);
		if (error.code === 'EADDRINUSE') {
			logger.error('Address in use, retrying...');
			return setTimeout(() => {
				this.socket.close();
				this.socket.listen(port, host);
			}, 1000);
		}
	};

	close = () => logger.info('no connections left; closing server');

	defineHandlers = () => {
		this.socket.on('listening', this.listening);
		this.socket.on('close', this.close);
		this.socket.on('connection', this.connection);
		this.socket.on('error', this.error);
	};

	constructor (socket) {
		// must be assigned to
		// this[IListenerSymb]
		// after parent class
		// constructor executed
		super(socket);
		this.defineHandlers();

		let record = `server started at ${this.formattedAddress}`;
		socket.listen(config.host, config.port, () => logger.info(record));
		return this;
	};


	get formattedAddress() {
		if (!this.address ) {
			this.address = (this.socket.address)
				? this.socket.address
				: () => {host: config.host, port: config.port};
		}
		let {host, port} = this.address();
		return `${host}:${port}`;
	};
	// getter can't use arrow function body
	get socket() {return this[IListenerSymb]};
}


/**
 * @exports
 * @type {{StreamServer: (function(): StreamServer)}}
 */
module.exports = {
	StreamServer: () => {
		return new StreamServer (
			net.createServer()
		);
	},
};








		/*
		// lock it to the private stash
		this.listener = netserver;
		// re-assign all useful methods to first class instance
		// TODO: define a single array's mapping callback method
		// to re-assign all methods in one hit
		this.emmit = function (event, ...rest) {
			return this.listener.emmit (event, rest);
		};
		this.on = function (event, ...rest) {
			return this.listener.on (event, rest);
		};
		this.once = function (event, ...rest) {
			return this.listener.once (event, rest);
		};
		// now return an `upgraded` this to the public


	}
}
*/
/*
const server = net.createServer((connection) => {		// ON connection


	let client = Client(connection);
	logger.info("first client connected");
	client.write("Welcome to SecondMind RTVSP!" + "\r\n");


})	// listen must be wrapped with server.start() method
.listen(config.port, config.host, () => {			// ON listening
	let {port, address} = server.address();
	logger.info(`server started at ${address + ":" + port}`);
});

server.on('connection', (client) => logger.info('next client connected'));
server.on('listening', () => logger.info(`server listening on ${server.address().family}`));
server.on('close', () => logger.info('no connections left; closing server'));

server.on('error', (error) => {
	logger.warn('an error occurred: ', error.code);
	if (error.code === 'EADDRINUSE') {
		logger.error('Address in use, retrying...');
		return setTimeout(() => {
			server.close();
			server.listen(port, host);
		}, 1000);
	}
});

*/

/**
server = server.ref();
server = server.unref();
address = server.address();
number = server.getConnections();
number = server.maxPoolSize = number (511 (not 512))
boolean = server.listening
--------------------------
socket.setKeepAlive(true, 9000);
socket.setNoDelay(true); // do not buffer data - send immediately
socket.setTimeout(10000, () => {console.log('Socket is idle for 10sec already')});
--------------------------
server.close([callback])
--------------------------
Set `maxPoolSize` property to reject connections when the server's connection count gets high.
It is not recommended to use this option once a socket has been sent to a child with child_process.fork().
*/