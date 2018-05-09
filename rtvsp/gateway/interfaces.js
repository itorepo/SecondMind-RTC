"use strict";

const IListener = 'IListenerID';
const IStreamer = 'IStreamerID';

const IListenerSymb = Symbol.for(IListener);
const IStreamerSymb = Symbol.for(IStreamer);


class AbstractStreamSender {
	/**
	 * Constructs the prototype of main Server's
	 * incoming client's stream connections.
	 * @param sender {net.Socket} - native Sockets impl
	 * */
	constructor (sender, listener) {
		this[IStreamerSymb] = sender;
		this.connListener = listener;
		return Object.assign(this, sender);
	}

	onData (streamData) {
		// forwarding incoming data to server instance
		return streamData.pipe(this.connListener);
	}
}


class AbstractStreamListener {
	/**
	 * Constructs the prototype of main Gateway's Server
	 * by copying it's main methods to wrapper class.
	 * @param listener {net.Server} - native Sockets impl
	 * */
	constructor (listener) {
		this[IListenerSymb] = listener;
		return Object.assign (this, listener);
	}
	/**
	 * Notifies about new connection being received, also
	 * passes an instance of net.Socket constructed by exact
	 * client's characteristics.
	 * @param connectionStream {net.Socket} - data stream from incoming connection
	 * @returns {any}
	 */
	onConnection (connectionStream) {
		//override incoming object with our wrapper impl
		let sender = new AbstractStreamSender (connectionStream, this);
		connectionStream.on('data', sender.onData);
		return sender;
	}
}

module.exports = {
	AbstractStreamListener, AbstractStreamSender, IListenerSymb, IStreamerSymb
};