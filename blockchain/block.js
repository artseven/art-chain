const ChainUtil = require('../chain.util');
const { DIFFICULTY, MINE_RATE } = require('../config');


class Block {
	constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
		this.nonce = nonce;
		this.difficulty = difficulty || DIFFICULTY;
	}

	//helper method for outputting data in the console
	toString() {
		return `Block - 
			Timestamp : ${this.timestamp}
			Last Hash : ${this.lastHash.substring(0, 10)}
			Hash      : ${this.hash.substring(0, 10)}
			Nonce     : ${this.nonce}
			Difficulty: ${this.difficulty}
			Data      : ${this.data}`;
	}
	//static allows to use function directly without creating instance of a Block class
	static genesis() {
		return new this('Genesis time', '-----', '0x777777777777777', [], 0, DIFFICULTY);
	}

	static mineBlock(lastBlock, data) {
		let hash, timestamp;
		const lastHash  = lastBlock.hash;
		let { difficulty } = lastBlock;
		let nonce = 0;

		do {
			nonce++;
			timestamp = Date.now();
			difficulty = Block.adjustDifficulty(lastBlock, timestamp);
			hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
			//while leading zeros don't satisfy the difficulty requirement
		} while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

		return new this(timestamp, lastHash, hash, data, nonce, difficulty);
	}

	static hash(timestamp, lastHash, data, nonce, difficulty) {
		return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
	}

	static blockHash(block) {
		//declaring and assigning to the same variables within this block object
		const { timestamp, lastHash, data, nonce, difficulty } = block;
		return Block.hash(timestamp, lastHash, data, nonce, difficulty);
	}

	static adjustDifficulty(lastBlock, currentTime) {
		let { difficulty } = lastBlock;
		// The ternary operator is an operator that takes three arguments. The first argument is a comparison argument, the second is the result upon a true comparison, and the third is the result upon a false comparison
		difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
		return difficulty;
	}
}

module.exports = Block;