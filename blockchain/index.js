const Block = require('./block')

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ block }) {
        return new Promise((resolve, reject) => {
            Block.validateBlock({
                lastBlock: this.chain[this.chain.length - 1],
                block
            }).then(() => {
                this.chain.push(block);

            return resolve();
            }).catch(error => reject(error))
        });
    }
}

module.exports = Blockchain;

const blockchain = new Blockchain();

for (let i = 0; i<1000; i++) {
    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
    const block = Block.mineBlock({
        lastBlock,
        beneficiary: 'beneficiary'
    });
    blockchain.addBlock({ block })

    console.log('block', block);
}