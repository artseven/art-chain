const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(timestamp, lastHash, hash, data) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
	}

	//helper method for outputting data in the console
	toString() {
		return `Block - 
			Timestamp: ${this.timestamp}
			Last Hash: ${this.lastHash.substring(0, 10)}
			Hash     : ${this.hash.substring(0, 10)}
			Data     : ${this.data}`;
	}
	//static allows to use function directly without creating instance of a Block class
	static genesis() {
		return new this('Genesis time', '-----', '0x777777777777777', []);
	}

	static mineBlock(lastBlock, data) {
		const timestamp = Date.now();
		const lastHash  = lastBlock.hash;
		const hash = Block.hash(timestamp, lastHash, data);

		return new this(timestamp, lastHash, hash, data);
	}

	static hash(timestamp, lastHash, data) {
		return SHA256(`${timestamp}${lastHash}${data}`).toString();
	}
}

module.exports = Block;