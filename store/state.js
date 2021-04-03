const Trie = require('./trie');

class State {
    constructor() {
        this.stateTrie = new Trie();
    }

    putAccount({ address, accountData }) {
        this.stateTrie.put({ key: address, value: accountData });
    }
}

module.exports = State;