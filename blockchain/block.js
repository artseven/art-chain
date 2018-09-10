const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../config');


class Block {
	constructor(timestamp, lastHash, hash, data, nonce) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
		this.nonce = nonce;
	}

	//helper method for outputting data in the console
	toString() {
		return `Block - 
			Timestamp: ${this.timestamp}
			Last Hash: ${this.lastHash.substring(0, 10)}
			Hash     : ${this.hash.substring(0, 10)}
			Nonce    : ${this.nonce}
			Data     : ${this.data}`;
	}
	//static allows to use function directly without creating instance of a Block class
	static genesis() {
		return new this('Genesis time', '-----', '0x777777777777777', [], 0);
	}

	static mineBlock(lastBlock, data) {
		let hash, timestamp;
		const lastHash  = lastBlock.hash;
		let nonce = 0;

		do {
			nonce++;
			timestamp = Date.now();
			hash = Block.hash(timestamp, lastHash, data, nonce);
			//while leading zeros don't satisfy the difficulty requirement
		} while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

		return new this(timestamp, lastHash, hash, data, nonce);
	}

	static hash(timestamp, lastHash, data, nonce) {
		return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString();
	}

	static blockHash(block) {
		//declaring and assigning to the same variables within this block object
		const { timestamp, lastHash, data, nonce } = block;
		return Block.hash(timestamp, lastHash, data, nonce);
	}
}

module.exports = Block;