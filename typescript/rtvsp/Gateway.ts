


namespace RTVS {

	interface SpeechGateway {

		/*
		broker: ConnectionBrocker;
		server: GatewayServer;
		address: Address;
		*/
		start(): Promise<boolean>;
		stop(): Promise<boolean>;
		restart(): Promise<boolean>;
		status(): Promise<JSON>;

		isUp(): boolean;
		isReady(): boolean;
	}

}

class RltVoStrGateway {
	public static server
}