'use strict';

const StreamBroker = (() => {

	const Singleton = function() {
		/** @private scope */
		let instance = null;

		function init() {
			// some hidden initialization
			return new Singleton();
		}


		/** @public scope */
		return {
			getInstance () {
				if (!instance) {
					instance = init();
				}
				return instance;
			},


		};
	};
})();

module.exports = StreamBroker;
