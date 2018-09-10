const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
//split env variable into array if present, otherwise empty array
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

// $env:HTTP_PORT=3002; $env:P2P_PORT=5002; $env:PEERS='ws://localhost:5001';

class P2pServer {
	constructor(blockchain) {
		this.blockchain = blockchain;
		this.sockets = [];
	}

	listen () {
		const server = new Websocket.Server({ port: P2P_PORT });
		server.on('connection', socket => this.connectSocket(socket));

		this.connectToPeers();

		console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
	}

	connectToPeers() {
		peers.forEach(peer => {
			// ws://localhost:5001
			const socket = new Websocket(peer);

			socket.on('open', () => this.connectSocket(socket));
		});
	}

	connectSocket(socket) {
		this.sockets.push(socket);
		console.log('Socket connected');
	}
}


module.exports = P2pServer;