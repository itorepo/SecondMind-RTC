'use strict';

const StreamBroker = require('./rtvsp/broker');
const StreamGateway = require('./rtvsp/gateway/index');

const server = require('./rtvsp/gateway/server');
const broker = StreamBroker.getInstance();

StreamGateway.attach(server);   // route all events to Gateway
StreamGateway.assign(broker);   // broker will intercept all messages and wil
								// behave according to strategy defined
StreamGateway.setUp();
broker.dispatch();
